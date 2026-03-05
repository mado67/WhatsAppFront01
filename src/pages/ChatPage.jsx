
import { AuthProvider } from "../context/AuthContext";
import { ChatListProvider } from "../context/ChatListContext";
import { ActiveChatProvider, useActiveChat } from "../context/ActiveChatContext";
import { MessageProvider } from "../context/MessageContext";
import { ChatUIProvider } from "../context/ChatUIContext";
import MainChatPageSection from "../components/chat/MainChatPageSection";
import MainSettingsSection from "../components/MainSettingsSection";

export default function ChatPage() {

 

  return (
    <AuthProvider>
      <ChatListProvider>
        <ActiveChatProvider>
          <MessageProvider>
            <ChatUIProvider>
            {true && <MainChatPageSection />}
           {false && <MainSettingsSection />}
            </ChatUIProvider>
          </MessageProvider>
        </ActiveChatProvider>
      </ChatListProvider>
    </AuthProvider>
  );
}
