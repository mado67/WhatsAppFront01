import { useState, useRef, useEffect, useCallback } from "react";
import { ImageIcon, Paperclip, SendHorizonal, Smile } from "lucide-react";
import SelectionBar from "./SelectionBar";
import { deleteMessages } from "../../api/chatApi";
import EmojiPicker from "emoji-picker-react";
import ReplyMessage from "./ReplyMessage";
import ForwardMessages from "./ForwardMessages";
import { useChatUI } from "../../context/ChatUIContext";
import { useActiveChat } from "../../context/ActiveChatContext";
import { useMessages } from "../../context/MessageContext";
import { useAuth } from "../../context/AuthContext";
import useTheme from "../../hooks/useTheme";

export default function MessageInput({
  chatId,
  selectedReplyMessage,
  setSelectedReplyMessage,
}) {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const emojiRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileRef = useRef(null);
  const imageRef = useRef(null);
  const { user } = useAuth()
  const { theme } = useTheme()
  const { selectionMode, profileOpen, selectedMessages, clearSelection, setSelectedMessages, setSelectionMode } =
    useChatUI();
  const { activeChat } = useActiveChat();
  const { handleSendMessage, sendTyping, setMessages, messages, otherUser, UserExistInChat, isUserOnline } =
    useMessages();

  // =============================
  // ✅ THROTTLED TYPING (CRITICAL)
  // =============================
  const handleTyping = useCallback(() => {
    if (typingTimeoutRef.current) return;

    sendTyping();

    typingTimeoutRef.current = setTimeout(() => {
      typingTimeoutRef.current = null;
    }, 1500);
  }, [sendTyping]);

  // =============================
  // ✅ DELETE
  // =============================
  const handleDelete = useCallback(() => {
    deleteMessages(chatId, selectedMessages);

    setMessages((prev) =>
      prev.map((message) =>
        selectedMessages.includes(message.id)
          ? { ...message, is_deleted: true }
          : message
      )
    );

    clearSelection();
  }, [chatId, selectedMessages, setMessages, clearSelection]);

  const handleDeleteForMe = useCallback(() => {
    deleteMessages(chatId, selectedMessages, 'me');

    setMessages((prev) =>
      prev.map((message) =>
        selectedMessages.includes(message.id)
          ? { ...message, deleted_for: [...message.deleted_for, user.id] }
          : message
      )
    );

    clearSelection();
  }, [chatId, selectedMessages, setMessages, clearSelection]);

  // =============================
  // ✅ COPY (FIXED)
  // =============================
  const handleCopy = useCallback(() => {
    setSelectedMessages([]);
    setSelectionMode(null);
    const textToCopy = messages
      .filter((m) => selectedMessages.includes(m.id))
      .map((m) => m.body)
      .join("\n");

    navigator.clipboard.writeText(textToCopy);
  }, [messages, selectedMessages]);

  // =============================
  // ✅ ACTION SWITCH
  // =============================
  let actionComponent = null;

  switch (selectionMode) {
    case "reply":
      actionComponent = (
        <ReplyMessage
          selectedReplyMessage={selectedReplyMessage}
          setSelectedReplyMessage={setSelectedReplyMessage}
        />
      );
      break;
    case "delete":
      actionComponent = <SelectionBar handleClick={handleDelete} />;
      break;
    case "copy":
      actionComponent = <SelectionBar handleClick={handleCopy} />;
      break;
    case "forward":
      actionComponent = <ForwardMessages />;
      break;
    case "deleteForMe":
      actionComponent = <SelectionBar handleClick={handleDeleteForMe} />;
      break;
  }

  // =============================
  // ✅ EMOJI
  // =============================
  const onEmojiClick = useCallback((emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  }, []);

  // close emoji on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowEmoji(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // =============================
  // ✅ SUBMIT TEXT
  // =============================
  const submitText = useCallback(
    (e) => {
      e.preventDefault();
      // return;
      if (!text.trim()) return;
      const formData = new FormData();
      formData.append("chat_id", chatId);
      formData.append("type", "text");
      formData.append("body", text);
      formData.append("reply_to", selectedReplyMessage?.id || null);
      formData.append("reply_message", selectedReplyMessage);
      handleSendMessage(formData, 'text');
      setText("");
      setSelectedReplyMessage(null);
      clearSelection();
    },
    [
      text,
      chatId,
      handleSendMessage,
      selectedReplyMessage,
      clearSelection,
      setSelectedReplyMessage,
    ]
  );

  // =============================
  // ✅ IMAGE
  // =============================
  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("type", "image");
    formData.append("file", file);
    formData.append("preview", URL.createObjectURL(file));
    formData.append("is_delivered", isUserOnline(
      otherUser?.id
    )
      ? 1
      : 0);
    formData.append("is_seen", UserExistInChat ? 1 : 0);
    try {
      await handleSendMessage(formData, 'image');
    } catch (err) {
      console.error(err);
    }

    imageRef.current.value = "";
  };

  // =============================
  // ✅ FILE
  // =============================
  const handleFileUpload = async (file) => {
    if (!file || !activeChat) return;

    const previewUrl = URL.createObjectURL(file);

    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("type", "file");
    formData.append("file", file);
    formData.append("file_path", previewUrl);
    formData.append("is_delivered", isUserOnline(
      otherUser?.id
    )
      ? 1
      : 0);
    formData.append("is_seen", UserExistInChat ? 1 : 0);

    try {
      await handleSendMessage(formData, "excel");
    } catch (err) {
      console.error(err);
    }

    fileRef.current.value = "";
  };

  // =============================
  // 🚀 RENDER
  // =============================
  return (
    <div
      className={`bg-[var(--bg-primary)] p-3 relative ${profileOpen ? "w-[66.66%]" : "w-full p-2"
        }`}
    >
      <form
        onSubmit={submitText}
        className="flex bg-[var(--bg-secondary)] items-center gap-2 rounded-2xl relative pl-12 md:w-full  m-auto"
      >
        {/* file */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 hover:bg-[var(--bg-primary)] hover:p-1 rounded-lg cursor-pointer"
        >
          <Paperclip size={22} />
        </button>

        <input
          ref={fileRef}
          type="file"
          hidden
          onChange={(e) => handleFileUpload(e.target.files?.[0])}
        />

        {/* image */}
        <button
          type="button"
          onClick={() => imageRef.current?.click()}
          className="text-gray-400 absolute left-22 top-1/2 -translate-y-1/2 hover:bg-[var(--bg-primary)] hover:p-1 rounded-lg cursor-pointer"
        >
          <ImageIcon size={22} />
        </button>

        <input
          ref={imageRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleImage}
        />

        {/* emoji */}
        <div ref={emojiRef}>
          <button
            type="button"
            onClick={() => setShowEmoji((p) => !p)}
            className="text-gray-400 absolute left-13 top-1/2 -translate-y-1/2 hover:bg-[var(--bg-primary)] hover:p-1 rounded-lg cursor-pointer"
          >
            <Smile size={22} />
          </button>

          {showEmoji && (
            <div className="absolute bottom-12 left-0 z-[999]">
              <EmojiPicker onEmojiClick={onEmojiClick} theme={theme} />
            </div>
          )}
        </div>

        {/* input */}
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            handleTyping();
          }}
          className="flex-1 px-18 py-2 outline-none text-sm bg-transparent"
          placeholder="Type a message"
        />

        {/* send */}
        <button
          type="submit"
          className="text-green-500 absolute right-4 top-1/2 -translate-y-1/2"
        >
          <SendHorizonal size={22} />
        </button>
      </form>

      {actionComponent}
    </div>
  );
}