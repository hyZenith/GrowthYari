"use client";

import { useState, useRef } from "react";
import { Camera, Loader2, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProfilePictureUploadProps {
    currentImage?: string | null;
    name: string;
    size?: "sm" | "md" | "lg" | "xl";
}

export function ProfilePictureUpload({ currentImage, name, size = "xl" }: ProfilePictureUploadProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type and size
        if (!file.type.startsWith("image/")) {
            alert("Please upload an image file");
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB
            alert("File size must be less than 5MB");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/profile/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Upload failed");
            }

            const data = await res.json();
            router.refresh();
            // Optional: Toast notification
        } catch (error) {
            console.error(error);
            alert("Failed to upload profile picture");
        } finally {
            setIsUploading(false);
        }
    };

    const sizeClasses = {
        sm: "h-10 w-10 text-xs",
        md: "h-16 w-16 text-base",
        lg: "h-24 w-24 text-xl",
        xl: "h-32 w-32 text-3xl",
    };

    // Extract initials
    const initials = name
        ? name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "U";

    return (
        <div
            className={`relative group cursor-pointer rounded-full ring-4 ring-white shadow-lg ${sizeClasses[size]}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => !isUploading && fileInputRef.current?.click()}
        >
            <div className="relative h-full w-full overflow-hidden rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold border border-slate-200">
                {currentImage ? (
                    <img
                        src={currentImage}
                        alt={name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <span>{initials}</span>
                )}

                {/* Overlay */}
                {(isHovered || isUploading) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity">
                        {isUploading ? (
                            <Loader2 className="h-6 w-6 animate-spin text-white" />
                        ) : (
                            <Camera className="h-8 w-8 text-white drop-shadow-md" />
                        )}
                    </div>
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />
        </div>
    );
}
