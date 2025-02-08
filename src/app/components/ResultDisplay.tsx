"use client";

import React, { useState } from "react";

interface ResultDisplayProps {
    result: string;
}

export default function ResultDisplay({ result }: ResultDisplayProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(result);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy text:", error);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="bg-gray-100 p-4 rounded-md mb-2 text-lg font-mono">
                {result}
            </div>
            <button
                onClick={handleCopy}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
                {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
        </div>
    );
}
