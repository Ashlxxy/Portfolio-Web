type PresenceUser = {
  id: string;
  socketId: string;
  name: string;
  avatar: string;
  color: string;
  isOnline: boolean;
  location: string;
  flag: string;
  lastSeen: string;
  createdAt: string;
};

type PresenceMessage = {
  event: string;
  data?: Record<string, string>;
};

type WorkerWebSocket = WebSocket & {
  accept: () => void;
};

declare const WebSocketPair: {
  new(): { 0: WebSocket; 1: WorkerWebSocket };
};

const clients = new Map<string, { socket: WorkerWebSocket; user: PresenceUser }>();

function send(socket: WorkerWebSocket, event: string, data: unknown) {
  socket.send(JSON.stringify({ event, data }));
}

function broadcast(event: string, data: unknown) {
  const payload = JSON.stringify({ event, data });
  for (const { socket } of clients.values()) {
    socket.send(payload);
  }
}

function getUsers() {
  return Array.from(clients.values()).map(({ user }) => user);
}

function handlePresence(request: Request) {
  const pair = new WebSocketPair();
  const client = pair[0];
  const server = pair[1];
  const url = new URL(request.url);
  const now = new Date().toISOString();
  const socketId = crypto.randomUUID();
  const sessionId = url.searchParams.get("sessionId") || crypto.randomUUID();

  const user: PresenceUser = {
    id: sessionId,
    socketId,
    name: url.searchParams.get("name") || "Guest",
    avatar: url.searchParams.get("avatar") || "1",
    color: url.searchParams.get("color") || "#60a5fa",
    isOnline: true,
    location: "Unknown",
    flag: "??",
    lastSeen: now,
    createdAt: now,
  };

  server.accept();
  clients.set(socketId, { socket: server, user });
  send(server, "session", { sessionId, socketId });
  broadcast("users-updated", getUsers());

  server.addEventListener("message", (event) => {
    let message: PresenceMessage;
    try {
      message = JSON.parse(String(event.data)) as PresenceMessage;
    } catch {
      return;
    }

    const entry = clients.get(socketId);
    if (!entry) return;
    entry.user.lastSeen = new Date().toISOString();

    if (message.event === "update-user") {
      entry.user.name = message.data?.username || entry.user.name;
      entry.user.avatar = message.data?.avatar || entry.user.avatar;
      entry.user.color = message.data?.color || entry.user.color;
      broadcast("users-updated", getUsers());
    }

    if (message.event === "msg-send" && message.data?.content) {
      broadcast("msg-receive", {
        id: String(Date.now()),
        sessionId: entry.user.id,
        flag: entry.user.flag,
        country: entry.user.location,
        username: entry.user.name,
        avatar: entry.user.avatar,
        color: entry.user.color,
        content: message.data.content,
        createdAt: new Date().toISOString(),
      });
    }

    if (message.event === "cursor-change") {
      broadcast("cursor-changed", {
        socketId,
        pos: message.data,
      });
    }
  });

  server.addEventListener("close", () => {
    clients.delete(socketId);
    broadcast("users-updated", getUsers());
  });

  server.addEventListener("error", () => {
    clients.delete(socketId);
    broadcast("users-updated", getUsers());
  });

  return new Response(null, { status: 101, webSocket: client } as ResponseInit & { webSocket: WebSocket });
}

export default {
  fetch(request: Request, env: { ASSETS: { fetch: typeof fetch } }) {
    const url = new URL(request.url);
    if (url.pathname === "/presence" && request.headers.get("Upgrade") === "websocket") {
      return handlePresence(request);
    }

    return env.ASSETS.fetch(request);
  },
};
