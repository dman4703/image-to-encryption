"use client";

import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ModeSelector from "../components/ModeSelector";
import ImageUploader from "../components/ImageUploader";
import SaltInput from "../components/SaltInput";
import EntropyMeter from "../components/EntropyMeter";
import FileHandler from "../components/FileHandler";

export default function FilePage() {
    // State for image data and its preview URL.
    const [imageData, setImageData] = useState<ImageData | null>(null);
    const [preview, setPreview] = useState<string>("");

    // State for the salt.
    const [salt, setSalt] = useState<string>("");

    const handleImageUpload = (data: { imageData: ImageData; preview: string }) => {
        setImageData(data.imageData);
        setPreview(data.preview);
    };

    const handleSaltChange = (value: string) => {
        setSalt(value);
    };

    return (
        <div className="min-h-screen bg-white font-sans flex flex-col">
            <Header />

            {/* ModeSelector displayed under the header */}
            <div className="px-4 py-4">
                <ModeSelector currentMode="file" />
            </div>

            <main className="flex-grow px-4 py-8">
                {/* Image Uploader */}
                <div className="mb-6">
                    <ImageUploader onImageProcessed={handleImageUpload} />
                </div>

                {/* Display uploaded image preview above the salt input */}
                {preview && (
                    <div className="mb-6 flex justify-center">
                        <img src={preview} alt="Uploaded preview" className="max-w-xs rounded border" />
                    </div>
                )}

                {/* Salt Input */}
                <div className="mb-6">
                    <SaltInput onSaltChange={handleSaltChange} />
                </div>

                {/* Entropy Meter */}
                {imageData && (
                    <div className="mb-6">
                        <EntropyMeter imageData={imageData} />
                    </div>
                )}

                {/* File Handler: only rendered if both image data and salt exist */}
                {imageData && salt && (
                    <div className="mb-6">
                        <FileHandler imageData={imageData} salt={salt} />
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
