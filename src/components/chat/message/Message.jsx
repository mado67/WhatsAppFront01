import { memo, useEffect, useRef, useState, useCallback } from "react";
import {
  ChevronDown,
  FileText,
  Forward,
} from "lucide-react";
import { useChatUI } from "../../../context/ChatUIContext";
import { useAuth } from "../../../context/AuthContext";
import DropdownMenu from "./DropdownMenu";
import MessageMeta from "./MessageMeta";
import SelectionCheckbox from "./SelectionCheckbox";
import FilePreview from "../../FilePreview";

/**
 * 🔥 MEMOIZED — prevents massive re-renders in chat lists
 */
const Message = function Message({ message, setSelectedReplyMessage }) {
  const [messageOption, setMessageOption] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const menuRef = useRef(null);

  const {
    selectionMode,
    selectedMessages,
    toggleMessageSelection,
    setSelectionMode,
    clearSelection,
  } = useChatUI();

  const { user } = useAuth();

  const isMine = message.user_id === user?.id;
  const isSelected = selectedMessages.includes(message.id);

  // =============================
  // ✅ STABLE HANDLERS
  // =============================

  const handleToggleSelect = useCallback(() => {
    if (!selectionMode || selectionMode === "reply" || (selectionMode == 'delete' && message.user_id != user.id)) return;
    toggleMessageSelection(message.id);
  }, [selectionMode, message.id, toggleMessageSelection]);

  const handleMenuToggle = useCallback((e) => {
    e.stopPropagation();
    setMessageOption((p) => !p);
  }, []);

  // =============================
  // ✅ OUTSIDE CLICK (safe)
  // =============================

  useEffect(() => {
    if (!messageOption) return;

    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMessageOption(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [messageOption]);

  // =============================
  // ✅ ESC TO EXIT SELECTION
  // =============================

  useEffect(() => {
    if (!selectionMode) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectionMode(false);
        clearSelection();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectionMode, clearSelection, setSelectionMode]);

  // =============================
  // ✅ CLASSES (memo friendly)
  // =============================

  const containerClasses = `
    flex gap-4 flex-row-reverse
    ${selectionMode && selectionMode !== "reply" && !(selectionMode == 'delete' && message.user_id != user.id)
      ? "p-2 cursor-pointer hover:bg-[var(--bg-primary)]/40 rounded-md"
      : ""}
  `;

  const bubbleClasses = `
    max-w-[45%] w-fit break-all text-left rounded-lg  text-sm relative
    flex items-end gap-2
    ${message.type === "image" ? "px-1 py-1" : "px-2 py-1"}
    ${isMine ? "ml-auto bg-[var(--bg-secondary1)] rounded-tr-[0]" : "mr-auto bg-[var(--bg-secondary1)] rounded-tl-[0]"}
  `;

  // =============================
  // 🚀 RENDER
  // =============================
  if (message.deleted_for?.includes(user.id)) return

  return (
    <div className={containerClasses} onClick={handleToggleSelect}>
      {/* ================= bubble ================= */}
      <div
        ref={menuRef}
        className={bubbleClasses}
        onMouseEnter={() => setShowArrow(true)}
        onMouseLeave={() => setShowArrow(false)}
      >
        {/* ========= dropdown ========= */}
        {messageOption && (
          <DropdownMenu
            isMine={isMine}
            message={message}
            setMessageOption={setMessageOption}
            setSelectionMode={setSelectionMode}
            toggleMessageSelection={toggleMessageSelection}
            setSelectedReplyMessage={setSelectedReplyMessage}
          />
        )}

        {/* ========= content ========= */}
        <div className="flex flex-col w-full">
          {/* reply preview */}
          {message.reply_to && message.reply_to != 'null' && (
            <div className="bg-[var(--bg-secondary1)] w-full p-1 rounded-md  border-l-3 border-green-400">
              <h3 className="text-sm text-green-400 mb-1">You</h3>
              <div className="text-sm text-gray-400 mb-1">
                {message.type == 'text' && message.reply_message?.body ?
                  message.reply_message?.body
                  : message.reply_message?.type == 'image' ? (
                    <img src={`${import.meta.env.VITE_APP_URL}/storage/${message.reply_message?.file_path}`} className=" w-15 h-[90%]" />
                  ) : (
                    <div className="flex-1 min-w-0 flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg  bg-[var(--bg-primary)] flex items-center justify-center shrink-0 md:block hidden">
                        <FileText size={20} className="text-gray-300 m-auto my-2" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate md:text-sm text-[8px] mr-1">{message.reply_message?.file_name}</p>
                      </div>
                    </div>
                  )
                }
              </div>
            </div>
          )}

          {/* forwarded */}
          {message.forwarded_from && (
            <h3 className="text-xs text-gray-400 mb-1 flex items-center gap-1">
              <Forward size={16} />
              Forwarded
            </h3>
          )}

          {/* file bubble */}
          {message.type !== "text" && message.type !== "image" && (
            <FilePreview message={message} />
          )}

          {/* text / image */}
          <div className={`flex items-center sm:flex-row ${message.reply_to ? 'flex-col' : "flex-row"} justify-end `}>
            {message.is_deleted ? (
              <p className="text-gray-400 italic md:text-sm text-[10px] ">
                This message was deleted
              </p>
            ) : message.type === "text" ? (
              <p className="self-start md:text-sm text-[14px] mr-auto">{message.body}</p>
            ) : message.type === "image" ? (
              <div className="max-w-xs w-full">
                <img
                  src={
                    message.pending
                      ? message.preview
                      : `${import.meta.env.VITE_APP_URL}/storage/${message.file_path}`
                    // : `${import.meta.env.VITE_APP_URL}/storage/${message.file_path}`
                  }
                  className="rounded-lg h-full w-full"
                  loading="lazy"
                />
              </div>
            ) : null}

            {/* time + ticks */}
            <MessageMeta message={message} isMine={isMine} />
          </div>
        </div>


        {/* hover arrow */}
        {showArrow && !selectionMode && (
          <button
            onClick={handleMenuToggle}
            className="absolute right-1 top-3 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
          >
            <ChevronDown size={16} />
          </button>
        )}
      </div>

      {/* ========= checkbox ========= */}
      {
        selectionMode && selectionMode !== "reply" && !(selectionMode == 'delete' && message.user_id != user.id) && (
          <SelectionCheckbox
            checked={isSelected}
            onChange={() => toggleMessageSelection(message.id)}
          />
        )
      }
    </div >
  );
};

export default memo(Message);