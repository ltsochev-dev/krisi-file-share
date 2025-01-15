"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type DeletionTime = {
  value: number;
  label: string;
};

export interface FileUploadProps {
  name?: string;
  durations?: DeletionTime[];
}

const defaultDurations: DeletionTime[] = [
  { label: "Delete after 1 hour", value: 60 * 60 },
  { label: "Delete after 3 hour", value: 60 * 60 * 3 },
  { label: "Delete after 6 hour", value: 60 * 60 * 6 },
  { label: "Delete after 12 hour", value: 60 * 60 * 12 },
  { label: "Delete after 24 hour", value: 60 * 60 * 24 },
] as const;

export default function FileUpload({
  name,
  durations = defaultDurations,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [deletionTime, setDeletionTime] = useState("1");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  const handleUpload = async () => {
    if (!files) return;

    // Here you would implement the actual file upload logic
    console.log(`Uploading file: ${files[0].name}`);
    console.log(`File will be deleted after ${deletionTime} hours`);

    // Reset the form after upload
    setFiles(null);
    setDeletionTime("1");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-semibold mb-4">Upload Your File</h2>
      <div className="space-y-4">
        <Input
          type="file"
          name={name}
          onChange={handleFileChange}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          ref={inputRef}
        />
        <Select value={deletionTime} onValueChange={setDeletionTime}>
          <SelectTrigger className="w-full">
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
        <Button
          type="button"
          onClick={handleUpload}
          disabled={!files}
          className="w-full"
        >
          Upload File
        </Button>
      </div>
    </div>
  );
}
