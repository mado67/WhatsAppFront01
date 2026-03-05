import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { openChatApi } from "../api/chatApi";
import echo from "../lib/bootstrap";
import { useAuth } from "./AuthContext";
import { useChatList } from "./ChatListContext";

const ActiveChatContext = createContext();

export function ActiveChatProvider({ children }) {
    const { user } = useAuth();

    const [activeChat, setActiveChat] = useState(null);
    const [showChat, setShowChat] = useState(false);
    const { setChats } = useChatList();

    /* ================= OPEN CHAT ================= */

    const openChat = useCallback(async (userId) => {
        const { data } = await openChatApi(userId);
        setActiveChat(data);
        setShowChat(true);
    }, []);





    /* ---------------- USER CHANNEL ---------------- */
    useEffect(() => {
        if (!user?.id) return;

        const channel = echo.private(`user.${user.id}`);

        channel.listen("MessageSent", (e) => {
            if (activeChat && activeChat.id === e.chat_id) return;
            setChats((prevChats) => {
                const chatIndex = prevChats.findIndex(
                    (chat) => chat.id === e.chat_id
                );
                if (chatIndex === -1) return prevChats;

                const updatedChat = {
                    ...prevChats[chatIndex],
                    unread_count: (prevChats[chatIndex].unread_count || 0) + 1,
                    last_message: e,
                };

                const remainingChats = prevChats.filter(
                    (chat) => chat.id !== e.chat_id
                );

                return [updatedChat, ...remainingChats];
            });
        });

        return () => {
            echo.leave(`private-user.${user.id}`);
        };
    }, [user?.id, activeChat]);

    /* ================= MEMOS ================= */



    const value = useMemo(
        () => ({
            activeChat,
            setActiveChat,
            showChat,
            openChat,
            setShowChat
        }),
        [
            activeChat,
            showChat,
            openChat,
            setShowChat
        ]
    );

    return (
        <ActiveChatContext.Provider value={value}>
            {children}
        </ActiveChatContext.Provider>
    );
}

export const useActiveChat = () =>
    useContext(ActiveChatContext);