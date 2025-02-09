"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ModeSelector, { Mode } from "../components/ModeSelector";
import ModeSwitchWarning from "../components/ModeSwitchWarning";
import ImageUploader from "../components/ImageUploader";
import SaltInput from "../components/SaltInput";
import EntropyMeter from "../components/EntropyMeter";
import PublicKeyProcessor from "../components/PublicKeyProcessor";
import KeyPairDisplay from "../components/KeyPairDisplay";
import Image from "next/image";

export default function PublicKeyPage() {
    const router = useRouter();
    const currentMode: Mode = "public-key";

    // State management
    const [imageData, setImageData] = useState<ImageData | null>(null);
    const [preview, setPreview] = useState<string>("");
    const [salt, setSalt] = useState<string>("");
    const [keyPair, setKeyPair] = useState<{ publicKey: string; privateKey: string } | null>(null);
    const [showSwitchWarning, setShowSwitchWarning] = useState<boolean>(false);
    const [selectedModeToSwitch, setSelectedModeToSwitch] = useState<Mode | null>(null);

    const handleImageUpload = (data: { imageData: ImageData; preview: string }) => {
        setImageData(data.imageData);
        setPreview(data.preview);
        setKeyPair(null);
    };

    const handleSaltChange = (value: string) => {
        setSalt(value);
        setKeyPair(null);
    };

    const handleKeyPairGenerated = (result: { publicKey: string; privateKey: string }) => {
        setKeyPair(result);
    };

    const getRouteForMode = (mode: Mode): string => {
        const modeMap: { [key in Mode]: string } = {
            password: "/password",
            "public-key": "/public-key",
            file: "/file",
        };
        return modeMap[mode];
    };

    const confirmModeSwitch = () => {
        setImageData(null);
        setPreview("");
        setSalt("");
        setKeyPair(null);
        setShowSwitchWarning(false);
        if (selectedModeToSwitch) {
            router.push(getRouteForMode(selectedModeToSwitch));
        }
    };

    const cancelModeSwitch = () => {
        setShowSwitchWarning(false);
        setSelectedModeToSwitch(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 font-sans flex flex-col">
            <Header />

            {/* Mode Selector with improved styling */}
            <div className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <ModeSelector currentMode={currentMode} />
                </div>
            </div>

            <main className="flex-grow px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Title and Description */}
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Public Key Generator</h2>
                        <p className="text-gray-600">
                            Generate a secure public/private key pair using the entropy from your image combined with a personal salt value.
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
                        {imageData && salt && (
                            <div className="my-5">
                                <PublicKeyProcessor
                                    imageData={imageData}
                                    salt={salt}
                                    onResult={handleKeyPairGenerated}
                                />
                            </div>
                        )}
                    </div>


                    {/* Key Pair Display Section */}
                    {keyPair && (
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                                Your Generated Key Pair
                            </h3>
                            <KeyPairDisplay publicKey={keyPair.publicKey} privateKey={keyPair.privateKey} />
                        </div>
                    )}
                    <Footer />
                </div>
            </main>

            {showSwitchWarning && (
                <ModeSwitchWarning onConfirm={confirmModeSwitch} onCancel={cancelModeSwitch} />
            )}
        </div>
    );
}