import {
    CopyIcon,
    ForwardIcon,
    MessageSquareTextIcon,
    TrashIcon,
    Delete
} from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";

const DropdownMenu = memo(function DropdownMenu({
    isMine,
    message,
    setMessageOption,
    setSelectionMode,
    toggleMessageSelection,
    setSelectedReplyMessage,
}) {
    const handleAction = (mode) => {
        setMessageOption(false);
        setSelectionMode(mode);
        toggleMessageSelection(message.id);
    };


    const menuRef = useRef(null);
    const [openUpward, setOpenUpward] = useState(false);

    useEffect(() => {
        if (!menuRef.current) return;

        const rect = menuRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.top;

        if (spaceBelow < 250) { // menu height approx
            setOpenUpward(true);
        }
    }, []);

    return (
        <div
            ref={menuRef}
            className={`absolute transition-all duration-150 scale-95   animate-dropdown ${openUpward ? "bottom-6" : "top-6"} ${isMine ? "right-[70%]" : "left-[70%]"
                } w-48 bg-[var(--bg-primary)] shadow-lg rounded-md text-sm z-50 px-2 py-4`}
        >
            <MenuItem
                text="Reply"
                icon={<MessageSquareTextIcon size={16} />}
                onClick={() => {
                    setMessageOption(false);
                    setSelectionMode("reply");
                    setSelectedReplyMessage(message);
                    toggleMessageSelection(message.id);
                }}
            />

            <MenuItem
                text="Copy"
                icon={<CopyIcon size={16} />}
                onClick={() => handleAction("copy")}
            />

            <MenuItem
                text="Forward"
                icon={<ForwardIcon size={16} />}
                onClick={() => handleAction("forward")}
            />



            <div className="w-full h-[1px] bg-gray-600 my-2" />

            <MenuItem
                text="Delete for me"
                icon={<Delete size={16} />}
                onClick={() => handleAction("deleteForMe")}
            />
            <MenuItem
                text="Delete Message"
                danger
                icon={<TrashIcon size={16} />}
                onClick={() => handleAction("delete")}
            />
        </div>
    );
});


const MenuItem = memo(function MenuItem({ text, icon, onClick, danger }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 w-full py-2 px-3 hover:bg-[var(--bg-secondary)] cursor-pointer ${danger ? "text-red-500" : "[var(--text-primary)]"
                }`}
        >
            {icon}
            {text}
        </button>
    );
});

export default DropdownMenu;
