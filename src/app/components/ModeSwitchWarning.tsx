"use client";

import React from "react";

interface ModeSwitchWarningProps {
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ModeSwitchWarning({ onConfirm, onCancel }: ModeSwitchWarningProps) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md shadow-md max-w-sm w-full">
                <h2 className="text-xl font-semibold mb-4">Switch Mode Warning</h2>
                <p className="mb-4">
                    Switching modes will require you to re-upload your image and re-enter your salt. Your current data will be lost.
                    Do you want to continue?
                </p>
                <div className="flex justify-end space-x-4">
                    <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
