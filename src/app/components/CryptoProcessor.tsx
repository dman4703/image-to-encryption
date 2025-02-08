"use client";

import React, { useState } from "react";

interface CryptoProcessorProps {
    imageData: ImageData;
    salt: string;
    onResult: (result: string) => void;
}

function generatePasswordFromHash(hashBuffer: ArrayBuffer): string {
    const allowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!_-$+~@";
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const digitChars = "0123456789";
    const specialChars = "!_-$+~@";

    const hashArray = new Uint8Array(hashBuffer);
    const passwordLength = 20;
    const passwordArray: string[] = [];

    // Use hash bytes to select characters from allowedChars.
    for (let i = 0; i < passwordLength; i++) {
        const byte = hashArray[i % hashArray.length];
        const char = allowedChars.charAt(byte % allowedChars.length);
        passwordArray.push(char);
    }

    let password = passwordArray.join("");

    // Count occurrences of character types
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const specialMatches = password.match(/[!_\-\$+~@]/g) || [];
    let specialCount = specialMatches.length;

    // Helper to replace a character at a random index with one from a given set
    const replaceRandomChar = (set: string, pwd: string): string => {
        const index = Math.floor(Math.random() * passwordLength);
        const randomChar = set.charAt(Math.floor(Math.random() * set.length));
        return pwd.substring(0, index) + randomChar + pwd.substring(index + 1);
    };

    // Ensure at least one of each required character type
    if (!hasUppercase) password = replaceRandomChar(uppercaseChars, password);
    if (!hasLowercase) password = replaceRandomChar(lowercaseChars, password);
    if (!hasDigit) password = replaceRandomChar(digitChars, password);

    // Ensure at least 5 special characters
    while (specialCount < 5) {
        password = replaceRandomChar(specialChars, password);
        specialCount++;
    }

    return password;
}

export default function CryptoProcessor({ imageData, salt, onResult }: CryptoProcessorProps) {
    const [loading, setLoading] = useState(false);

    const generatePassword = async () => {
        setLoading(true);
        try {
            // Convert image data and salt to ArrayBuffers.
            const imageBuffer = imageData.data.buffer;
            const encoder = new TextEncoder();
            const saltBuffer = encoder.encode(salt);

            // Concatenate the buffers.
            const combined = new Uint8Array(imageBuffer.byteLength + saltBuffer.byteLength);
            combined.set(new Uint8Array(imageBuffer), 0);
            combined.set(new Uint8Array(saltBuffer), imageBuffer.byteLength);

            // Hash the combined data using SHA-256.
            const hashBuffer = await crypto.subtle.digest("SHA-256", combined);

            // Generate a 20-character password.
            const password = generatePasswordFromHash(hashBuffer);
            onResult(password);
        } catch (error) {
            console.error("Error generating password:", error);
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center">
            <button
                onClick={generatePassword}
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                disabled={loading}
            >
                {loading ? "Generating..." : "Generate Password"}
            </button>
        </div>
    );
}
