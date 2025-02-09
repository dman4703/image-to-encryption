"use client";

import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ModeSelector from "../components/ModeSelector";
import ImageUploader from "../components/ImageUploader";
import SaltInput from "../components/SaltInput";
import EntropyMeter from "../components/EntropyMeter";
import FileHandler from "../components/FileHandler";
import Image from "next/image";

export default function FilePage() {
    const [imageData, setImageData] = useState<ImageData | null>(null);
    const [preview, setPreview] = useState<string>("");
    const [salt, setSalt] = useState<string>("");

    const handleImageUpload = (data: { imageData: ImageData; preview: string }) => {
        setImageData(data.imageData);
        setPreview(data.preview);
    };

    const handleSaltChange = (value: string) => {
        setSalt(value);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 font-sans flex flex-col">
            <Header />

            {/* Mode Selector with improved styling */}
            <div className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <ModeSelector currentMode="file" />
                </div>
            </div>

            <main className="flex-grow px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Title and Description */}
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">File Encryptor/Decryptor</h2>
                        <p className="text-gray-600">
                            Securely encrypt and decrypt your files using the entropy from your image combined with a personal salt value.
                        </p>
                    </div>

                    {/* Image Upload Section */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="mb-6">
                            <ImageUploader onImageProcessed={handleImageUpload} />
                        </div>

                        {/* Preview Image */}
                        {preview && (
                            <div className="flex justify-center mb-6">
                                <div className="relative group">
                                    <Image
                                        src={preview}
                                        alt="Uploaded preview"
                                        width={300}
                                        height={300}
                                        className="rounded-lg shadow-md transition-transform duration-300 group-hover:scale-[1.02]"
                                    />
                                    <div className="absolute inset-0 rounded-lg shadow-inner pointer-events-none"></div>
                                </div>
                            </div>
                        )}

                        {/* Entropy Meter */}
                        {imageData && (
                            <div className="bg-gray-50 rounded-lg p-4">
                                <EntropyMeter imageData={imageData} />
                            </div>
                        )}
                    </div>

                    {/* Salt Input Section */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <SaltInput onSaltChange={handleSaltChange} />
                    </div>

                    {/* File Handler Section */}
                    {imageData && salt && (
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-gray-800 text-center">
                                    File Encryption/Decryption
                                </h3>
                                <p className="text-gray-600 text-center">
                                    Select a file to encrypt or decrypt using your image-based key.
                                </p>
                                <FileHandler imageData={imageData} salt={salt} />
                            </div>
                        </div>
                    )}
                    <Footer />
                </div>
            </main>
        </div>
    );
}