type RealtimeTable = string;
type RealtimeCallback = (table: string, payload: unknown) => void;

const projectUrl = (import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tknmdgeikmlsprqppukf.supabase.co').replace(/\/$/, '');
const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_8aupeYk6D1q4c0T_EtzgtQ_rViMvNME';

// Realtime V2 uses Phoenix's positional-array wire format. Keep the protocol
// version and frame shape paired; V1 expects an object/map instead.
const websocketUrl = () => `${projectUrl.replace(/^http/, 'ws')}/realtime/v1/websocket?apikey=${encodeURIComponent(anonKey)}&vsn=2.0.0`;

export function subscribeToSupabaseChanges(tables: RealtimeTable[], onChange: RealtimeCallback): () => void {
  if (typeof WebSocket === 'undefined' || !tables.length) return () => {};

  let socket: WebSocket | null = null;
  let heartbeat: number | undefined;
  let reconnectTimer: number | undefined;
  let closed = false;
  let reconnectAttempt = 0;
  let ref = 0;
  let joinRef = '';
  const topic = `realtime:public:portal-${Math.random().toString(36).slice(2)}`;

  const cleanupSocket = () => {
    if (heartbeat !== undefined) { window.clearInterval(heartbeat); heartbeat = undefined; }
    if (socket) {
      socket.onopen = null;
      socket.onmessage = null;
      socket.onerror = null;
      socket.onclose = null;
      try { socket.close(); } catch {}
      socket = null;
    }
  };

  const scheduleReconnect = () => {
    if (closed || reconnectTimer !== undefined) return;
    reconnectAttempt += 1;
    const delay = Math.min(30000, 1000 * 2 ** Math.min(reconnectAttempt - 1, 5));
    reconnectTimer = window.setTimeout(() => { reconnectTimer = undefined; connect(); }, delay);
  };

  const connect = () => {
    if (closed) return;
    cleanupSocket();
    try { socket = new WebSocket(websocketUrl()); }
    catch { scheduleReconnect(); return; }
    joinRef = String(++ref);

    socket.addEventListener('open', () => {
      if (!socket || socket.readyState !== WebSocket.OPEN) return;
      socket.send(JSON.stringify([
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
          access_token: anonKey
        }
      ]));
      heartbeat = window.setInterval(() => {
        if (socket?.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify([null, String(++ref), 'phoenix', 'heartbeat', {}]));
        }
      }, 25000);
    });

    socket.addEventListener('message', event => {
      try {
        const message = JSON.parse(String(event.data));
        if (!Array.isArray(message) || message[2] !== topic) return;
        const eventName = message[3];
        const payload = message[4];
        if (eventName === 'postgres_changes') {
          const data = payload?.data ?? payload;
          const table = data?.table;
          if (typeof table === 'string') onChange(table, data);
          return;
        }
        if (eventName === 'phx_reply' && payload?.status === 'error') scheduleReconnect();
      } catch {
        // Ignore malformed frames; the database remains the source of truth.
      }
    });

    socket.addEventListener('close', scheduleReconnect);
    socket.addEventListener('error', scheduleReconnect);
  };

  connect();
  return () => {
    closed = true;
    if (reconnectTimer !== undefined) window.clearTimeout(reconnectTimer);
    cleanupSocket();
  };
}
