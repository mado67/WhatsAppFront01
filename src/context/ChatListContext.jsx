import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { getChats } from "../api/chatApi";


const ChatListContext = createContext();

export function ChatListProvider({ children }) {
    const [chats, setChats] = useState([]);
    const [loadingChats, setLoadingChats] = useState(false);


    /* ================= LOAD CHATS ================= */

    const loadChats = useCallback(async () => {
        setLoadingChats(true);
        try {
            const data = await getChats();
            setChats(data);
        } finally {
            setLoadingChats(false);
        }
    }, []);


    useEffect(() => {
        loadChats();
    }, [loadChats]);

    const value = useMemo(
        () => ({
            chats,
            setChats,
            loadingChats,
            loadChats,
        }),
        [chats, loadingChats, loadChats]
    );

    return (
        <ChatListContext.Provider value={value}>
            {children}
        </ChatListContext.Provider>
    );
}

export const useChatList = () => useContext(ChatListContext);