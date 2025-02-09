"use client";

import React, { useState } from "react";

interface FileHandlerProps {
    imageData: ImageData;
    salt: string;
}

// Helper function: generate a symmetric AES-GCM key from the image data and salt.
async function generateSymmetricKey(imageData: ImageData, salt: string): Promise<CryptoKey> {
    const imageBuffer = imageData.data.buffer;
    const encoder = new TextEncoder();
    const saltBuffer = encoder.encode(salt);

    const combined = new Uint8Array(imageBuffer.byteLength + saltBuffer.byteLength);
    combined.set(new Uint8Array(imageBuffer), 0);
    combined.set(new Uint8Array(saltBuffer), imageBuffer.byteLength);

    const hashBuffer = await crypto.subtle.digest("SHA-256", combined);

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

interface FileMetadata {
    name: string;
    type: string;
}

export default function FileHandler({ imageData, salt }: FileHandlerProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [resultUrl, setResultUrl] = useState<string>("");
    const [action, setAction] = useState<"encrypt" | "decrypt">("encrypt");
    const [processing, setProcessing] = useState<boolean>(false);
    const [isValidEncryptedFile, setIsValidEncryptedFile] = useState<boolean>(true);
    const [decryptedFileName, setDecryptedFileName] = useState<string>("");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [decryptedFileType, setDecryptedFileType] = useState<string>("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setResultUrl("");
            // For decryption, check if it's a .bin file
            const valid = action === "encrypt" || file.name.toLowerCase().endsWith(".bin");
            setIsValidEncryptedFile(valid);
        }
    };

    const handleEncrypt = async () => {
        if (!selectedFile) return;
        setProcessing(true);
        try {
            const key = await generateSymmetricKey(imageData, salt);
            const iv = generateIV();

            // Create metadata object
            const metadata: FileMetadata = {
                name: selectedFile.name,
                type: selectedFile.type
            };

            // Convert metadata to JSON string and then to Uint8Array
            const metadataString = JSON.stringify(metadata);
            const metadataBytes = new TextEncoder().encode(metadataString);
            const metadataLength = new Uint8Array(4);
            new DataView(metadataLength.buffer).setUint32(0, metadataBytes.length, true);

            // Get file content
            const fileContent = await selectedFile.arrayBuffer();

            // Combine metadata length, metadata, and file content
            const dataToEncrypt = new Uint8Array(
                metadataLength.length + metadataBytes.length + fileContent.byteLength
            );
            dataToEncrypt.set(metadataLength, 0);
            dataToEncrypt.set(metadataBytes, metadataLength.length);
            dataToEncrypt.set(new Uint8Array(fileContent), metadataLength.length + metadataBytes.length);

            // Encrypt everything
            const ciphertext = await crypto.subtle.encrypt(
                { name: "AES-GCM", iv },
                key,
                dataToEncrypt
            );

            // Combine IV and ciphertext
            const finalData = new Uint8Array(iv.length + ciphertext.byteLength);
            finalData.set(iv, 0);
            finalData.set(new Uint8Array(ciphertext), iv.length);

            const blob = new Blob([finalData], { type: "application/octet-stream" });
            const url = URL.createObjectURL(blob);
            setResultUrl(url);
            setAction("encrypt");
        } catch (error) {
            console.error("Encryption error:", error);
        }
        setProcessing(false);
    };

    const handleDecrypt = async () => {
        if (!selectedFile) return;
        setProcessing(true);
        try {
            const key = await generateSymmetricKey(imageData, salt);
            const fileBytes = await selectedFile.arrayBuffer();
            const data = new Uint8Array(fileBytes);

            // Extract IV and ciphertext
            const iv = data.slice(0, 12);
            const ciphertext = data.slice(12);

            // Decrypt the data
            const decryptedData = await crypto.subtle.decrypt(
                { name: "AES-GCM", iv },
                key,
                ciphertext
            );

            // Extract metadata length
            const metadataLength = new DataView(decryptedData.slice(0, 4)).getUint32(0, true);

            // Extract and parse metadata
            const metadataBytes = decryptedData.slice(4, 4 + metadataLength);
            const metadata: FileMetadata = JSON.parse(new TextDecoder().decode(metadataBytes));

            // Extract file content
            const fileContent = decryptedData.slice(4 + metadataLength);

            // Create blob with original file type
            const blob = new Blob([fileContent], { type: metadata.type });
            const url = URL.createObjectURL(blob);
            setResultUrl(url);
            setDecryptedFileName(metadata.name);
            setDecryptedFileType(metadata.type);
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
                        download={action === "encrypt" ? "encrypted.bin" : decryptedFileName}
                        className="text-blue-600 hover:underline"
                    >
                        Download {action === "encrypt" ? "Encrypted File" : "Decrypted File"}
                    </a>
                </div>
            )}
        </div>
    );
}