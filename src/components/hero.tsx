"use client";

import { motion } from "motion/react";
import FileUpload from "@/components/file-upload";

export default function Hero({ hash }: { hash?: string }) {
  return (
    <div className="text-center py-12 md:py-24">
      <motion.h1
        className="text-4xl md:text-6xl font-bold mb-6 text-purple-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Kristina Kostova File Sharing
      </motion.h1>
      <motion.p
        className="text-xl mb-8 text-gray-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Secure, client-side encrypted, and ephemeral file sharing at your
        fingertips
      </motion.p>
      <motion.div
        className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <FileUpload hash={hash} />
      </motion.div>
    </div>
  );
}
