"use client";

import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, PlusCircle } from "lucide-react";
import { useState } from "react";
import axios from "axios";

type FormData = {
    text: string;
    link?: string;
};

export function AnnouncementForm({ onPosted }: { onPosted: () => void }) {
    const [open, setOpen] = useState(false);
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        setServerError("");
        try {
            await axios.post("/api/announcement", data);
            reset();
            setOpen(false); // Close modal
            onPosted();     // Refresh list
        } catch {
            setServerError("Failed to post announcement");
        }
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="bg-blue-600 text-white p-3 sm:px-4 sm:py-2 rounded-full sm:rounded hover:bg-blue-700 transition duration-200 flex items-center justify-center shadow-md"
                aria-label="Post Announcement"
            >
                <PlusCircle className="w-6 h-6 sm:mr-2" />
                <span >Post</span>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 50 }}
                            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative"
                        >
                            <button
                                onClick={() => setOpen(false)}
                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>

                            <h2 className="text-xl font-bold mb-4">Post Announcement</h2>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div>
                                    <textarea
                                        rows={4}
                                        className="w-full border border-gray-300 p-2 rounded"
                                        placeholder="Announcement text"
                                        {...register("text", { required: "Text is required" })}
                                    />
                                    {errors.text && <p className="text-red-500 text-sm">{errors.text.message}</p>}
                                </div>

                                <div>
                                    <input
                                        type="url"
                                        placeholder="Optional link (https://...)"
                                        {...register("link", {
                                            pattern: {
                                                value: /^https?:\/\/.+/,
                                                message: "Enter a valid URL",
                                            },
                                        })}
                                        className="w-full border border-gray-300 p-2 rounded"
                                    />
                                    {errors.link && <p className="text-red-500 text-sm">{errors.link.message}</p>}
                                </div>

                                {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Posting..." : "Post"}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
