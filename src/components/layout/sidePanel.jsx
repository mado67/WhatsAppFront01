import {
  Users,
  Settings,
  Image,
  MessageSquareText,
  CircleChevronLeft,
  CircleChevronRight,
} from "lucide-react";
import { useActiveChat } from "../../context/ActiveChatContext";
import { useStackNavigation } from "../../context/StackNavigationContext";
import Avatar from "../common/Avatar";
import { useAuth } from "../../context/AuthContext";

export default function SidePanel({ setIsMyProfile }) {
  const { user } = useAuth();
  const { showChat } = useActiveChat();
  const { push, back, next, canGoBack, canGoNext, current } = useStackNavigation();
  const menu = [
    { id: "ChatList", icon: MessageSquareText },
    { id: "communities", icon: Users },
    { id: "Gallary", icon: Image },
    { id: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* DESKTOP SidePanel */}
      <div className='hidden  md:flex fixed left-0 top-0 h-screen w-20 bg-[var(--bg-secondary)]  flex-col items-center border-r border-[var(--border-color)] py-4 justify-between'>

        {/* Top Icons */}
        <div className="flex flex-col items-center gap-6">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = current === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  push(item.id)
                }}
                className={`${isActive ? 'bg-[var(--bg-primary)]' : ""} relative flex items-center justify-center w-12 h-12 rounded-xl hover:bg-[var(--bg-primary)]  transition cursor-pointer`}
              >
                <Icon
                  size={22}
                  className={isActive ? "text-[var(--text-secondary)]" : "text-[var(--text-primary)]"}
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
          {/* <button className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-[#2A3942] cursor-pointer">
            <Image size={22} className="text-gray-400" />
          </button>

          <button className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-[#2A3942] cursor-pointer">
            <Settings size={22} className="text-gray-400" />
          </button> */}

          <Avatar src={user?.avatar} onClick={() => setIsMyProfile(true)} />
        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className={`md:hidden fixed ${showChat && 'hidden'} bottom-0 left-0 right-0 h-16 bg-[var(--bg-secondary)] text-[var(--text-primary)]  flex items-center justify-around border-t border-[#2A3942] z-10 `}>

        <button
          className="relative flex flex-col items-center justify-center cursor-pointer disabled:opacity-50"
          onClick={back} disabled={!canGoBack}
        >
          <CircleChevronLeft
            size={22}
            className={`${!canGoBack ? 'opacity-50' : ""}`}
          />
        </button>
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = current === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                push(item.id)
              }}
              className="relative flex flex-col items-center justify-center cursor-pointer"
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
        <button
          className="relative flex flex-col items-center justify-center cursor-pointer disabled:opacity-50"
          onClick={next} disabled={!canGoNext}
        >
          <CircleChevronRight
            size={22}
            className={`${!canGoNext ? 'opacity-50' : ""}`}
          />
        </button>
      </div>
    </>
  );
}