"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Mode = "password" | "public-key" | "file";

const modeMap: { [key in Mode]: { label: string; route: string } } = {
    password: {
        label: "Password Generator",
        route: "/password",
    },
    "public-key": {
        label: "Public Key Generator",
        route: "/public-key",
    },
    file: {
        label: "File Encryptor/Decryptor",
        route: "/file",
    },
};

export default function ModeSelector() {
    const [selectedMode, setSelectedMode] = useState<Mode | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (selectedMode) {
            router.push(modeMap[selectedMode].route);
        }
    }, [selectedMode, router]);

    return (
        <div className="flex flex-col items-center">
            {/* Rounded rectangle container */}
            <div className="flex border border-gray-700 rounded-md overflow-hidden">
                {Object.keys(modeMap).map((key) => {
                    const mode = key as Mode;
                    return (
                        <div
                            key={mode}
                            onClick={() => setSelectedMode(mode)}
                            className={`px-4 py-2 cursor-pointer select-none ${
                                selectedMode === mode ? "bg-gray-200" : "bg-white"
                            } text-gray-800 font-medium border-r border-gray-700 last:border-r-0`}
                        >
                            {modeMap[mode].label}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
