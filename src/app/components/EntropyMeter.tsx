"use client";

import React, { useEffect, useState } from "react";

interface EntropyMeterProps {
    imageData: ImageData;
}

function calculateShannonEntropy(data: Uint8ClampedArray): number {
    // Build a histogram of grayscale values (0-255)
    const histogram = new Array(256).fill(0);
    const total = data.length / 4; // total number of pixels

    for (let i = 0; i < data.length; i += 4) {
        // Compute the grayscale value as the average of R, G, and B.
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const gray = Math.round((r + g + b) / 3);
        histogram[gray]++;
    }

    let entropy = 0;
    for (let i = 0; i < histogram.length; i++) {
        if (histogram[i] > 0) {
            const p = histogram[i] / total;
            entropy -= p * Math.log2(p);
        }
    }
    return entropy;
}

export default function EntropyMeter({ imageData }: EntropyMeterProps) {
    const [entropy, setEntropy] = useState<number>(0);

    useEffect(() => {
        const ent = calculateShannonEntropy(imageData.data);
        setEntropy(ent);
    }, [imageData]);

    return (
        <div className="flex flex-col items-center">
            <label className="font-medium mb-2">Image Entropy:</label>
            <div className="w-64 h-4 bg-gray-200 rounded-full">
                <div
                    className="h-4 bg-blue-600 rounded-full"
                    style={{ width: `${(entropy / 8) * 100}%` }} // Assuming a max of ~8 bits for grayscale.
                ></div>
            </div>
            <p className="mt-2 text-sm">{entropy.toFixed(2)} bits</p>
        </div>
    );
}
