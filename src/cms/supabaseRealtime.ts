import { getSupabaseRealtimeAccessToken, hasValidStaffSession } from './supabaseRest';

type RealtimeTable = string;
type RealtimeCallback = (table: string, payload: unknown) => void;
type RealtimeOptions = { requireStaffAuth?: boolean };

const projectUrl = (import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tknmdgeikmlsprqppukf.supabase.co').replace(/\/$/, '');
const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_8aupeYk6D1q4c0T_EtzgtQ_rViMvNME';

// Supabase's live Realtime logs report the V1 serializer ("expected a map").
// Use the V1 object-frame protocol explicitly rather than sending V2 arrays.
const websocketUrl = () => `${projectUrl.replace(/^http/, 'ws')}/realtime/v1/websocket?apikey=${encodeURIComponent(anonKey)}&vsn=1.0.0`;

export function subscribeToSupabaseChanges(tables: RealtimeTable[], onChange: RealtimeCallback, options: RealtimeOptions = {}): () => void {
  if (typeof WebSocket === 'undefined' || !tables.length) return () => {};

  let socket: WebSocket | null = null;
  let heartbeat: number | undefined;
  let reconnectTimer: number | undefined;
  let closed = false;
  let reconnectAttempt = 0;
  let ref = 0;
  let joinRef = '';
  let activeAccessToken = '';
  const topic = `realtime:public:portal-${Math.random().toString(36).slice(2)}`;

  const cleanupSocket = () => {
    if (heartbeat !== undefined) {
      window.clearInterval(heartbeat);
      heartbeat = undefined;
    }
    const previous = socket;
    socket = null;
    if (previous) {
      previous.onopen = null;
      previous.onmessage = null;
      previous.onerror = null;
      previous.onclose = null;
      try { previous.close(); } catch {}
    }
  };

  const scheduleReconnect = () => {
    if (closed || reconnectTimer !== undefined) return;
    reconnectAttempt += 1;
    const delay = Math.min(30000, 1000 * 2 ** Math.min(reconnectAttempt - 1, 5));
    reconnectTimer = window.setTimeout(() => {
      reconnectTimer = undefined;
      connect();
    }, delay);
  };

  const connect = () => {
    if (closed) return;
    cleanupSocket();
    if (options.requireStaffAuth && !hasValidStaffSession()) {
      if (reconnectTimer !== undefined) { window.clearTimeout(reconnectTimer); reconnectTimer = undefined; }
      return;
    }
    let current: WebSocket;
    try {
      current = new WebSocket(websocketUrl());
    } catch {
      scheduleReconnect();
      return;
    }
    socket = current;
    joinRef = String(++ref);
    activeAccessToken = getSupabaseRealtimeAccessToken();

    current.onopen = () => {
      if (socket !== current || current.readyState !== WebSocket.OPEN) return;
      current.send(JSON.stringify({
        topic,
        event: 'phx_join',
        payload: {
          config: {
            broadcast: { ack: false, self: false },
            presence: { key: '' },
            postgres_changes: tables.map(table => ({ event: '*', schema: 'public', table }))
          },
          access_token: activeAccessToken
        },
        ref: String(++ref),
        join_ref: joinRef
      }));

      heartbeat = window.setInterval(() => {
        if (socket !== current || current.readyState !== WebSocket.OPEN) return;
        if (getSupabaseRealtimeAccessToken() !== activeAccessToken) {
          connect();
          return;
        }
        current.send(JSON.stringify({
          topic: 'phoenix',
          event: 'heartbeat',
          payload: {},
          ref: String(++ref)
        }));
      }, 25000);
    };

    current.onmessage = event => {
      if (socket !== current) return;
      try {
        const message = JSON.parse(String(event.data));
        if (!message || Array.isArray(message) || message.topic !== topic) return;
        const eventName = message.event;
        const payload = message.payload ?? {};
        if (eventName === 'postgres_changes') {
          const data = payload?.data ?? payload;
          const table = data?.table ?? data?.record?.table;
          if (typeof table === 'string') onChange(table, data);
          return;
        }
        if (eventName === 'phx_reply' && payload?.status === 'ok') reconnectAttempt = 0;
        if (eventName === 'phx_reply' && payload?.status === 'error') scheduleReconnect();
        if (eventName === 'phx_error' || eventName === 'phx_close') scheduleReconnect();
        if (eventName === 'system' && payload?.status === 'error') scheduleReconnect();
      } catch {
        // Ignore malformed frames; REST polling remains the fallback.
      }
    };

    current.onclose = () => {
      if (socket === current) scheduleReconnect();
    };
    current.onerror = () => {
      if (socket === current) scheduleReconnect();
    };
  };

  const handleStaffSessionChange = () => {
    if (closed || !options.requireStaffAuth) return;
    if (!hasValidStaffSession()) {
      if (reconnectTimer !== undefined) { window.clearTimeout(reconnectTimer); reconnectTimer = undefined; }
      cleanupSocket();
      return;
    }
    connect();
  };
  if (options.requireStaffAuth) window.addEventListener('bmb-staff-session-change', handleStaffSessionChange);

  connect();
  return () => {
    if (options.requireStaffAuth) window.removeEventListener('bmb-staff-session-change', handleStaffSessionChange);
    closed = true;
    if (reconnectTimer !== undefined) {
      window.clearTimeout(reconnectTimer);
      reconnectTimer = undefined;
    }
    cleanupSocket();
  };
}
