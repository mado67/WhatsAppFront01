import MessageList from "../chat/MessageList";
import MessageInput from "../chat/MessageInput";
import Avatar from "../common/Avatar";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeftIcon,
  MessageSquareTextIcon,
  TrashIcon,
  UserIcon,
} from "lucide-react";
import ProfilePanel from "../ProfilePanel";
import EditProfilePanel from "../EditProfilePanel";
import { ChatHeaderSkeleton, MessagesSkeleton } from "../chat/Loading";
import { useChatList } from "../../context/ChatListContext";
import { useActiveChat } from "../../context/ActiveChatContext";
import { useAuth } from "../../context/AuthContext";
import { useMessages } from "../../context/MessageContext";
import { useChatUI } from "../../context/ChatUIContext";
import { clearChatApi, deleteChats } from "../../api/chatApi";

export default function ChatArea() {
  const { setChats } = useChatList();
  const { activeChat, setActiveChat, showChat, setShowChat } = useActiveChat();
  const { user } = useAuth();
  const { profileOpen, openProfile } = useChatUI();
  const { loadingMessages, onlineUsers, setMessages } = useMessages();

  const closeChat = () => {
    setShowChat(false);
    setActiveChat(null);
  }


  const otherUser = activeChat?.users.find((u) => u.id !== user.id)


  const onlineIds = new Set(onlineUsers.map(u => u.id));

  const userIsOnline = activeChat ?
    onlineIds.has(otherUser.id)
    : false;

  const [selectedReplyMessage, setSelectedReplyMessage] = useState(null);

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!activeChat) {
    return (
      <main className="flex-1 flex items-center justify-center text-[var(--text-primary)]">
        Select a chat
      </main>
    );
  }

  const clearChat = async () => {
    setOpen(false);
    setMessages([])
    clearChatApi(activeChat.id)
  }

  const deleteChat = () => {
    deleteChats([activeChat.id]);
    setChats((prev) => prev.filter((c) => c.id !== activeChat.id));
    setActiveChat(null);
    setOpen(false);
  };

  if (loadingMessages) {
    return (
      <main
        className={` flex-1 flex scrollbar-hover flex-col bg-[var(--bg-secondary)] relative`}
      >
        <ChatHeaderSkeleton />
        <MessagesSkeleton />
      </main>
    );
  }



  return (
    <main
      className={` flex-1  h-full flex scrollbar-hover flex-col bg-[var(--bg-secondary)] text-[var(--text-primary)] max-w-[100vw] relative ${showChat ? "translate-x-0" : "translate-x-full md:translate-x-0"} transform transition-transform duration-300 ease-in-out`}
    >
      {/* Header */}
      <div
        className={`h-14 px-4 flex items-center justify-between border-b border-[var--(border-color)] bg-[var(--bg-secondary1)] relative transition duration-300 ease-in-out ${profileOpen ? "w-[66.66%]" : "w-full"}`}
      >
        <div className="flex items-center gap-2">
          {/* Back arrow (mobile only) */}
          <button onClick={closeChat} className="md:hidden text-xl">
            <ArrowLeftIcon
              width={40}
              height={40}
              className="text-gray-400 cursor-pointer hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] p-2 rounded-full"
            />
          </button>
          <Avatar src={activeChat?.users.find((u) => u.id !== user.id).avatar} onClick={
            () => {
              openProfile();
            }
          } />
          <div>
            <h3 className="text-md text-[var(--text-primary)] font-medium">{activeChat?.users.find((u) => u.id !== user.id).name}</h3>
            <p className="text-[10px] font-bold text-[var(--text-primary)]">{userIsOnline ? <div className="flex items-center items-center flex-row-reverse gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div>Online</div> : "Offline"}</p>
          </div>
        </div>

        {/* Three dots */}
        <div className="relative" ref={menuRef}>
          <span
            onClick={() => setOpen(!open)}
            className="text-2xl font-bold cursor-pointer select-none"
          >
            ⋮
          </span>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-10 w-48 bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-lg rounded-md  text-sm z-50 rounded-b-lg px-2 py-4 z-10">
              <MenuItem
                text="Contact info"
                onClick={() => {
                  setOpen(false);
                  openProfile();
                }}
                icon={<UserIcon width={16} height={16} />}
              />
              <MenuItem
                text="Mute notifications"
                icon={<MessageSquareTextIcon width={16} height={16} />}
              />
              <MenuItem
                text="Clear messages"
                danger
                onClick={clearChat}
                icon={<MessageSquareTextIcon width={16} height={16} />}
              />
              {user.role == 'admin' &&
                <MenuItem
                  text="Delete chat"
                  danger
                  icon={<TrashIcon width={16} height={16} />}
                  onClick={deleteChat}
                />}
            </div>
          )}
        </div>
      </div>
      <MessageList selectedReplyMessage={selectedReplyMessage} setSelectedReplyMessage={setSelectedReplyMessage} />
      <MessageInput chatId={activeChat?.id} selectedReplyMessage={selectedReplyMessage} setSelectedReplyMessage={setSelectedReplyMessage} />

      <EditProfilePanel otherUser={otherUser} />
      <ProfilePanel otherUser={otherUser} />
    </main>
  );
}

function MenuItem({ text, danger, icon, onClick }) {
  return (
    <div
      onClick={onClick}
      className={` px-2 py-2 cursor-pointer hover:bg-[var(--bg-secondary)] flex items-center gap-1 rounded-lg 
      ${danger ? "text-red-400" : "var(--text-primary)]"}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </div>
  );
}
