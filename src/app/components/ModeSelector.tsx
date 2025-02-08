"use client";

import React from "react";
import Link from "next/link";

export type Mode = "password" | "public-key" | "file";

const modeMap: { [key in Mode]: { label: string; route: string } } = {
    password: { label: "Password Generator", route: "/password" },
    "public-key": { label: "Public Key Generator", route: "/public-key" },
    file: { label: "File Encryptor/Decryptor", route: "/file" },
};

interface ModeSelectorProps {
    currentMode?: Mode;
}

export default function ModeSelector({ currentMode }: ModeSelectorProps) {
    return (
        <div className="flex justify-center">
            <div className="flex border border-gray-700 rounded-md overflow-hidden w-fit flex-nowrap">
                {(Object.keys(modeMap) as Mode[]).map((mode) => (
                    <Link key={mode} href={modeMap[mode].route}>
                        <div
                            className={`px-4 py-2 cursor-pointer select-none whitespace-nowrap ${
                                currentMode === mode ? "bg-gray-200" : "bg-white"
                            } text-gray-800 font-medium border-r border-gray-700 last:border-r-0`}
                        >
                            {modeMap[mode].label}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
