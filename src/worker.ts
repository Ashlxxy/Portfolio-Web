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

type ChatMessage = {
  id: string;
  sessionId: string;
  flag: string;
  country: string;
  username: string;
  avatar: string;
  color?: string;
  content: string;
  createdAt: string;
};

type PresenceMessage = {
  event: string;
  data?: Record<string, unknown>;
};

type WorkerWebSocket = WebSocket & {
  accept: () => void;
};

type DurableStorage = {
  get<T>(key: string): Promise<T | undefined>;
  put<T>(key: string, value: T): Promise<void>;
};

type DurableObjectState = {
  storage: DurableStorage;
};

type DurableObjectNamespace = {
  idFromName(name: string): unknown;
  get(id: unknown): { fetch: typeof fetch };
};

type Env = {
  ASSETS: { fetch: typeof fetch };
  PRESENCE_ROOM: DurableObjectNamespace;
};

declare const WebSocketPair: {
  new(): { 0: WebSocket; 1: WorkerWebSocket };
};

const HISTORY_KEY = "chat-history";
const MAX_HISTORY = 100;

function send(socket: WorkerWebSocket, event: string, data: unknown) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ event, data }));
  }
}

export class PresenceRoom {
  private clients = new Map<string, { socket: WorkerWebSocket; user: PresenceUser }>();

  constructor(private state: DurableObjectState) {}

  async fetch(request: Request) {
    const url = new URL(request.url);
    if (url.pathname !== "/presence" || request.headers.get("Upgrade") !== "websocket") {
      return new Response("Not found", { status: 404 });
    }

    const pair = new WebSocketPair();
    const client = pair[0];
    const server = pair[1];
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
      location: "",
      flag: "",
      lastSeen: now,
      createdAt: now,
    };

    server.accept();
    this.clients.set(socketId, { socket: server, user });
    send(server, "session", { sessionId, socketId });
    this.broadcastUsers();

    server.addEventListener("message", (event) => {
      void this.handleMessage(socketId, String(event.data));
    });

    server.addEventListener("close", () => this.removeClient(socketId));
    server.addEventListener("error", () => this.removeClient(socketId));

    return new Response(null, { status: 101, webSocket: client } as ResponseInit & { webSocket: WebSocket });
  }

  private async handleMessage(socketId: string, raw: string) {
    let message: PresenceMessage;
    try {
      message = JSON.parse(raw) as PresenceMessage;
    } catch {
      return;
    }

    const entry = this.clients.get(socketId);
    if (!entry) return;
    entry.user.lastSeen = new Date().toISOString();

    if (message.event === "msgs-fetch-init") {
      const history = await this.getHistory();
      send(entry.socket, "msgs-receive-init", history.slice(-50));
      return;
    }

    if (message.event === "msgs-fetch-history") {
      const history = await this.getHistory();
      const before = Number(message.data?.before);
      const filtered = Number.isFinite(before)
        ? history.filter((item) => Number(item.id) < before)
        : history;
      send(entry.socket, "msgs-receive-history", {
        messages: filtered.slice(-50),
        hasMore: filtered.length > 50,
        reactions: {},
      });
      return;
    }

    if (message.event === "presence-ping") {
      this.broadcastUsers();
      return;
    }

    if (message.event === "update-user") {
      entry.user.name = String(message.data?.username || entry.user.name);
      entry.user.avatar = String(message.data?.avatar || entry.user.avatar);
      entry.user.color = String(message.data?.color || entry.user.color);
      this.broadcastUsers();
      return;
    }

    if (message.event === "msg-send" && message.data?.content) {
      const chatMessage: ChatMessage = {
        id: String(Date.now()),
        sessionId: entry.user.id,
        flag: entry.user.flag,
        country: entry.user.location,
        username: entry.user.name,
        avatar: entry.user.avatar,
        color: entry.user.color,
        content: String(message.data.content).slice(0, 500),
        createdAt: new Date().toISOString(),
      };
      const history = await this.getHistory();
      history.push(chatMessage);
      await this.state.storage.put(HISTORY_KEY, history.slice(-MAX_HISTORY));
      this.broadcast("msg-receive", chatMessage);
      return;
    }

    if (message.event === "cursor-change") {
      const data = message.data as { pos?: unknown } | undefined;
      this.broadcast("cursor-changed", {
        socketId,
        pos: data?.pos ?? message.data,
      });
      return;
    }

    if (message.event === "confetti-send") {
      this.broadcast("confetti-receive", {
        id: String(message.data?.id || crypto.randomUUID()),
        socketId,
        emoji: String(message.data?.emoji || ""),
        x: Number(message.data?.x || 0),
        y: Number(message.data?.y || 0),
        intensity: Number(message.data?.intensity || 0.5),
      });
    }
  }

  private async getHistory() {
    return (await this.state.storage.get<ChatMessage[]>(HISTORY_KEY)) || [];
  }

  private getUsers() {
    return Array.from(this.clients.values()).map(({ user }) => user);
  }

  private broadcastUsers() {
    this.broadcast("users-updated", this.getUsers());
  }

  private broadcast(event: string, data: unknown) {
    const payload = JSON.stringify({ event, data });
    for (const [socketId, { socket }] of this.clients) {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(payload);
      } else {
        this.clients.delete(socketId);
      }
    }
  }

  private removeClient(socketId: string) {
    this.clients.delete(socketId);
    this.broadcastUsers();
  }
}

export default {
  fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    if (url.pathname === "/presence" && request.headers.get("Upgrade") === "websocket") {
      const id = env.PRESENCE_ROOM.idFromName("global");
      return env.PRESENCE_ROOM.get(id).fetch(request);
    }

    return env.ASSETS.fetch(request);
  },
};
