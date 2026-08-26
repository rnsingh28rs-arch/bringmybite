type RealtimeTable = string;
type RealtimeCallback = (table: string, payload: unknown) => void;

const projectUrl = (import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tknmdgeikmlsprqppukf.supabase.co').replace(/\/$/, '');
const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_8aupeYk6D1q4c0T_EtzgtQ_rViMvNME';
const websocketUrl = () => `${projectUrl.replace(/^http/, 'ws')}/realtime/v1/websocket?apikey=${encodeURIComponent(anonKey)}&vsn=1.0.0`;

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

  const currentToken = () => localStorage.getItem('bmb_supabase_access_token') || anonKey;

  const cleanupSocket = () => {
    if (heartbeat) { window.clearInterval(heartbeat); heartbeat = undefined; }
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
    if (closed || reconnectTimer) return;
    reconnectAttempt += 1;
    const delay = Math.min(30000, 1000 * 2 ** Math.min(reconnectAttempt - 1, 5));
    reconnectTimer = window.setTimeout(() => { reconnectTimer = undefined; connect(); }, delay);
  };

  const connect = () => {
    if (closed) return;
    cleanupSocket();
    socket = new WebSocket(websocketUrl());
    joinRef = String(++ref);

    socket.addEventListener('open', () => {
      reconnectAttempt = 0;
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
          access_token: currentToken()
        }
      ]));
      heartbeat = window.setInterval(() => {
        if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify([null, String(++ref), 'phoenix', 'heartbeat', {}]));
      }, 25000);
    });

    socket.addEventListener('message', event => {
      try {
        const message = JSON.parse(event.data);
        if (message?.[2] !== topic) return;
        if (message?.[3] === 'postgres_changes') {
          const data = message?.[4]?.data;
          const table = data?.table;
          if (typeof table === 'string') onChange(table, data);
          return;
        }
        if (message?.[3] === 'phx_reply' && message?.[4]?.status === 'error') scheduleReconnect();
      } catch {
        // Ignore malformed realtime frames; the database remains authoritative.
      }
    });

    socket.addEventListener('close', scheduleReconnect);
    socket.addEventListener('error', scheduleReconnect);
  };

  const handleAuthChange = () => { if (!closed) connect(); };
  window.addEventListener('bmb:staff-authenticated', handleAuthChange);
  window.addEventListener('bmb:staff-logout', handleAuthChange);
  connect();

  return () => {
    closed = true;
    if (reconnectTimer) window.clearTimeout(reconnectTimer);
    window.removeEventListener('bmb:staff-authenticated', handleAuthChange);
    window.removeEventListener('bmb:staff-logout', handleAuthChange);
    cleanupSocket();
  };
}
