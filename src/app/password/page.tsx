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
import CryptoProcessor from "../components/CryptoProcessor";
import ResultDisplay from "../components/ResultDisplay";

export default function PasswordPage() {
    const router = useRouter();
    const currentMode: Mode = "password";

    // State for image data and preview
    const [imageData, setImageData] = useState<ImageData | null>(null);
    const [preview, setPreview] = useState<string>("");

    const [salt, setSalt] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    // State for mode switch warning modal
    const [showSwitchWarning, setShowSwitchWarning] = useState<boolean>(false);
    const [selectedModeToSwitch, setSelectedModeToSwitch] = useState<Mode | null>(null);

    const handleImageUpload = (data: { imageData: ImageData; preview: string }) => {
        setImageData(data.imageData);
        setPreview(data.preview);
        // Clear previous password if a new image is uploaded.
        setPassword("");
    };

    const handleSaltChange = (value: string) => {
        setSalt(value);
        // Clear previous password if salt changes.
        setPassword("");
    };

    const handlePasswordGenerated = (generatedPassword: string) => {
        setPassword(generatedPassword);
    };

    const getRouteForMode = (mode: Mode): string => {
        const modeMap: { [key in Mode]: string } = {
            password: "/password",
            "public-key": "/public-key",
            file: "/file",
        };
        return modeMap[mode];
    };

    const handleSelectMode = (mode: Mode) => {
        // If current data exists, warn the user.
        if ((imageData || salt) && mode !== currentMode) {
            setSelectedModeToSwitch(mode);
            setShowSwitchWarning(true);
        } else {
            router.push(getRouteForMode(mode));
        }
    };

    const confirmModeSwitch = () => {
        // Clear current data and navigate.
        setImageData(null);
        setPreview("");
        setSalt("");
        setPassword("");
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
                <ModeSelector currentMode={currentMode} onSelectMode={handleSelectMode} />
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
                {/* Crypto Processor */}
                {imageData && salt && (
                    <div className="mb-6">
                        <CryptoProcessor
                            imageData={imageData}
                            salt={salt}
                            onResult={handlePasswordGenerated}
                        />
                    </div>
                )}
                {/* Result Display */}
                {password && (
                    <div className="mb-6">
                        <ResultDisplay result={password} />
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
