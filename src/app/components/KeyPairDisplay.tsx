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
        <div className="flex flex-col items-center space-y-4 w-full max-w-3xl">
            <div className="bg-gray-100 p-4 rounded-md w-full flex items-center space-x-2 overflow-x-auto">
                <h3 className="text-lg font-semibold whitespace-nowrap">Public Key:</h3>
                <p className="font-mono whitespace-nowrap overflow-x-auto flex-1">{publicKey}</p>
                <button
                    onClick={() => copyText(publicKey, "public")}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                    {copiedPublic ? "Copied!" : "Copy"}
                </button>
            </div>
            <div className="bg-gray-100 p-4 rounded-md w-full flex items-center space-x-2 overflow-x-auto">
                <h3 className="text-lg font-semibold whitespace-nowrap">Private Key:</h3>
                <p className="font-mono whitespace-nowrap overflow-x-auto flex-1">{privateKey}</p>
                <button
                    onClick={() => copyText(privateKey, "private")}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                    {copiedPrivate ? "Copied!" : "Copy"}
                </button>
            </div>
        </div>
    );
}