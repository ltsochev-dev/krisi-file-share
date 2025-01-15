import { ReactNode } from "react";

export default function UploadBlocked({ children }: { children?: ReactNode }) {
  return (
    <div className="text-center py-12 md:py-24">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 text-purple-800">
        Kristina Kostova File Sharing
      </h1>
      <p className="text-xl mb-8 text-gray-600">
        Secure, client-side encrypted, and ephemeral file sharing at your
        fingertips
      </p>
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  );
}
