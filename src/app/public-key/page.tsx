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

export default function PublicKeyPage() {
    const router = useRouter();
    const currentMode: Mode = "public-key";

    // State for image data and preview.
    const [imageData, setImageData] = useState<ImageData | null>(null);
    const [preview, setPreview] = useState<string>("");

    // State for salt and key pair.
    const [salt, setSalt] = useState<string>("");
    const [keyPair, setKeyPair] = useState<{ publicKey: string; privateKey: string } | null>(null);

    // State for mode switch warning modal.
    const [showSwitchWarning, setShowSwitchWarning] = useState<boolean>(false);
    const [selectedModeToSwitch, setSelectedModeToSwitch] = useState<Mode | null>(null);

    const handleImageUpload = (data: { imageData: ImageData; preview: string }) => {
        setImageData(data.imageData);
        setPreview(data.preview);
        // Clear any previous keys if a new image is uploaded.
        setKeyPair(null);
    };

    const handleSaltChange = (value: string) => {
        setSalt(value);
        // Clear any previous keys if salt changes.
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
        // Clear current data and navigate.
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
        <div className="min-h-screen bg-white font-sans flex flex-col">
            <Header />
            {/* ModeSelector displayed under the header */}
            <div className="px-4 py-4">
                <ModeSelector currentMode={currentMode} />
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
                {/* Public Key Processor */}
                {imageData && salt && (
                    <div className="mb-6">
                        <PublicKeyProcessor imageData={imageData} salt={salt} onResult={handleKeyPairGenerated} />
                    </div>
                )}
                {/* Key Pair Display */}
                {keyPair && (
                    <div className="mb-6">
                        <KeyPairDisplay publicKey={keyPair.publicKey} privateKey={keyPair.privateKey} />
                    </div>
                )}
            </main>
            <Footer />
            {showSwitchWarning && (
                <ModeSwitchWarning onConfirm={confirmModeSwitch} onCancel={cancelModeSwitch} />
            )}
        </div>
    );
}
