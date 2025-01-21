import { Metadata } from "next";

export const metadata: Metadata = {
  title: "File uploaded successfully. Thank you! - Kristina Kostova",
};

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <main className="container mx-auto px-4 py-8">
        <div className="flex w-full justify-center">
          <div className="text-center py-12 md:py-24">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-purple-800">
              Kristina Kostova File Sharing
            </h1>
            <p className="text-xl mb-8 text-gray-600">
              Secure, client-side encrypted, and ephemeral file sharing at your
              fingertips
            </p>
            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
              <p className="text-center">
                Your file has been successfully uploaded and I&apos;ve been
                notified about it. Thank you very much!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
