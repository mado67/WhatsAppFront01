import {
  MessageSquare,
  Circle,
  Users,
  Settings,
  Image,
} from "lucide-react";
import { useState } from "react";
import { useActiveChat } from "../../context/ActiveChatContext";

export default function SidePanel() {
  const [active, setActive] = useState("chat");
  const {  showChat } = useActiveChat();

  const menu = [
    { id: "chat", icon: MessageSquare },
    { id: "status", icon: Circle },
    { id: "calls", icon: Circle },
    { id: "communities", icon: Users },
  ];

  return (
    <>
      {/* DESKTOP SidePanel */}
      <div className='hidden  md:flex fixed left-0 top-0 h-screen w-20 bg-[#202C33] flex-col items-center border-r border-[#2A3942] py-4 justify-between'>
        
        {/* Top Icons */}
        <div className="flex flex-col items-center gap-6">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className="relative flex items-center justify-center w-12 h-12 rounded-xl hover:bg-[#2A3942] transition"
              >
                <Icon
                  size={22}
                  className={isActive ? "text-white" : "text-gray-400"}
                />

                {/* Green dot */}
                {item.id === "status" && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full"></span>
                )}

                {/* Active Indicator */}
                {isActive && (
                  <span className="absolute left-0 w-1 h-6 bg-green-500 rounded-r-full"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center gap-6">
          <button className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-[#2A3942]">
            <Image size={22} className="text-gray-400" />
          </button>

          <button className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-[#2A3942]">
            <Settings size={22} className="text-gray-400" />
          </button>

          {/* Profile Avatar */}
          <img
            src="https://i.pravatar.cc/100"
            alt=""
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className={`md:hidden fixed ${showChat&&'hidden'} bottom-0 left-0 right-0 h-16 bg-[#202C33] flex items-center justify-around border-t border-[#2A3942] z-10 `}>
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className="relative flex flex-col items-center justify-center"
            >
              <Icon
                size={22}
                className={isActive ? "text-green-500" : "text-gray-400"}
              />

              {/* Green dot */}
              {item.id === "status" && (
                <span className="absolute top-1 right-3 w-2 h-2 bg-green-500 rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}