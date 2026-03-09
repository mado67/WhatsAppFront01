import {
  ChevronDown,
  ForwardIcon,
  Share,
  TrashIcon,
} from "lucide-react";
import Avatar from "../common/Avatar";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useChatList } from "../../context/ChatListContext";
import { useActiveChat } from "../../context/ActiveChatContext";
import { useMessages } from "../../context/MessageContext";
import { useChatUI } from "../../context/ChatUIContext";
import { useAuth } from "../../context/AuthContext";

export default function ChatItem({ chat }) {
  const { setChats } = useChatList();
  const { user } = useAuth();
  const { activeChat, setActiveChat, setShowChat } = useActiveChat();
  const { loadMessages, typingUser } = useMessages();
  const {
    setSelectionChatMode,
    selectedChats,
    setSelectedChats,
    selectionChatMode,
  } = useChatUI();

  const [chatOption, setChatOption] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const menuRef = useRef(null);

  const [openUpward, setOpenUpward] = useState(false);

  useEffect(() => {
    if (!menuRef.current) return;

    const rect = menuRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.top;

    if (spaceBelow < 250) { // menu height approx
      setOpenUpward(true);
    }
  }, []);

  /* ================= MEMOS ================= */

  const otherUser = useMemo(() => {
    if (!chat?.users || !user?.id) return null;
    return chat.users.find((u) => u.id !== user.id);
  }, [chat?.users, user?.id]);

  const isSelected = useMemo(
    () => selectedChats.includes(chat.id),
    [selectedChats, chat.id]
  );

  const isTypingHere =
    typingUser?.user_id === otherUser?.id;

  /* ================= HANDLERS ================= */

  const toggleChatSelection = useCallback((id) => {
    setSelectedChats((prev) =>
      prev.includes(id)
        ? prev.filter((m) => m !== id)
        : [...prev, id]
    );
  }, [setSelectedChats]);

  const openChatHandler = useCallback(() => {
    if (selectionChatMode) {
      toggleChatSelection(chat.id)
      return;
    }
    if (!chat || activeChat?.id === chat.id) return;

    setActiveChat(chat);
    loadMessages(chat.id);
    setShowChat(true)
    // safer unread reset
    setChats((prev) =>
      prev.map((c) =>
        c.id === chat.id
          ? { ...c, unread_count: 0 }
          : c
      )
    );
  }, [chat, setActiveChat, loadMessages, setChats, selectionChatMode, activeChat]);

  const toggleMenu = useCallback((e) => {
    e.stopPropagation();
    setChatOption((prev) => !prev);
  }, []);

  /* ================= OUTSIDE CLICK ================= */

  useEffect(() => {
    if (!chatOption) return;

    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setChatOption(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [chatOption]);

  /* ================= RENDER ================= */

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={openChatHandler}
      onMouseEnter={() => setShowArrow(true)}
      onMouseLeave={() => setShowArrow(false)}
      onKeyDown={(e) => e.key === "Enter" && openChatHandler()}
      className={`relative flex items-center gap-5 my-2 rounded-lg px-4 py-3 cursor-pointer transition-colors
        hover:bg-[var(--bg-secondary)] border-b-1 border-[var(--border-color)]
        ${activeChat?.id === chat.id || isSelected ? "bg-[var(--bg-secondary)]" : ""}
      `}
    >
      {/* ✅ Selection checkbox */}
      {selectionChatMode && (
        <div></div>
      )}

      {/* ✅ Dropdown */}
      {chatOption && (
        <div
          ref={menuRef}
          className={`absolute  ${openUpward ? "bottom-8" : "top-8"} right-2 w-48 bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-lg text-sm z-50 rounded-lg px-2 py-3 animate-in fade-in`}
        >


          <MenuItem
            text="Share Message"
            icon={<Share width={16} height={16} />}
            onClick={(e) => {
              e.stopPropagation();
              toggleChatSelection(chat.id);
              setSelectionChatMode("sendMessages");
              setChatOption(false);
            }}
          />

          <div className="w-full h-[1px] bg-gray-600 my-2" />

          <MenuItem
            text="Delete chat"
            danger
            icon={<TrashIcon width={16} height={16} />}
            onClick={(e) => {
              e.stopPropagation();
              toggleChatSelection(chat.id);
              setSelectionChatMode("deleteChats");
              setChatOption(false);
            }}
          />
        </div>
      )}

      {/* ✅ Avatar */}
      <Avatar src={otherUser?.avatar} isSelected={isSelected} />

      {/* ✅ Hover Arrow */}
      {showArrow && !selectionChatMode && (
        <button
          onClick={toggleMenu}
          className="absolute right-5 bottom-3 -translate-y-1/2 text-[var(--text-primary)] hover:text-[var(--text-secondary)]"
        >
          <ChevronDown size={16} />
        </button>
      )}

      {/* ✅ Chat content */}
      <div className="flex-1 pb-2 min-w-0">
        <div className="flex justify-between">
          <h4 className="text-sm font-medium truncate">
            {otherUser?.name || "Unknown"}
          </h4>
          <span className="text-xs text-[var(--text-primary)]">
            {chat.createdAt}
          </span>
        </div>

        <p
          className={`text-xs truncate mr-auto text-left mt-2 ${chat.unread_count > 0
            ? "text-green-500"
            : "text-[var(--text-primary)]"
            }`}
        >
          {isTypingHere ? (
            <span className="text-green-400">typing...</span>
          ) : (
            chat.last_message?.body || ""
          )}
        </p>
      </div>

      {/* ✅ Unread badge */}
      {chat.unread_count > 0 && (
        <span className="badge w-5 h-5 flex items-center justify-center bg-green-500 rounded-full text-xs">
          {chat.unread_count}
        </span>
      )}
    </div>
  );
}

/* ================= Menu Item ================= */

function MenuItem({ text, danger, icon, onClick }) {
  return (
    <div
      className={`px-2 py-2 cursor-pointer bg-[var(--bg-secondary)] flex items-center gap-1 rounded-lg
        ${danger ? "text-red-400 hover:bg-red-400/10" : "var(--text-primary) hover:bg-[var(--bg-primary)]"}
      `}
      onClick={onClick}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </div>
  );
}