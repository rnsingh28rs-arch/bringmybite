import { getSupabaseRealtimeAccessToken } from './supabaseRest';

type RealtimeTable = string;
type RealtimeCallback = (table: string, payload: unknown) => void;
export type RealtimeStatus = 'connecting' | 'connected' | 'subscribed' | 'error' | 'disconnected';
type StatusCallback = (status: RealtimeStatus, detail?: string) => void;

const projectUrl = (import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tknmdgeikmlsprqppukf.supabase.co').replace(/\/$/, '');
const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_8aupeYk6D1q4c0T_EtzgtQ_rViMvNME';

// Realtime V2 uses Phoenix's positional-array wire format.
const websocketUrl = () => `${projectUrl.replace(/^http/, 'ws')}/realtime/v1/websocket?apikey=${encodeURIComponent(anonKey)}&vsn=2.0.0`;

export function subscribeToSupabaseChanges(tables: RealtimeTable[], onChange: RealtimeCallback, onStatus?: StatusCallback): () => void {
  if (typeof WebSocket === 'undefined' || !tables.length) return () => {};

  let socket: WebSocket | null = null;
  let heartbeat: number | undefined;
  let reconnectTimer: number | undefined;
  let joinTimeout: number | undefined;
  let closed = false;
  let reconnectAttempt = 0;
  let ref = 0;
  let joinRef = '';
  let activeAccessToken = '';
  let subscribed = false;
  const topic = `realtime:public:portal-${Math.random().toString(36).slice(2)}`;
  const report = (status: RealtimeStatus, detail?: string) => onStatus?.(status, detail);

  const cleanupSocket = () => {
    if (heartbeat !== undefined) { window.clearInterval(heartbeat); heartbeat = undefined; }
    if (joinTimeout !== undefined) { window.clearTimeout(joinTimeout); joinTimeout = undefined; }
    if (socket) {
      try { socket.close(); } catch {}
      socket = null;
    }
    subscribed = false;
  };

  const scheduleReconnect = (detail?: string) => {
    if (closed || reconnectTimer !== undefined) return;
    report('error', detail || 'Realtime connection interrupted; reconnecting.');
    reconnectAttempt += 1;
    const delay = Math.min(30000, 1000 * 2 ** Math.min(reconnectAttempt - 1, 5));
    reconnectTimer = window.setTimeout(() => { reconnectTimer = undefined; connect(); }, delay);
  };

  const connect = () => {
    if (closed) return;
    cleanupSocket();
    report('connecting', 'Opening secure Realtime connection.');
    try { socket = new WebSocket(websocketUrl()); }
    catch (error) { scheduleReconnect(error instanceof Error ? error.message : 'Could not create WebSocket.'); return; }
    const thisSocket = socket;
    joinRef = String(++ref);
    activeAccessToken = getSupabaseRealtimeAccessToken();

    thisSocket.addEventListener('open', () => {
      if (closed || socket !== thisSocket || thisSocket.readyState !== WebSocket.OPEN) return;
      report('connected', 'WebSocket open; waiting for Supabase to accept the database subscription.');
      thisSocket.send(JSON.stringify([
        joinRef,
        String(++ref),
        topic,
        'phx_join',
        {
          config: {
            broadcast: { ack: false, self: false },
            presence: { key: '' },
            postgres_changes: tables.map(table => ({ event: '*', schema: 'public', table }))
          },
          access_token: activeAccessToken
        }
      ]));
      joinTimeout = window.setTimeout(() => {
        if (closed || socket !== thisSocket || subscribed) return;
        scheduleReconnect('Supabase did not acknowledge the Postgres-change subscription within 8 seconds.');
      }, 8000);
      heartbeat = window.setInterval(() => {
        if (getSupabaseRealtimeAccessToken() !== activeAccessToken) {
          connect();
          return;
        }
        if (thisSocket.readyState === WebSocket.OPEN) {
          thisSocket.send(JSON.stringify([null, String(++ref), 'phoenix', 'heartbeat', {}]));
        }
      }, 25000);
    });

    thisSocket.addEventListener('message', event => {
      try {
        const message = JSON.parse(String(event.data));
        if (!Array.isArray(message) || message[2] !== topic) return;
        const eventName = message[3];
        const payload = message[4];
        if (eventName === 'postgres_changes') {
          const data = payload?.data ?? payload;
          const table = data?.table;
          if (typeof table === 'string' && tables.includes(table)) onChange(table, data);
          return;
        }
        if (eventName === 'phx_reply' && message[0] === joinRef) {
          if (payload?.status === 'ok') {
            const accepted = payload?.response?.postgres_changes;
            if (!Array.isArray(accepted) || accepted.length < tables.length) {
              scheduleReconnect('Supabase accepted the channel but did not confirm every requested Postgres-change table.');
              return;
            }
            subscribed = true;
            reconnectAttempt = 0;
            if (joinTimeout !== undefined) { window.clearTimeout(joinTimeout); joinTimeout = undefined; }
            report('subscribed', `Supabase confirmed ${accepted.length} Postgres-change subscription(s).`);
          } else if (payload?.status === 'error') {
            const detail = payload?.response?.reason || payload?.response?.message || JSON.stringify(payload?.response || payload);
            scheduleReconnect(`Supabase rejected the Realtime subscription: ${String(detail).slice(0, 240)}`);
          }
        }
      } catch {
        // Ignore malformed frames; status and reconnect handling remain active.
      }
    });

    thisSocket.addEventListener('close', event => {
      if (socket !== thisSocket) return;
      report('disconnected', `WebSocket closed (code ${event.code}).`);
      scheduleReconnect(`WebSocket closed (code ${event.code}).`);
    });
    thisSocket.addEventListener('error', () => {
      if (socket === thisSocket) scheduleReconnect('WebSocket transport error.');
    });
  };

  connect();
  return () => {
    closed = true;
    if (reconnectTimer !== undefined) window.clearTimeout(reconnectTimer);
    cleanupSocket();
    report('disconnected', 'Realtime subscription stopped.');
  };
}
