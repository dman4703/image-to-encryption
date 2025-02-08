"use client";

import React, { useRef } from "react";

interface ImageUploaderProps {
    onImageProcessed: (data: { imageData: ImageData; preview: string }) => void;
}

export default function ImageUploader({ onImageProcessed }: ImageUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const img = new Image();
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                img.src = result;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const width = 128;
                    const height = 128;
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    if (ctx) {
                        ctx.drawImage(img, 0, 0, width, height);
                        const imageData = ctx.getImageData(0, 0, width, height);
                        onImageProcessed({ imageData, preview: result });
                    }
                };
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <label className="mb-2 font-medium">Upload an image for randomness:</label>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="border p-2"
            />
        </div>
    );
}
