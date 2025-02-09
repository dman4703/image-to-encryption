"use client";

import React, { useState } from "react";

interface KeyPairDisplayProps {
    publicKey: string;
    privateKey: string;
}

export default function KeyPairDisplay({ publicKey, privateKey }: KeyPairDisplayProps) {
    const [copiedPublic, setCopiedPublic] = useState(false);
    const [copiedPrivate, setCopiedPrivate] = useState(false);

    const copyText = async (text: string, type: "public" | "private") => {
        try {
            await navigator.clipboard.writeText(text);
            if (type === "public") {
                setCopiedPublic(true);
                setTimeout(() => setCopiedPublic(false), 2000);
            } else {
                setCopiedPrivate(true);
                setTimeout(() => setCopiedPrivate(false), 2000);
            }
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto px-4">
            <div className="flex flex-col items-center space-y-4">
                <div className="w-full bg-gray-100 p-4 rounded-md">
                    <div className="flex items-center justify-between gap-4">
                        <div className="font-semibold min-w-[100px]">Public Key:</div>
                        <div className="font-mono flex-1 overflow-x-auto">{publicKey}</div>
                        <button
                            onClick={() => copyText(publicKey, "public")}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition shrink-0"
                        >
                            {copiedPublic ? "Copied!" : "Copy"}
                        </button>
                    </div>
                </div>

                <div className="w-full bg-gray-100 p-4 rounded-md">
                    <div className="flex items-center justify-between gap-4">
                        <div className="font-semibold min-w-[100px]">Private Key:</div>
                        <div className="font-mono flex-1 overflow-x-auto">{privateKey}</div>
                        <button
                            onClick={() => copyText(privateKey, "private")}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition shrink-0"
                        >
                            {copiedPrivate ? "Copied!" : "Copy"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}