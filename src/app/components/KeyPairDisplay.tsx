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
        <div className="flex flex-col items-center space-y-4">
            <div className="bg-gray-100 p-4 rounded-md w-full max-w-xl">
                <h3 className="text-lg font-semibold mb-2">Public Key</h3>
                <p className="font-mono break-all">{publicKey}</p>
                <button
                    onClick={() => copyText(publicKey, "public")}
                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                    {copiedPublic ? "Copied!" : "Copy Public Key"}
                </button>
            </div>
            <div className="bg-gray-100 p-4 rounded-md w-full max-w-xl">
                <h3 className="text-lg font-semibold mb-2">Private Key</h3>
                <p className="font-mono break-all">{privateKey}</p>
                <button
                    onClick={() => copyText(privateKey, "private")}
                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                    {copiedPrivate ? "Copied!" : "Copy Private Key"}
                </button>
            </div>
        </div>
    );
}