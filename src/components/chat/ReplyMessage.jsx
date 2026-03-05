import { FileText, X } from "lucide-react";
import { useChatUI } from "../../context/ChatUIContext";

export default function ReplyMessage({ selectedReplyMessage }) {
    const { clearSelection } = useChatUI();
    return (
        <div className='absolute bottom-14 left-0  bg-[#202c33] w-full h-20 p-2 rounded-md pb-0 border-l-4 border-l-green-500'>
            <button className="absolute top-4 right-4 text-gray-400 cursor-pointer hover:text-white" onClick={clearSelection}>
                <X size={20} />
            </button>
            <div className="bg-[#111b21] w-full h-full rounded-md ">
                <h1 className="text-sm text-left ml-5 pt-2 text-green-500">You</h1>
                {
                    selectedReplyMessage.type == 'text' ?
                        <p className="text-sm text-left ml-5 pt-2 text-gray-400">{selectedReplyMessage.body}</p>
                        : selectedReplyMessage.type == 'image' ? <img src={`${import.meta.env.VITE_APP_URL}/storage/${selectedReplyMessage.file_path}`} className="absolute right-14 bottom-0 w-20 h-[90%] object-cover" /> :
                            <div className="flex-1 min-w-0 flex items-center gap-2 absolute right-14 top-1/2 transform -translate-y-1/2">
                                <div className="w-10 h-10 rounded-lg bg-[#2a3942] flex items-center justify-center shrink-0 md:block hidden">
                                    <FileText size={20} className="text-gray-300 m-auto my-2" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm font-medium truncate md:text-sm text-[8px] mr-1">{selectedReplyMessage.file_name}</p>
                                </div>
                            </div>
                }
            </div>
        </div>
    );
}