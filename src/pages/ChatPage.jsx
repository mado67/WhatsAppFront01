
import { AuthProvider } from "../context/AuthContext";
import { ChatListProvider } from "../context/ChatListContext";
import { ActiveChatProvider, useActiveChat } from "../context/ActiveChatContext";
import { MessageProvider } from "../context/MessageContext";
import { ChatUIProvider } from "../context/ChatUIContext";

import MainSecction from "../components/MainSecction";

export default function ChatPage() {


  return (
    <AuthProvider>
      <ChatListProvider>
        <ActiveChatProvider>
          <MessageProvider>
            <ChatUIProvider>
              <MainSecction />
            </ChatUIProvider>
          </MessageProvider>
        </ActiveChatProvider>
      </ChatListProvider>
    </AuthProvider>
  );
}
