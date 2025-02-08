import Header from "./components/Header";
import Footer from "./components/Footer";
import ModeSelector from "./components/ModeSelector";

export default function HomePage() {
  return (
      <div className="min-h-screen bg-white font-sans flex flex-col">
        {/* Header */}
        <Header />

        {/* Main Content */}
          <main className="flex-grow flex flex-col items-center justify-center px-4">
              <p className="max-w-2xl mb-6 text-lg mb-10">
                  Inspired by Cloudfare’s lava lamp wall, this tool allows you to make your very own custom and secure
                  encryptions! Using the randomness of your provided image, this tool can generate a password, an
                  asymmetric key pair, or a file encryption key. And with the unpredictable patterns of your image,
                  these keys are sure to be secure!
              </p>
              <h2 className="text-xl font-semibold mb-4 mt-10">Select a mode to get started:</h2>
              <ModeSelector/>
          </main>

          {/* Footer */}
          <Footer/>
      </div>
  );
}
