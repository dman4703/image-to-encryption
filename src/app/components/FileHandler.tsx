// ./src/app/components/FileHandler.tsx
"use client";

import React, { useState } from "react";

interface FileHandlerProps {
    imageData: ImageData;
    salt: string;
}

// Helper function: generate a symmetric AES-GCM key from the image data and salt.
async function generateSymmetricKey(imageData: ImageData, salt: string): Promise<CryptoKey> {
    // Convert the image data and salt to ArrayBuffers.
    const imageBuffer = imageData.data.buffer;
    const encoder = new TextEncoder();
    const saltBuffer = encoder.encode(salt);

    // Concatenate the image buffer and salt buffer.
    const combined = new Uint8Array(imageBuffer.byteLength + saltBuffer.byteLength);
    combined.set(new Uint8Array(imageBuffer), 0);
    combined.set(new Uint8Array(saltBuffer), imageBuffer.byteLength);

    // Hash the combined data using SHA-256.
    const hashBuffer = await crypto.subtle.digest("SHA-256", combined);

    // Import the hash as an AES-GCM key.
    const key = await crypto.subtle.importKey(
        "raw",
        hashBuffer,
        { name: "AES-GCM" },
        false,
        ["encrypt", "decrypt"]
    );
    return key;
}

// Helper to generate a random initialization vector (IV) of 12 bytes.
function generateIV(): Uint8Array {
    const iv = new Uint8Array(12);
    crypto.getRandomValues(iv);
    return iv;
}

export default function FileHandler({ imageData, salt }: FileHandlerProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [resultUrl, setResultUrl] = useState<string>("");
    const [action, setAction] = useState<"encrypt" | "decrypt">("encrypt");
    const [processing, setProcessing] = useState<boolean>(false);
    const [isValidEncryptedFile, setIsValidEncryptedFile] = useState<boolean>(true);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setResultUrl("");
            // For decryption, we expect the file to have been generated by our tool.
            // We assume such files have a .bin extension and are larger than 12 bytes (IV size).
            const valid = file.name.toLowerCase().endsWith(".bin") && file.size > 12;
            setIsValidEncryptedFile(valid);
        }
    };

    // Encrypt the selected file using AES-GCM.
    const handleEncrypt = async () => {
        if (!selectedFile) return;
        setProcessing(true);
        try {
            const key = await generateSymmetricKey(imageData, salt);
            const iv = generateIV();
            const fileArrayBuffer = await selectedFile.arrayBuffer();
            const ciphertext = await crypto.subtle.encrypt(
                { name: "AES-GCM", iv },
                key,
                fileArrayBuffer
            );
            // Prepend the IV to the ciphertext so that it can be extracted for decryption.
            const ivAndCiphertext = new Uint8Array(iv.byteLength + ciphertext.byteLength);
            ivAndCiphertext.set(iv, 0);
            ivAndCiphertext.set(new Uint8Array(ciphertext), iv.byteLength);
            // Create a Blob and object URL for download.
            const blob = new Blob([ivAndCiphertext], { type: "application/octet-stream" });
            const url = URL.createObjectURL(blob);
            setResultUrl(url);
            setAction("encrypt");
        } catch (error) {
            console.error("Encryption error:", error);
        }
        setProcessing(false);
    };

    // Decrypt the selected file using AES-GCM.
    const handleDecrypt = async () => {
        if (!selectedFile) return;
        setProcessing(true);
        try {
            const key = await generateSymmetricKey(imageData, salt);
            const fileArrayBuffer = await selectedFile.arrayBuffer();
            const data = new Uint8Array(fileArrayBuffer);
            // Extract the IV (first 12 bytes) and the ciphertext (rest).
            const iv = data.slice(0, 12);
            const ciphertext = data.slice(12);
            const decryptedBuffer = await crypto.subtle.decrypt(
                { name: "AES-GCM", iv },
                key,
                ciphertext
            );
            const blob = new Blob([decryptedBuffer]);
            const url = URL.createObjectURL(blob);
            setResultUrl(url);
            setAction("decrypt");
        } catch (error) {
            console.error("Decryption error:", error);
        }
        setProcessing(false);
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <div>
                <label className="mb-2 font-medium">Select a file:</label>
                <input type="file" onChange={handleFileChange} className="border p-2" />
            </div>
            <div className="flex space-x-4">
                <button
                    onClick={handleEncrypt}
                    disabled={!selectedFile || processing}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    {processing && action === "encrypt" ? "Encrypting..." : "Encrypt File"}
                </button>
                <button
                    onClick={handleDecrypt}
                    disabled={!selectedFile || processing || !isValidEncryptedFile}
                    className={`px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition ${
                        (!selectedFile || processing || !isValidEncryptedFile) && "opacity-50 cursor-not-allowed"
                    }`}
                >
                    {processing && action === "decrypt" ? "Decrypting..." : "Decrypt File"}
                </button>
            </div>
            {resultUrl && (
                <div className="mt-4">
                    <a
                        href={resultUrl}
                        download={action === "encrypt" ? "encrypted.bin" : "decrypted"}
                        className="text-blue-600 hover:underline"
                    >
                        Download {action === "encrypt" ? "Encrypted File" : "Decrypted File"}
                    </a>
                </div>
            )}
        </div>
    );
}
