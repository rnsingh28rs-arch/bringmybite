type RealtimeTable = string;
type RealtimeCallback = (table: string, payload: unknown) => void;

const projectUrl = (import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tknmdgeikmlsprqppukf.supabase.co').replace(/\/$/, '');
const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_8aupeYk6D1q4c0T_EtzgtQ_rViMvNME';

// Supabase Realtime's V2 JSON serializer uses object-shaped frames. The legacy
// V1 array serializer triggers "V1 JSON Serializer expected a map" on the server.
const websocketUrl = () => `${projectUrl.replace(/^http/, 'ws')}/realtime/v1/websocket?apikey=${encodeURIComponent(anonKey)}&vsn=2.0.0`;

interface RealtimeFrame {
  topic?: string;
  event?: string;
  payload?: any;
  ref?: string | number | null;
  join_ref?: string | null;
}

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
  const currentToken = () => anonKey;

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

  const send = (frame: RealtimeFrame) => {
    if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify(frame));
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
    try {
      socket = new WebSocket(websocketUrl());
    } catch {
      scheduleReconnect();
      return;
    }
    joinRef = String(++ref);

    socket.addEventListener('open', () => {
      if (!socket || socket.readyState !== WebSocket.OPEN) return;
      send({
        topic,
        event: 'phx_join',
        ref: String(++ref),
        join_ref: joinRef,
        payload: {
          config: {
            broadcast: { ack: false, self: false },
            presence: { key: '' },
            postgres_changes: tables.map(table => ({ event: '*', schema: 'public', table }))
          },
          access_token: currentToken()
        }
      });
      heartbeat = window.setInterval(() => {
        send({ topic: 'phoenix', event: 'heartbeat', payload: {}, ref: String(++ref) });
      }, 25000);
    });

    socket.addEventListener('message', event => {
      try {
        const message = JSON.parse(String(event.data)) as RealtimeFrame;
        if (message.topic !== topic) return;
        if (message.event === 'postgres_changes') {
          const data = message.payload?.data ?? message.payload;
          const table = data?.table ?? data?.record?.table;
          if (typeof table === 'string') onChange(table, data);
          return;
        }
        if (message.event === 'phx_reply' && message.payload?.status === 'error') scheduleReconnect();
        if (message.event === 'system' && message.payload?.status === 'error') scheduleReconnect();
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
