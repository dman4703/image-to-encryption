"use client";

import React from "react";

export type Mode = "password" | "public-key" | "file";

const modeMap: { [key in Mode]: { label: string; route: string } } = {
    password: { label: "Password Generator", route: "/password" },
    "public-key": { label: "Public Key Generator", route: "/public-key" },
    file: { label: "File Encryptor/Decryptor", route: "/file" },
};

interface ModeSelectorProps {
    currentMode?: Mode; // Optional, so no mode is highlighted if undefined
    onSelectMode: (mode: Mode) => void;
}

export default function ModeSelector({ currentMode, onSelectMode }: ModeSelectorProps) {
    return (
        <div className="flex justify-center">
            <div className="flex border border-gray-700 rounded-md overflow-hidden w-fit flex-nowrap">
                {(Object.keys(modeMap) as Mode[]).map((mode) => (
                    <div
                        key={mode}
                        onClick={() => onSelectMode(mode)}
                        className={`px-4 py-2 cursor-pointer select-none whitespace-nowrap ${
                            currentMode === mode ? "bg-gray-200" : "bg-white"
                        } text-gray-800 font-medium border-r border-gray-700 last:border-r-0`}
                    >
                        {modeMap[mode].label}
                    </div>
                ))}
            </div>
        </div>
    );
}
