type RealtimeTable = string;

type RealtimeCallback = (table: string, payload: unknown) => void;

const projectUrl = (import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tknmdgeikmlsprqppukf.supabase.co').replace(/\/$/, '');
const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_8aupeYk6D1q4c0T_EtzgtQ_rViMvNME';

const websocketUrl = () => `${projectUrl.replace(/^http/, 'ws')}/realtime/v1/websocket?apikey=${encodeURIComponent(anonKey)}&vsn=1.0.0`;

export function subscribeToSupabaseChanges(tables: RealtimeTable[], onChange: RealtimeCallback): () => void {
  if (typeof WebSocket === 'undefined' || !tables.length) return () => {};

  const socket = new WebSocket(websocketUrl());
  const topic = `realtime:public:portal-${Math.random().toString(36).slice(2)}`;
  let ref = 0;
  let heartbeat: number | undefined;
  let closed = false;
  const token = localStorage.getItem('bmb_supabase_access_token') || anonKey;

  const send = (event: string, payload: Record<string, unknown>, joinRef?: string | null) => {
    if (socket.readyState !== WebSocket.OPEN) return;
    ref += 1;
    socket.send(JSON.stringify([joinRef ?? String(ref), String(ref), topic, event, payload]));
  };

  socket.addEventListener('open', () => {
    send('phx_join', {
      config: {
        broadcast: { ack: false, self: false },
        presence: { key: '' },
        postgres_changes: tables.map(table => ({ event: '*', schema: 'public', table }))
      },
      access_token: token
    });
    heartbeat = window.setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify([null, String(++ref), 'phoenix', 'heartbeat', {}]));
    }, 25000);
  });

  socket.addEventListener('message', event => {
    try {
      const message = JSON.parse(event.data);
      if (message?.[2] !== topic || message?.[3] !== 'postgres_changes') return;
      const data = message?.[4]?.data;
      const table = data?.table;
      if (typeof table === 'string') onChange(table, data);
    } catch {
      // Ignore malformed realtime frames; the authoritative database remains the source of truth.
    }
  });

  socket.addEventListener('close', () => {
    if (heartbeat) window.clearInterval(heartbeat);
  });

  return () => {
    if (closed) return;
    closed = true;
    if (heartbeat) window.clearInterval(heartbeat);
    if (socket.readyState === WebSocket.OPEN) {
      ref += 1;
      socket.send(JSON.stringify([topic, String(ref), topic, 'phx_leave', {}]));
    }
    socket.close();
  };
}
