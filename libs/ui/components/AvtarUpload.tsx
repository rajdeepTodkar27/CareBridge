"use client"

import React, { useEffect, useState, useRef } from "react";

interface AvatarUploadProps {
    value?: FileList;
    onChange: (files: FileList) => void;
    initialImage: string;
}

const AvtarUpload: React.FC<AvatarUploadProps> = ({ value, onChange, initialImage }) => {
    const [preview, setPreview] = useState<string>(initialImage);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (value && value.length > 0) {
            const file = value[0];
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(initialImage);
        }
    }, [value, initialImage]);

    const handleImageError = () => {
        setPreview("https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg");
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 1) {
            alert("Please select only one image file.");
            return;
        }

        if (e.target.files && e.target.files.length === 1) {
            const file = e.target.files[0];

            if (!file.type.startsWith("image/")) {
                alert("Please select a valid image file (jpg, png, etc).");
                return;
            }

            const fileUrl = URL.createObjectURL(file);
            setPreview(fileUrl);
            onChange(e.target.files);
        }
    };


    return (
        <div className="col-span-full">
            <label htmlFor="photo" className="block text-lg font-semibold text-gray-800 mb-4">
                Photo
            </label>
            <div className="mt-2 flex items-center gap-x-3">
                <div className="avatar">
                    <div className="w-24 rounded">
                        <img src={preview} onError={handleImageError} alt="User Avatar" />
                    </div>
                </div>
                <div>
                    <input
                        type="file"
                        accept="image/*"
                        multiple={false}
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={handleButtonClick}
                        className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 hover:cursor-pointer"
                    >
                        Change
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AvtarUpload;
