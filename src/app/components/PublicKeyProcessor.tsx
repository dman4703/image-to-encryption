"use client";

import React, { useState } from "react";

interface PublicKeyProcessorProps {
    imageData: ImageData;
    salt: string;
    onResult: (result: { publicKey: string; privateKey: string }) => void;
}

function arrayBufferToHex(buffer: ArrayBuffer): string {
    const byteArray = new Uint8Array(buffer);
    return Array.from(byteArray)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

// Given a combined input and a label, compute a SHA-256 digest and return it as hex.
async function digestWithLabel(combined: Uint8Array, label: string): Promise<string> {
    const encoder = new TextEncoder();
    const labelBuffer = encoder.encode(label);
    const total = new Uint8Array(combined.length + labelBuffer.length);
    total.set(combined, 0);
    total.set(labelBuffer, combined.length);
    const hashBuffer = await crypto.subtle.digest("SHA-256", total);
    return arrayBufferToHex(hashBuffer);
}

export default function PublicKeyProcessor({
                                               imageData,
                                               salt,
                                               onResult,
                                           }: PublicKeyProcessorProps) {
    const [loading, setLoading] = useState(false);

    const generateKeyPair = async () => {
        setLoading(true);
        try {
            // Convert the image data and salt into a combined Uint8Array.
            const imageBuffer = imageData.data.buffer;
            const encoder = new TextEncoder();
            const saltBuffer = encoder.encode(salt);
            const combined = new Uint8Array(imageBuffer.byteLength + saltBuffer.byteLength);
            combined.set(new Uint8Array(imageBuffer), 0);
            combined.set(new Uint8Array(saltBuffer), imageBuffer.byteLength);

            // Generate a deterministic public key by digesting the combined data with the label "public"
            const publicKey = await digestWithLabel(combined, "public");
            // Generate a deterministic private key by digesting with the label "private"
            const privateKey = await digestWithLabel(combined, "private");

            onResult({ publicKey, privateKey });
        } catch (error) {
            console.error("Error generating key pair:", error);
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center">
            <button
                onClick={generateKeyPair}
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                disabled={loading}
            >
                {loading ? "Generating..." : "Generate Key Pair"}
            </button>
        </div>
    );
}
