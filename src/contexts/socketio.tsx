"use client";
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { useToast } from "@/components/ui/use-toast";

export type User = {
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
  isAdmin?: boolean;
};
export type Message = {
  id: string;
  sessionId: string;
  flag: string;
  country: string;
  username: string;
  avatar: string;
  color?: string;
  content: string;
  createdAt: string | Date;
  editedAt?: string | Date;
  replyTo?: { id: string; username: string; content: string };
};

export type SystemMessage = {
  id: string;
  type: "system";
  subtype: "join";
  sessionId: string;
  username: string;
  flag: string;
  createdAt: string | Date;
};

export type ChatItem = Message | SystemMessage;

export type Reaction = { emoji: string; sessionIds: string[] };

export type UserProfile = { name: string; avatar: string; color: string; isAdmin?: boolean };

export type CursorPosition = { x: number; y: number };

type SocketContextType = {
  socket: Socket | null;
  users: User[];
  setUsers: Dispatch<SetStateAction<User[]>>;
  msgs: ChatItem[];
  reactions: Map<string, Reaction[]>;
  profileMap: Map<string, UserProfile>;
  cursorPositions: Map<string, CursorPosition>;
  focusedCursorId: string | null;
  setFocusedCursorId: Dispatch<SetStateAction<string | null>>;
  hasMoreMessages: boolean;
  loadingHistory: boolean;
  fetchOlderMessages: () => void;
  initStatus: "idle" | "loading" | "loaded";
  fetchInitialMessages: () => void;
};

const INITIAL_STATE: SocketContextType = {
  socket: null,
  users: [],
  setUsers: () => { },
  msgs: [],
  reactions: new Map(),
  profileMap: new Map(),
  cursorPositions: new Map(),
  focusedCursorId: null,
  setFocusedCursorId: () => { },
  hasMoreMessages: true,
  loadingHistory: false,
  fetchOlderMessages: () => { },
  initStatus: "idle",
  fetchInitialMessages: () => { },
};

export const SocketContext = createContext<SocketContextType>(INITIAL_STATE);

const SESSION_ID_KEY = "portfolio-site-session-id";
const LOCAL_SOCKET_ID_KEY = "portfolio-local-socket-id";
const LOCAL_PRESENCE_KEY = "portfolio-local-presence";

const NAME_ADJECTIVES = [
  "Brave",
  "Bold",
  "Bright",
  "Calm",
  "Clever",
  "Creative",
  "Curious",
  "Gentle",
  "Happy",
  "Kind",
  "Lucky",
  "Mighty",
  "Proud",
  "Quick",
  "Silent",
  "Smart",
];

const NAME_NOUNS = [
  "Falcon",
  "Eagle",
  "Fox",
  "Otter",
  "Serpent",
  "Panda",
  "Tiger",
  "Wolf",
  "Lynx",
  "Raven",
  "Hawk",
  "Bear",
  "Phoenix",
  "Shark",
  "Lion",
  "Dragon",
];

const PROFILE_COLORS = [
  "#60a5fa",
  "#f87171",
  "#4ade80",
  "#facc15",
  "#c084fc",
  "#fb923c",
  "#f43f5e",
  "#818cf8",
  "#22d3ee",
  "#a3e635",
];

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function getOrCreateLocalId(key: string, prefix: string) {
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const id = `${prefix}-${crypto.randomUUID()}`;
  localStorage.setItem(key, id);
  return id;
}

function createRandomProfile() {
  const name = `${randomItem(NAME_ADJECTIVES)} ${randomItem(NAME_NOUNS)}`;
  return {
    name,
    avatar: String(Math.floor(Math.random() * 100) + 1),
    color: randomItem(PROFILE_COLORS),
  };
}

function readLocalPresence(): User[] {
  try {
    const data = JSON.parse(localStorage.getItem(LOCAL_PRESENCE_KEY) || "[]") as User[];
    const activeAfter = Date.now() - 12_000;
    return data.filter((user) => new Date(user.lastSeen).getTime() > activeAfter);
  } catch {
    return [];
  }
}

function writeLocalPresence(users: User[]) {
  localStorage.setItem(LOCAL_PRESENCE_KEY, JSON.stringify(users));
}

const SocketContextProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [msgs, setMsgs] = useState<ChatItem[]>([]);
  const [reactions, setReactions] = useState<Map<string, Reaction[]>>(new Map());
  const [profileMap, setProfileMap] = useState<Map<string, UserProfile>>(new Map());
  const [cursorPositions, setCursorPositions] = useState<Map<string, CursorPosition>>(new Map());
  const [focusedCursorId, setFocusedCursorId] = useState<string | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [initStatus, setInitStatus] = useState<"idle" | "loading" | "loaded">("idle");
  const socketRef = useRef<Socket | null>(null);
  const initStatusRef = useRef<"idle" | "loading" | "loaded">("idle");

  const fetchInitialMessages = useCallback(() => {
    if (initStatusRef.current !== "idle") return;
    const s = socketRef.current;
    if (!s) return;
    initStatusRef.current = "loading";
    setInitStatus("loading");
    s.emit("msgs-fetch-init");
  }, []);

  const fetchOlderMessages = useCallback(() => {
    const s = socketRef.current;
    if (!s || loadingHistory || !hasMoreMessages) return;
    setMsgs(current => {
      if (current.length === 0) return current;
      const oldestId = Number(current[0].id);
      if (!oldestId) return current;
      setLoadingHistory(true);
      s.emit("msgs-fetch-history", { before: oldestId });
      return current;
    });
  }, [loadingHistory, hasMoreMessages]);

  // Keep profileMap in sync — only adds/updates, never removes
  useEffect(() => {
    if (users.length === 0) return;
    setProfileMap(prev => {
      const next = new Map(prev);
      for (const u of users) {
        next.set(u.id, { name: u.name, avatar: u.avatar, color: u.color, isAdmin: u.isAdmin });
      }
      return next;
    });
  }, [users]);
  const { toast } = useToast();

  // Local static-site fallback. This keeps the online/profile UI working on
  // Cloudflare static assets. Set NEXT_PUBLIC_WS_URL to use the real Socket.IO
  // backend for cross-device realtime presence and chat.
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_WS_URL || typeof window === "undefined") return;

    const sessionId = getOrCreateLocalId(SESSION_ID_KEY, "local-session");
    const socketId = getOrCreateLocalId(LOCAL_SOCKET_ID_KEY, "local-socket");
    const savedProfile = {
      name: localStorage.getItem("username") || "",
      avatar: localStorage.getItem("avatar") || "",
      color: localStorage.getItem("color") || "",
    };
    const randomProfile = createRandomProfile();
    const profile = {
      name: savedProfile.name || randomProfile.name,
      avatar: savedProfile.avatar || randomProfile.avatar,
      color: savedProfile.color || randomProfile.color,
    };

    localStorage.setItem("username", profile.name);
    localStorage.setItem("avatar", profile.avatar);
    localStorage.setItem("color", profile.color);

    const makeCurrentUser = (): User => ({
      id: sessionId,
      socketId,
      name: localStorage.getItem("username") || profile.name,
      avatar: localStorage.getItem("avatar") || profile.avatar,
      color: localStorage.getItem("color") || profile.color,
      isOnline: true,
      location: "Unknown",
      flag: "??",
      lastSeen: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    let webSocket: WebSocket | null = null;
    let localModeStarted = false;
    let interval = 0;
    let channel: BroadcastChannel | null = null;

    const publishPresence = () => {
      const current = makeCurrentUser();
      const others = readLocalPresence().filter((user) => user.socketId !== socketId);
      const nextUsers = [current, ...others];
      writeLocalPresence(nextUsers);
      setUsers(nextUsers);
      channel?.postMessage({ type: "presence", users: nextUsers });
    };

    const handlers = new Map<string, Set<(data: unknown) => void>>();
    const dispatch = (event: string, data?: unknown) => {
      handlers.get(event)?.forEach((handler) => handler(data));
    };

    const localSocket = {
      id: socketId,
      connected: false,
      on: (event: string, handler: (data: unknown) => void) => {
        const eventHandlers = handlers.get(event) || new Set();
        eventHandlers.add(handler);
        handlers.set(event, eventHandlers);
        return localSocket;
      },
      off: (event: string, handler: (data: unknown) => void) => {
        handlers.get(event)?.delete(handler);
        return localSocket;
      },
      emit: (event: string, payload?: { username?: string; avatar?: string; color?: string; content?: string }) => {
        if (webSocket?.readyState === WebSocket.OPEN) {
          webSocket.send(JSON.stringify({ event, data: payload }));
          if (event === "update-user" && payload) {
            if (payload.username) localStorage.setItem("username", payload.username);
            if (payload.avatar) localStorage.setItem("avatar", payload.avatar);
            if (payload.color) localStorage.setItem("color", payload.color);
          }
          return localSocket;
        }

        if (event === "update-user" && payload) {
          if (payload.username) localStorage.setItem("username", payload.username);
          if (payload.avatar) localStorage.setItem("avatar", payload.avatar);
          if (payload.color) localStorage.setItem("color", payload.color);
          publishPresence();
        }
        if (event === "msg-send" && payload?.content) {
          const current = makeCurrentUser();
          const message: Message = {
            id: `${Date.now()}`,
            sessionId: current.id,
            flag: current.flag,
            country: current.location,
            username: current.name,
            avatar: current.avatar,
            color: current.color,
            content: payload.content,
            createdAt: new Date().toISOString(),
          };
          setMsgs((existing) => [...existing, message]);
        }
        return localSocket;
      },
      disconnect: () => {
        webSocket?.close();
        return localSocket;
      },
      connect: () => localSocket,
      io: { on: () => localSocket, off: () => localSocket },
    } as unknown as Socket;

    setSocket(localSocket);
    socketRef.current = localSocket;
    initStatusRef.current = "loaded";
    setInitStatus("loaded");
    setHasMoreMessages(false);

    const handleStorage = (event: StorageEvent) => {
      if (event.key === LOCAL_PRESENCE_KEY) {
        setUsers(readLocalPresence());
      }
    };
    const handleChannel = (event: MessageEvent<{ type: string; users: User[] }>) => {
      if (event.data?.type === "presence") setUsers(readLocalPresence());
    };

    const startLocalMode = () => {
      if (localModeStarted) return;
      localModeStarted = true;
      localSocket.connected = true;
      channel = "BroadcastChannel" in window ? new BroadcastChannel("portfolio-local-presence") : null;
      publishPresence();
      interval = window.setInterval(publishPresence, 5_000);
      window.addEventListener("storage", handleStorage);
      channel?.addEventListener("message", handleChannel);
      dispatch("connect");
    };

    try {
      const presenceUrl = new URL("/presence", window.location.href);
      presenceUrl.protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      presenceUrl.searchParams.set("sessionId", sessionId);
      presenceUrl.searchParams.set("name", profile.name);
      presenceUrl.searchParams.set("avatar", profile.avatar);
      presenceUrl.searchParams.set("color", profile.color);

      webSocket = new WebSocket(presenceUrl);
      const fallbackTimer = window.setTimeout(() => {
        if (webSocket?.readyState !== WebSocket.OPEN) {
          webSocket?.close();
          startLocalMode();
        }
      }, 1500);

      webSocket.addEventListener("open", () => {
        window.clearTimeout(fallbackTimer);
        localSocket.connected = true;
        dispatch("connect");
      });
      webSocket.addEventListener("message", (event) => {
        try {
          const message = JSON.parse(String(event.data)) as { event: string; data: unknown };
          if (message.event === "session") {
            const data = message.data as { sessionId?: string; socketId?: string };
            if (data.sessionId) localStorage.setItem(SESSION_ID_KEY, data.sessionId);
            if (data.socketId) localSocket.id = data.socketId;
          }
          if (message.event === "users-updated") setUsers(message.data as User[]);
          if (message.event === "msg-receive") setMsgs((existing) => [...existing, message.data as Message]);
          if (message.event === "cursor-changed") {
            const data = message.data as { pos: CursorPosition; socketId: string };
            setCursorPositions((prev) => {
              const next = new Map(prev);
              next.set(data.socketId, data.pos);
              return next;
            });
          }
          dispatch(message.event, message.data);
        } catch {
          // Ignore malformed presence messages.
        }
      });
      webSocket.addEventListener("close", () => {
        localSocket.connected = false;
        dispatch("disconnect");
        startLocalMode();
      });
      webSocket.addEventListener("error", () => {
        localSocket.connected = false;
        dispatch("connect_error");
        startLocalMode();
      });
    } catch {
      startLocalMode();
    }

    return () => {
      if (interval) window.clearInterval(interval);
      const remaining = readLocalPresence().filter((user) => user.socketId !== socketId);
      writeLocalPresence(remaining);
      channel?.postMessage({ type: "presence", users: remaining });
      channel?.close();
      window.removeEventListener("storage", handleStorage);
      webSocket?.close();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // SETUP SOCKET.IO
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_WS_URL) return;
    const newSocket = io(process.env.NEXT_PUBLIC_WS_URL!, {
      auth: {
        sessionId: localStorage.getItem(SESSION_ID_KEY),
      },
    });
    setSocket(newSocket);
    socketRef.current = newSocket;
    newSocket.on("connect", () => { });
    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });
    newSocket.on("disconnect", (reason) => {
      // Reconnect on server-initiated disconnect and network drops.
      // "io client disconnect" means the user explicitly called .disconnect(), so skip that.
      if (reason !== "io client disconnect") {
        newSocket.connect();
      }
    });
    newSocket.on("users-updated", (data: User[]) => {
      setUsers(data);
    });
    newSocket.on("cursor-changed", (data: { pos: { x: number; y: number }; socketId: string }) => {
      setCursorPositions(prev => {
        const next = new Map(prev);
        next.set(data.socketId, data.pos);
        return next;
      });
    });
    newSocket.on("msgs-receive-init", (msgs) => {
      setMsgs(msgs);
      setHasMoreMessages(true);
      initStatusRef.current = "loaded";
      setInitStatus("loaded");
    });
    newSocket.on("msgs-receive-history", (data: { messages: ChatItem[]; hasMore: boolean; reactions: Record<string, Reaction[]> }) => {
      setMsgs(prev => [...data.messages, ...prev]);
      setHasMoreMessages(data.hasMore);
      setLoadingHistory(false);
      if (data.reactions) {
        setReactions(prev => {
          const next = new Map(prev);
          for (const [msgId, rxns] of Object.entries(data.reactions)) {
            if (rxns.length === 0) next.delete(msgId);
            else next.set(msgId, rxns);
          }
          return next;
        });
      }
    });
    newSocket.on("session", ({ sessionId }) => {
      localStorage.setItem(SESSION_ID_KEY, (sessionId));
    });

    newSocket.on("msg-receive", (msgs) => {
      // Drop live messages until the popover is opened and init has been fetched.
      // The init fetch returns the latest 50 user messages anyway, so nothing is lost.
      if (initStatusRef.current !== "loaded") return;
      setMsgs((p) => [...p, msgs]);
    });

    newSocket.on("warning", (data: { message: string }) => {
      toast({
        variant: "destructive",
        title: "System Warning",
        description: data.message,
      });
    });

    newSocket.on("msg-delete", (data: { id: string | number }) => {
      setMsgs((prev) => prev.filter((m) => String(m.id) !== String(data.id)));
    });

    newSocket.on("msg-update", (data: { id: string; content: string; editedAt: string }) => {
      setMsgs((prev) => prev.map((m) =>
        String(m.id) === String(data.id) && (!("type" in m) || !m.type)
          ? { ...m, content: data.content, editedAt: data.editedAt }
          : m
      ));
    });

    newSocket.on("reactions-init", (data: Record<string, Reaction[]>) => {
      setReactions(new Map(Object.entries(data)));
    });
    newSocket.on("reaction-update", (data: { messageId: string; reactions: Reaction[] }) => {
      setReactions(prev => {
        const next = new Map(prev);
        if (data.reactions.length === 0) next.delete(data.messageId);
        else next.set(data.messageId, data.reactions);
        return next;
      });
    });

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SocketContext.Provider value={{ socket, users, setUsers, msgs, reactions, profileMap, cursorPositions, focusedCursorId, setFocusedCursorId, hasMoreMessages, loadingHistory, fetchOlderMessages, initStatus, fetchInitialMessages }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
