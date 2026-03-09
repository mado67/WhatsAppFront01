import { useState, useRef } from "react";
import { X, User, Phone, Upload, Image as ImageIcon } from "lucide-react";
import axiosInstance from "../api/axios";

export default function NewContactModal({ open, onClose, setContacts }) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);

    const fileRef = useRef();

    // 📸 handle image upload
    const handleFile = (file) => {
        if (!file) return;
        setImageFile(file);
        setPreview(URL.createObjectURL(file));
        setImageUrl("");
    };

    // 🌐 handle image URL
    const handleImageUrl = (url) => {
        setImageUrl(url);
        setPreview(url);
        setImageFile(null);
    };

    // 📱 phone formatter
    const handlePhone = (value) => {
        const cleaned = value.replace(/[^\d+]/g, "");
        setPhone(cleaned);
    };

    // 🚀 submit
    const handleSubmit = async () => {
        if (!name || !phone) {
            alert("Name and phone required");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", name + '@gmail.com');
            formData.append("phone_number", phone);
            formData.append("password", '123456');

            if (imageFile) formData.append("avatar", imageFile);
            if (imageUrl) formData.append("avatar", imageUrl);

            const { data } = await axiosInstance.post(
                "/register",
                formData,
            );
            setContacts((prev) => [...prev, data.user])
            onClose();
            setName("");
            setPhone("");
            setPreview("");
        } catch (err) {
            console.error(err);
            alert("Failed to create contact");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {open && (
                <>
                    {/* overlay */}
                    <div
                        className="fixed inset-0 bg-[var(--bg-secondary)]/40 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* modal */}
                    <div
                        className="fixed left-1/2 top-1/2 z-50 w-[380px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-[var(--bg-secondary)]  p-6 shadow-xl"
                        initial={{ y: 80, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 80, opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    >
                        {/* header */}
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-emerald-600">
                                New Contact
                            </h2>
                            <button onClick={onClose} className="cursor-pointer">
                                <X />
                            </button>
                        </div>

                        {/* name */}
                        <label className="text-sm font-semibold">Full Name</label>
                        <div className="mt-2 mb-4 flex items-center gap-2 rounded-xl border px-3 py-3">
                            <User size={18} />
                            <input
                                className="w-full outline-none"
                                placeholder="Enter name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        {/* phone */}
                        <label className="text-sm font-semibold">Phone Number</label>
                        <div className="mt-2 mb-4 flex items-center gap-2 rounded-xl border px-3 py-3">
                            <Phone size={18} />
                            <input
                                className="w-full outline-none"
                                placeholder="+2010..."
                                value={phone}
                                onChange={(e) => handlePhone(e.target.value)}
                            />
                        </div>

                        {/* image preview */}
                        <label className="text-sm font-semibold">Contact Image</label>

                        <div className="flex justify-center my-4">
                            <div className="h-24 w-24 overflow-hidden rounded-full bg-[var(--bg-primary)] flex items-center justify-center ">
                                {preview ? (
                                    <img
                                        src={preview}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <User />
                                )}
                            </div>
                        </div>

                        {/* upload button */}
                        <button
                            onClick={() => fileRef.current.click()}
                            className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border py-3 hover:bg-[var(--bg-primary)] cursor-pointer"
                        >
                            <Upload size={18} />
                            Upload Image
                        </button>

                        <input
                            ref={fileRef}
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) => handleFile(e.target.files[0])}
                        />

                        {/* image url */}
                        <div className="mb-6 flex items-center gap-2 rounded-xl border px-3 py-3">
                            <ImageIcon size={18} />
                            <input
                                className="w-full outline-none"
                                placeholder="Or paste an image URL..."
                                onChange={(e) => handleImageUrl(e.target.value)}
                            />
                        </div>

                        {/* submit */}
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full rounded-2xl bg-emerald-500 py-4 font-bold text-white hover:bg-emerald-600 disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? "Creating..." : "Create Contact"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}