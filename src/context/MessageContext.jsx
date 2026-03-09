import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getMessages, markAsDeliveredApi, markAsSeenApi, sendMessage } from "../api/chatApi";
import echo from "../lib/bootstrap";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useActiveChat } from "./ActiveChatContext";
import { useChatList } from "./ChatListContext";

const MessageContext = createContext();

export function MessageProvider({ children }) {
  const messageAbortRef = useRef(null);
  const { user, token } = useAuth();
  const { activeChat } =
    useActiveChat();
  const { setChats } = useChatList();

  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] =
    useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [usersInChat, setUsersInChat] = useState([]);
  const [cursor, setCursor] = useState(null);


  const typingTimeoutRef = useRef(null);
  const activeChannelRef = useRef(null);

  /* ================= LOAD ================= */

  const loadMessages = useCallback(async (chatId) => {

    // ✅ cancel previous request
    if (messageAbortRef.current) {
      messageAbortRef.current.abort();
    }

    const controller = new AbortController();
    messageAbortRef.current = controller;

    setLoadingMessages(true);

    try {
      const response = await getMessages(chatId, {
        signal: controller.signal,
      });
      console.log(response);
      const newMessages = response.data.data.reverse();

      setMessages(newMessages);
      setCursor(response.data.next_cursor);
    } catch (err) {
      if (err.name !== "CanceledError" && err.name !== "AbortError") {
        console.error(err);
      }
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  /* ================= REALTIME ================= */


  /* ================= PRESENCE ================= */

  /* ================= SEEN ================= */

  const handleSeen = useCallback(async () => {
    if (!activeChat) return;
    await markAsSeenApi(activeChat.id);
  }, [activeChat]);



  useEffect(() => {
    if (!activeChat) return;

    const presence = echo.join(
      `presence.chat.${activeChat.id}`
    );

    presence.here((users) => {
      setUsersInChat(users);
      handleSeen();
    });

    presence.joining((user) => {
      setUsersInChat((prev) => [...prev, user]);
      setMessages((prev) => (
        prev.map((m) => {
          if (!m.is_seen) {
            return { ...m, is_seen: true }
          }
          else {
            return m;
          }
        })
      ))
    });

    presence.leaving((user) => {
      setUsersInChat((prev) =>
        prev.filter((u) => u.id !== user.id)
      );
    });

    return () =>
      echo.leave(`presence.chat.${activeChat.id}`);
  }, [activeChat, handleSeen]);



  /* ================= GLOBAL PRESENCE ================= */

  useEffect(() => {
    const channel = echo.join("online");

    channel.here(async (users) => {
      setOnlineUsers(users);
      await markAsDeliveredApi();
    });

    channel.joining((user) => {
      setOnlineUsers((prev) => [...prev, user]);
      setMessages((prev) => (
        prev.map((m) => {
          if (!m.is_delivered) {
            return { ...m, is_delivered: true }
          }
          else {
            return m;
          }
        })
      )
      )
    });

    channel.leaving((user) => {
      setOnlineUsers((prev) =>
        prev.filter((u) => u.id !== user.id)
      );
    });

    return () => echo.leave("online");
  }, []);



  useEffect(() => {
    if (!activeChat) return;

    if (activeChannelRef.current) {
      echo.leave(activeChannelRef.current);
    }

    const channelName = `chat.${activeChat.id}`;
    activeChannelRef.current = channelName;

    const channel = echo.private(channelName);

    channel.listen("MessageSent", (e) => {
      if (e.user.id === user.id) return;

      setMessages((prev) => {
        if (prev.some((m) => m.id === e.id)) return prev;
        return [...prev, e];
      });
    });

    channel.listenForWhisper("typing", (e) => {
      if (e.user_id === user.id) return;
      console.log('typing')
      setTypingUser(e);
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(
        () => setTypingUser(null),
        2000
      );
    });

    return () => echo.leave(channelName);
  }, [activeChat, user.id]);

  /* ================= SEND ================= */

  const handleSendMessage = useCallback(

    async (payload, type = "text") => {
      const payloadData = {
        chat_id: activeChat.id,
        body: payload.get("body"),
        type: payload.get("type"),
        user_id: user.id,
        is_delivered: payload.get("is_delivered") ?? (isUserOnline(otherUser?.id) ? 1 : 0),
        is_seen: UserExistInChat ? 1 : 0,
      };

      // Only add optional fields if they exist
      if (payload.get("file") && payload.get("file") != 'null') payloadData.file = payload.get("file");
      if (payload.get("file_path") && payload.get("file_path") != 'null') payloadData.file_path = payload.get("file_path");
      if (payload.get("reply_to") && payload.get("reply_to") != 'null') payloadData.reply_to = payload.get("reply_to");
      if (payload.get("reply_message") && payload.get("reply_message") != 'null') payloadData.reply_message = payload.get("reply_message");

      if (!activeChat) return;
      const tempId = Date.now();
      const optimisticMessage = {
        id: tempId,
        chat_id: activeChat.id,
        body: payload.get("body"),
        type,
        reply_to: payload.get("reply_to"),
        reply_message: JSON.parse(payload.get("reply_message")),
        file_path: payload.get("file_path"),
        file: payload.get("file"),
        preview: payload.get("preview"),
        file_name: payload.get("file")?.name,
        file_size: payload.get("file")?.size,
        created_at: new Date().toISOString(),
        user,
        user_id: user.id,
        is_delivered: payload.get("is_delivered") ?? isUserOnline(
          otherUser?.id
        )
          ? 1
          : 0,
        is_seen: UserExistInChat ? 1 : 0,
        pending: true,
        uploadProgress: 0,
      };
      setMessages((prev) => [...prev, optimisticMessage]);
      try {
        const response =
          type === "file" || type === "excel"
            ? (
              await axios.post(
                import.meta.env.VITE_APP_URL + "/api/messages",
                payload,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setMessages((prev) =>
                      prev.map((m) =>
                        m.id === tempId
                          ? { ...m, uploadProgress: percentCompleted }
                          : m
                      )
                    );
                    console.log(messages);
                  },
                }
              )
            ).data
            :

            await sendMessage(payloadData);


        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempId
              ? { ...response, pending: false, is_delivered: isUserOnline(otherUser?.id) ? 1 : 0, is_seen: UserExistInChat ? 1 : 0 }
              : m
          )
        );

        setChats((prev) => {
          const idx = prev.findIndex(
            (c) => c.id === activeChat.id
          );
          if (idx === -1) return prev;

          const updated = {
            ...prev[idx],
            last_message: response,
          };

          return [
            updated,
            ...prev.filter(
              (c) => c.id !== activeChat.id
            ),
          ];
        });
      } catch (err) {
        setMessages((prev) =>
          prev.filter((m) => m.id !== tempId)
        );
      }
    },
    [
      activeChat,
      user,
      token,
      setChats,
    ]
  );

  /* ================= TYPING ================= */

  const sendTyping = useCallback(() => {
    if (!activeChat) return;
    echo.private(`chat.${activeChat.id}`).whisper(
      "typing",
      {
        user_id: user.id,
      }
    );
  }, [activeChat, user.id]);


  /* ================= MEMOS ================= */

  const onlineIds = useMemo(
    () => new Set(onlineUsers.map((u) => u.id)),
    [onlineUsers]
  );


  const isUserOnline = useCallback(
    (id) => onlineIds.has(id),
    [onlineIds]
  );

  const otherUser = useMemo(() => {
    if (!activeChat) return null;
    return activeChat.users.find(
      (u) => u.id !== user?.id
    );
  }, [activeChat, user?.id]);

  const UserExistInChat = useMemo(() => {
    if (!otherUser) return false;
    return usersInChat.some(
      (u) => u.id === otherUser.id
    );
  }, [usersInChat, otherUser]);


  const value = useMemo(
    () => ({
      messages,
      setMessages,
      loadingMessages,
      loadMessages,
      typingUser,
      handleSendMessage,
      sendTyping,
      onlineUsers,
      isUserOnline,
      UserExistInChat,
      usersInChat,
      otherUser,
      cursor,
      setCursor,
    }),
    [
      messages,
      loadingMessages,
      loadMessages,
      typingUser,
      handleSendMessage,
      sendTyping,
      onlineUsers,
      isUserOnline,
      UserExistInChat,
      usersInChat,
      otherUser,
      cursor,
      setCursor,
    ]
  );

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
}

export const useMessages = () =>
  useContext(MessageContext);