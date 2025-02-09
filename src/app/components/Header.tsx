import React from "react";
import Link from "next/link";

export default function Header() {
    return (
        <header className="py-6">
            <Link href="/">
                <h1 className="text-4xl font-bold text-black text-center cursor-pointer">
                    Image to Encryption
                </h1>
            </Link>
        </header>
    );
}
