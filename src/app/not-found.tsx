import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
            <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
            <p className="text-lg mb-8">
                Sorry, the page you are looking for does not exist.
            </p>
            <Link href="/">
        <span className="text-blue-600 hover:underline cursor-pointer">
          Return Home
        </span>
            </Link>
        </div>
    );
}
