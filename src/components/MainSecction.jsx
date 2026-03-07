import { useState } from "react";
import { useActiveChat } from "../context/ActiveChatContext";
import { useStackNavigation } from "../context/StackNavigationContext";
import MainChatPageSection from "./chat/MainChatPageSection"
import SidePanel from "./layout/sidePanel"
import MainSettingsSection from "./MainSettingsSection"

export default function MainSection() {
    const { showChat } = useActiveChat();
    const { current } = useStackNavigation();
    const [isMyProfile, setIsMyProfile] = useState(false);
    return (
        <div className={`h-[100dvh] w-screen md:pl-20 ${showChat ? 'pb-0' : "pb-16"} md:pb-0 bg-[var(--bg-secondary)] text-white flex overflow-hidden`}>
            <SidePanel isMyProfile={isMyProfile} setIsMyProfile={setIsMyProfile} />
            {current === 'ChatList' && <MainChatPageSection isMyProfile={isMyProfile} setIsMyProfile={setIsMyProfile} />}
            {current === 'Settings' && <MainSettingsSection />}
        </div>
    )
}

