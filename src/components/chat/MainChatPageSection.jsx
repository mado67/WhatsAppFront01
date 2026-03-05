import { useState } from "react";
import ChatArea from "../layout/ChatArea"
import Sidebar from "../layout/Sidebar"
import SidePanel from "../layout/sidePanel"
import { useActiveChat } from "../../context/ActiveChatContext";

const MainChatPageSection =()=>{
      const [isMyProfile, setIsMyProfile] = useState(false);
       const {  showChat } = useActiveChat();
       console.log(showChat)
    return(
        <div className={`h-[100dvh] w-screen md:pl-20    ${showChat ? 'pb-0' :"pb-16"} md:pb-0 bg-[#0b141a] text-white flex overflow-hidden`}>
            <SidePanel />
            <Sidebar isMyProfile={isMyProfile} setIsMyProfile={setIsMyProfile} />
            <ChatArea />
        </div>
    )
}

export default MainChatPageSection