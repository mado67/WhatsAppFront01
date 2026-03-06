import Message from "./message/Message";
import { useMessages } from "../../context/MessageContext";
import { useLayoutEffect, useRef } from "react";

export default function MessageList({ selectedReplyMessage, setSelectedReplyMessage }) {
  const { messages } = useMessages();

  const containerRef = useRef(null);
  const firstLoad = useRef(true);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // distance from bottom
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    const isNearBottom = distanceFromBottom < 120;

    // first load → jump to bottom
    if (firstLoad.current) {
      container.scrollTop = container.scrollHeight;
      firstLoad.current = false;
      return;
    }

    // new messages → only scroll if user is near bottom
    if (isNearBottom) {
      container.scrollTop = container.scrollHeight;
    }

  }, [messages.length]);

  return (
    <div
      ref={containerRef}
      className="flex-1 p-4 overflow-y-auto space-y-2"
    >
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