"use client"
import { useRouter } from "next/navigation";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ModeSelector, { Mode } from "./components/ModeSelector";

export default function HomePage() {
    const router = useRouter();

    const handleModeSelect = (mode: Mode) => {
        const modeRoutes: { [key in Mode]: string } = {
            password: "/password",
            "public-key": "/public-key",
            file: "/file",
        };
        router.push(modeRoutes[mode]); // Navigate to the correct page
    };

    return (
        <div className="min-h-screen bg-white font-sans flex flex-col">
            <Header />

            <main className="flex-grow flex flex-col items-center justify-center px-4">
                <p className="max-w-2xl mb-6 text-lg mb-10">
                    Inspired by Cloudfare’s lava lamp wall, this tool allows you to make your very own custom and secure
                    encryptions! Using the randomness of your provided image, this tool can generate a password, an
                    asymmetric key pair, or a file encryption key. And with the unpredictable patterns of your image,
                    these keys are sure to be secure!
                </p>
                <h2 className="text-xl font-semibold mb-4 mt-10">Select a mode to get started:</h2>
                <ModeSelector onSelectMode={handleModeSelect} /> {/* No currentMode prop */}
            </main>

            <Footer />
        </div>
    );
}
