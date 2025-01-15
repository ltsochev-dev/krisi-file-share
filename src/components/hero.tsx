"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Check } from "lucide-react";
import { motion } from "motion/react";

export default function Hero() {
  const [file, setFile] = useState<File | null>(null);
  const [deletionTime, setDeletionTime] = useState("1");
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    // Simulating upload process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsUploading(false);
    setIsUploaded(true);
    // Reset after 3 seconds
    setTimeout(() => {
      setFile(null);
      setDeletionTime("1");
      setIsUploaded(false);
    }, 3000);
  };

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
        <Input
          type="file"
          onChange={handleFileChange}
          className="mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
        />
        <Select value={deletionTime} onValueChange={setDeletionTime}>
          <SelectTrigger className="w-full mb-4">
            <SelectValue placeholder="Select deletion time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Delete after 1 hour</SelectItem>
            <SelectItem value="3">Delete after 3 hours</SelectItem>
            <SelectItem value="6">Delete after 6 hours</SelectItem>
            <SelectItem value="12">Delete after 12 hours</SelectItem>
            <SelectItem value="24">Delete after 24 hours</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={handleUpload}
          disabled={!file || isUploading || isUploaded}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {isUploading ? (
            <Upload className="mr-2 h-4 w-4 animate-spin" />
          ) : isUploaded ? (
            <Check className="mr-2 h-4 w-4" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          {isUploading
            ? "Uploading..."
            : isUploaded
            ? "Uploaded!"
            : "Upload File"}
        </Button>
      </motion.div>
    </div>
  );
}
