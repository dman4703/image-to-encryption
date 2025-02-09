"use client"
import Header from "./components/Header";
import Footer from "./components/Footer";
import ModeSelector from "./components/ModeSelector";
import Image from "next/image";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 font-sans flex flex-col">

            <main className="flex-grow flex flex-col items-center justify-center px-4 py-12">

                <div className="max-w-4xl mx-auto text-center">
                    <Header />
                    {/* Hero Section */}
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">
                        Turn Images into Secure Cryptographic Keys Using Visual Entropy
                    </h2>

                    {/* Image Container */}
                    <div className="relative mb-10 group flex justify-center">
                        <Image
                            src="https://blog.cloudflare.com/content/images/2017/11/lava-lamps.jpg"
                            alt="Lava Lamps"
                            width={512}
                            height={288}
                            className="rounded-xl shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                        <div className="absolute inset-0 rounded-xl shadow-inner pointer-events-none"></div>
                    </div>

                    {/* Description Section */}
                    <div className="bg-white p-8 rounded-xl shadow-lg mb-10">
                        <p className="text-lg text-gray-700 leading-relaxed">
                            Inspired by Cloudfare&apos;s lava lamp wall, this tool lets you to create
                            secure cryptographic keys using the inherent randomness of your images. You can create
                            a strong password, an asymmetric key pair, or a file encryption key, and the unpredictable
                            patterns within your images will ensure robust security.
                        </p>
                    </div>

                    {/* Mode Selection Section */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-semibold text-gray-800">
                            Select your encryption mode:
                        </h3>
                        <div className="inline-block bg-white p-2 rounded-lg shadow-md">
                            <ModeSelector />
                        </div>
                    </div>
                    <Footer />
                </div>
            </main>

        </div>
    );
}