import { useState } from "react";
import ChatArea from "../layout/ChatArea"
import Sidebar from "../layout/Sidebar"
import SidePanel from "../layout/sidePanel"

const MainChatPageSection = ({ isMyProfile, setIsMyProfile }) => {

    return (
        <>
            <Sidebar isMyProfile={isMyProfile} setIsMyProfile={setIsMyProfile} />
            <ChatArea />
        </>
    )
}

export default MainChatPageSection