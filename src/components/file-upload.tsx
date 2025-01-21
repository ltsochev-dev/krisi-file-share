"use client";

import { useRef, useState } from "react";
import { Upload, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProgressButton } from "./ui/progressButton";
import { nanoid } from "nanoid";
import useCrypto from "@/hooks/useCrypto";
import checkFileExistence from "@/actions/checkFileExistence";
import getPresignedUploadUrl from "@/actions/getPresignedUploadUrl";
import { useRouter } from "next/navigation";
import axios from "axios";

export type DeletionTime = {
  value: number;
  label: string;
};

export interface FileUploadProps {
  name?: string;
  hash?: string;
  durations?: DeletionTime[];
}

const defaultDurations: DeletionTime[] = [
  { label: "Delete after 6 hours", value: 60 * 60 * 6 },
  { label: "Delete after 8 hours", value: 60 * 60 * 8 },
  { label: "Delete after 12 hours", value: 60 * 60 * 12 },
  { label: "Delete after 24 hours", value: 60 * 60 * 24 },
  { label: "Delete after 3 days", value: 60 * 60 * 24 * 3 },
  { label: "Delete after 5 days", value: 60 * 60 * 24 * 5 },
  { label: "Delete after 7 days", value: 60 * 60 * 24 * 7 },
  { label: "Keep Forever*", value: 0 },
] as const;

export default function FileUpload({
  name,
  hash = nanoid(),
  durations = defaultDurations,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletionTime, setDeletionTime] = useState(
    durations[0]?.value?.toString() ?? "1"
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const { encryptFile, loaded: cryptoServiceLoaded } = useCrypto(
    process.env.NEXT_PUBLIC_ENCRYPTION_PUBLIC_KEY!
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files.item(0));
    }
  };

  const handleUpload = async () => {
    if (!file || !cryptoServiceLoaded) return;

    setError(null);
    setIsUploading(true);

    // checkFileExistence
    const fileExists = await checkFileExistence(
      process.env.NEXT_PUBLIC_AWS_BUCKET!,
      hash
    );
    if (fileExists) {
      setError(
        "File already exists on the remote storage. Please ask me for another upload link!"
      );
      return;
    }

    const encryption = await encryptFile({ file });
    if (!encryption) {
      setError("Something went wrong during encryption. File upload aborted.");
      return;
    }

    const { key, iv, encryptedFile } = encryption;

    const metadata = {
      "original-filename": file.name,
      "original-extension": file.name.includes(".")
        ? file.name.split(".").pop()!.toLowerCase()
        : "",
      mimetype: file.type,
      hash: hash,
      expires: deletionTime,
      "aes-key": key,
      "aes-iv": iv,
    };

    const presignedUrl = await getPresignedUploadUrl(
      process.env.NEXT_PUBLIC_AWS_BUCKET!,
      {
        hash,
        expireIn: Number(deletionTime),
        size: file.size,
        metadata,
        type: file.type,
      }
    );

    if (!presignedUrl) {
      setError("Could not create presigned url. Please try again later.");
      return;
    }

    try {
      const res = await axios.put(presignedUrl, encryptedFile, {
        headers: {
          ...metadata,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.lengthComputable && progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );

            setUploadPercent(percentCompleted);
          }
        },
      });

      if (res.status !== 200) {
        setError("Something went wrong with the upload.");
        return;
      }

      setIsUploaded(true);

      setTimeout(() => router.push("/thank-you"), 3000);
    } catch (e) {
      console.error(e);
      setError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="file-uploader">
      <Input
        type="file"
        name={name}
        onChange={handleFileChange}
        className="mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
        ref={inputRef}
      />
      <Select value={deletionTime} onValueChange={setDeletionTime}>
        <SelectTrigger className="w-full mb-4">
          <SelectValue placeholder="Select deletion time" />
        </SelectTrigger>
        <SelectContent>
          {durations.map((duration, index) => (
            <SelectItem
              value={duration.value.toString()}
              key={`duration-${index}-${duration.value}`}
            >
              {duration.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <ProgressButton
        onClick={handleUpload}
        type="button"
        disabled={!file || isUploading || isUploaded}
        className="w-full bg-purple-600 hover:bg-purple-700 mb-4"
        progress={uploadPercent}
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
      </ProgressButton>
      {error && <p className="text-center text-red-700 pb-2">{error}</p>}
      <p className="text-center text-xs text-gray-400">
        * Only single file uploads are allowed at the moment. If you wish to
        upload multiple files, please put them in a ZIP file or similar
      </p>
    </div>
  );
}
