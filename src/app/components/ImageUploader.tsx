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
                .getUserMedia({
                    video: {
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                        aspectRatio: { ideal: 16 / 9 }
                    }
                })
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
        // Use video's actual dimensions for the canvas.
        const videoWidth = videoRef.current.videoWidth;
        const videoHeight = videoRef.current.videoHeight;

        canvas.width = videoWidth;
        canvas.height = videoHeight;

        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            // Create a second canvas for processing the image to 128x128.
            const processCanvas = document.createElement("canvas");
            processCanvas.width = 128;
            processCanvas.height = 128;
            const processCtx = processCanvas.getContext("2d");
            if (processCtx) {
                processCtx.drawImage(canvas, 0, 0, 128, 128);
                const imageData = processCtx.getImageData(0, 0, 128, 128);

                // For the preview, use the full resolution canvas.
                const preview = canvas.toDataURL("image/png");
                onImageProcessed({ imageData, preview });
            }
        }
    };

    return (
        <div className="flex flex-col items-center">
            {/* Mode Selector Tabs */}
            <div className="mb-4 flex space-x-4">
                <button
                    onClick={() => setMode("upload")}
                    className={`px-4 py-2 border rounded ${mode === "upload" ? "bg-gray-200" : "bg-white"}`}
                >
                    Upload Image
                </button>
                <button
                    onClick={() => setMode("camera")}
                    className={`px-4 py-2 border rounded ${mode === "camera" ? "bg-gray-200" : "bg-white"}`}
                >
                    Take Photo
                </button>
            </div>

            {/* Conditional rendering based on selected mode */}
            {mode === "upload" && (
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
            )}

            {mode === "camera" && (
                <div className="flex flex-col items-center">
                    {/* Video preview container with fixed dimensions */}
                    <div className="w-[40%] h-[22%] bg-black rounded-lg overflow-hidden mb-4">
                        <video
                            ref={videoRef}
                            className="w-full h-full object-cover"
                            autoPlay
                            playsInline
                        ></video>
                    </div>
                    <button
                        onClick={handleTakePhoto}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Take Photo
                    </button>
                </div>
            )}
        </div>
    );
}
