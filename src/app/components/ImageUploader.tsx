// ./src/app/components/ImageUploader.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";

interface ImageUploaderProps {
    onImageProcessed: (data: { imageData: ImageData; preview: string }) => void;
}

export default function ImageUploader({ onImageProcessed }: ImageUploaderProps) {
    const [mode, setMode] = useState<"upload" | "camera">("upload");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // When mode changes, if we're in camera mode, request the video stream.
    useEffect(() => {
        let currentStream: MediaStream | null = null;

        if (mode === "camera") {
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then((mediaStream) => {
                    currentStream = mediaStream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = mediaStream;
                        videoRef.current.play();
                    }
                })
                .catch((err) => {
                    console.error("Error accessing camera:", err);
                });
        }
        // Cleanup function stops the stream when mode changes or component unmounts.
        return () => {
            if (currentStream) {
                currentStream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [mode]);

    // Handle file upload (Upload mode)
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

    // Handle taking a photo (Camera mode)
    const handleTakePhoto = () => {
        if (!videoRef.current) return;
        const canvas = document.createElement("canvas");
        const width = 128;
        const height = 128;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0, width, height);
            const imageData = ctx.getImageData(0, 0, width, height);
            // Generate a preview data URL from the canvas
            const preview = canvas.toDataURL("image/png");
            onImageProcessed({ imageData, preview });
        }
    };

    return (
        <div className="flex flex-col items-center">
            {/* Mode Selector Tabs */}
            <div className="mb-4 flex space-x-4">
                <button
                    onClick={() => setMode("upload")}
                    className={`px-4 py-2 border rounded ${
                        mode === "upload" ? "bg-gray-200" : "bg-white"
                    }`}
                >
                    Upload Image
                </button>
                <button
                    onClick={() => setMode("camera")}
                    className={`px-4 py-2 border rounded ${
                        mode === "camera" ? "bg-gray-200" : "bg-white"
                    }`}
                >
                    Take Photo
                </button>
            </div>

            {/* Conditional rendering based on selected mode */}
            {mode === "upload" && (
                <div className="flex flex-col items-center">
                    <label className="mb-2 font-medium">
                        Upload an image for randomness:
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="border p-2"
                    />
                </div>
            )}

            {mode === "camera" && (
                <div className="flex flex-col items-center">
                    {/* Video preview for camera mode */}
                    <video
                        ref={videoRef}
                        className="w-64 h-64 rounded border mb-4"
                        autoPlay
                        playsInline
                    ></video>
                    <button
                        onClick={handleTakePhoto}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Take Photo
                    </button>
                </div>
            )}
        </div>
    );
}
