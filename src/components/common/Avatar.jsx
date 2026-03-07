import { BadgeCheck } from "lucide-react";

export default function Avatar({ src, onClick, isSelected }) {
  return (
    (
      <div className="relative">
        {
          src ?
            <img
              src={`${import.meta.env.VITE_APP_URL}/storage/${src}`}
              // src={`${import.meta.env.VITE_APP_URL}/storage/${src}`}
              className={`w-10 h-10 rounded-full object-cover cursor-pointer ${isSelected ? 'scale-110' : 'scale-120'}`}
              alt="avatar"
              onClick={onClick}
            /> : <div onClick={onClick} className={`w-10 h-10 rounded-full object-cover bg-[var(--bg-secondary1)] flex items-center justify-center border border-[1px] border-gray-600 cursor-pointer ${isSelected ? 'scale-110' : 'scale-120'}`}><span aria-hidden="true" data-icon="default-contact-refreshed" ><svg viewBox="0 0 48 48" height="49" width="49" preserveAspectRatio="xMidYMid meet" fill="none"><title>default-contact-refreshed</title><path d="M24 23q-1.857 0-3.178-1.322Q19.5 20.357 19.5 18.5t1.322-3.178T24 14t3.178 1.322Q28.5 16.643 28.5 18.5t-1.322 3.178T24 23m-6.75 10q-.928 0-1.59-.66-.66-.662-.66-1.59v-.9q0-.956.492-1.758A3.3 3.3 0 0 1 16.8 26.87a16.7 16.7 0 0 1 3.544-1.308q1.8-.435 3.656-.436 1.856 0 3.656.436T31.2 26.87q.816.422 1.308 1.223T33 29.85v.9q0 .928-.66 1.59-.662.66-1.59.66z" fill="var(--bg-secondary)" ></path></svg></span></div>
        }
        {isSelected && <div className="w-6 h-6 border-3 border-white absolute -bottom-2 -left-2 flex items-center justify-center rounded-full">
          <BadgeCheck color="green" className="" />
        </div>}
      </div>
    )
  );
}
