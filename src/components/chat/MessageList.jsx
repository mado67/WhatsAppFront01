import Message from "./message/Message";
import { useMessages } from "../../context/MessageContext";
import { useLayoutEffect, useRef, useState } from "react";
import { useActiveChat } from "../../context/ActiveChatContext";
import { getMessages } from "../../api/chatApi";

function ChatLoader() {
  return (
    <div className="flex justify-center py-1">
      <div className="bg-green-200 px-3 py-2 rounded-full flex gap-1">
        <span className="w-2 h-2 bg-[var(--bg-secondary1)] rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-[var(--bg-secondary1)] rounded-full animate-bounce [animation-delay:.2s]"></span>
        <span className="w-2 h-2 bg-[var(--bg-secondary1)] rounded-full animate-bounce [animation-delay:.4s]"></span>
      </div>
    </div>
  );
}

export default function MessageList({ selectedReplyMessage, setSelectedReplyMessage }) {
  const { messages, setMessages, cursor, setCursor } = useMessages();
  const { activeChat } = useActiveChat();

  const containerRef = useRef(null);
  const firstLoad = useRef(true);

  const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
  const loadingOlderRef = useRef(false);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ignore when loading older messages
    if (loadingOlderRef.current) return;

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    const isNearBottom = distanceFromBottom < 120;

    if (firstLoad.current) {
      container.scrollTop = container.scrollHeight;
      firstLoad.current = false;
      return;
    }

    if (isNearBottom) {
      container.scrollTop = container.scrollHeight;
    }

  }, [messages.length]);


  const handleScroll = () => {
    const container = containerRef.current;

    console.log("scrollTop:", container.scrollTop);
    console.log("cursor:", cursor);

    if (container.scrollTop === 0 && cursor && !loadingMoreMessages) {
      console.log("LOAD MORE");
      loadMore();
    }
  };

  const fetchMessages = async () => {
    if (loadingMoreMessages) return;

    setLoadingMoreMessages(true);
    const { data } = await getMessages(activeChat.id, {}, cursor);

    const newMessages = data.data;

    setMessages(prev => [...newMessages.reverse(), ...prev]);
    setCursor(data.next_cursor);

    setLoadingMoreMessages(false);
  };


  const loadMore = async () => {
    const container = containerRef.current;

    loadingOlderRef.current = true;

    const oldHeight = container.scrollHeight;

    await fetchMessages();

    const newHeight = container.scrollHeight;

    container.scrollTop = newHeight - oldHeight;

    loadingOlderRef.current = false;
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 p-4  h-full overflow-y-auto space-y-2"
    >
      {loadingMoreMessages && <ChatLoader />}
      {messages.map((msg) => (
        <Message
          key={msg.id}
          message={msg}
          selectedReplyMessage={selectedReplyMessage}
          setSelectedReplyMessage={setSelectedReplyMessage}
        />
      ))}
    </div>
  );
}

