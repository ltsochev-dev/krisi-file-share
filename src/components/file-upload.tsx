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

export type DeletionTime = {
  value: number;
  label: string;
};

export interface FileUploadProps {
  name?: string;
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
  durations = defaultDurations,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [deletionTime, setDeletionTime] = useState(
    durations[0]?.value?.toString() ?? "1"
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files.item(0));
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const metadata = {
      "x-amz-meta-original-filename": file.name,
      "x-amz-meta-original-hash": nanoid(),
      "x-amz-meta-expires": deletionTime,
    };

    // Here you would implement the actual file upload logic
    console.log(`Uploading file: ${file.name}`);
    console.log(`File will be deleted after ${deletionTime} seconds`);
    console.log({ metadata });

    setIsUploading(true);

    setUploadPercent(50);

    // Simulating upload process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsUploading(false);
    setIsUploaded(true);
    setUploadPercent(0);

    // Reset after 3 seconds
    setTimeout(() => {
      setFile(null);
      setDeletionTime(durations[0]?.value?.toString() ?? "1");
      setIsUploaded(false);
    }, 3000);

    // Reset the form after upload
    setFile(null);
    setDeletionTime(durations[0]?.value?.toString() ?? "1");
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
      <p className="text-center text-xs text-gray-400">
        * Only single file uploads are allowed at the moment. If you wish to
        upload multiple files, please put them in a ZIP file or similar
      </p>
    </div>
  );
}
