import {
  Search,
  Key,
  Lock,
  MessageSquare,
  Bell,
  Keyboard,
  HelpCircle,
  LogOut,
  Settings as SettingsIcon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Avatar from "./common/Avatar";

export default function MainSettingsSection() {
  const { user } = useAuth();
  const menu = [
    {
      title: "Account",
      desc: "Security notifications, account info",
      icon: Key,
    },
    {
      title: "Privacy",
      desc: "Blocked contacts, disappearing messages",
      icon: Lock,
    },
    {
      title: "Chats",
      desc: "Theme, wallpaper, chat settings",
      icon: MessageSquare,
    },
    {
      title: "Notifications",
      desc: "Message notifications",
      icon: Bell,
    },
    {
      title: "Keyboard shortcuts",
      desc: "Quick actions",
      icon: Keyboard,
    },
    {
      title: "Help and feedback",
      desc: "Help center, contact us, privacy policy",
      icon: HelpCircle,
    },
  ];

  return (
    <>
      {/* LEFT PANEL */}
      <div className="w-full md:w-[420px] border-r  border-b bg-[var(--bg-primary)] border-[var(--border-color)] flex flex-col text-[var(--text-primary)]">

        {/* Header */}
        <div className="p-6 text-xl font-semibold">
          Settings
        </div>

        {/* Search */}
        <div className="px-6 pb-4">
          <div className="flex items-center gap-3 bg-[var(--bg-secondary)] px-4 py-3 rounded-full">
            <Search size={18} className="text-[var(--text-secondary)" />
            <input
              placeholder="Search settings"
              className="bg-transparent outline-none w-full text-sm placeholder-gray-400"
            />
          </div>
        </div>

        {/* Profile Card */}
        <div className="px-6 my-3">
          <div className="flex items-center gap-4 bg-[var(--bg-secondary)] p-4 rounded-xl hover:bg-[var(--bg-secondary1)] transition cursor-pointer">
            <Avatar src={user?.avatar} />
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-[var(--text-secondary)">{user.status || user.phone_number || " Dark Horse"}</div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-b border-[var(--border-color)] my-4 " />

        {/* Menu List */}
        <div className="flex-1 overflow-y-auto px-3">
          {menu.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-4 px-6 py-4 hover:bg-[var(--bg-secondary)] transition cursor-pointer rounded-md"
              >
                <Icon size={20} className="text-[var(--text-secondary) mt-1" />
                <div className="text-left">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm text-[var(--text-secondary)">
                    {item.desc}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Logout */}
          <div className="flex items-center gap-4 px-6 py-4 hover:bg-[var(--bg-secondary)] transition cursor-pointer text-red-500 border-b  border-[var(--border-color)]">
            <LogOut size={20} />
            <span>Log out</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="hidden md:flex flex-1 items-center justify-center">
        <div className="text-center text-[var(--text-primary)]">
          <SettingsIcon size={60} className="mx-auto mb-4 opacity-40" />
          <div className="text-2xl ">Settings</div>
        </div>
      </div>
    </>
  );
}