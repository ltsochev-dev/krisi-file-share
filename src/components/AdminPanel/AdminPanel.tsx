"use client";

import { useCallback, useEffect, useState } from "react";
import { ExternalLink, LoaderPinwheel } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LogoutClick } from "@/components/logout-btn";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileInfo } from "./types";
import generateUploadRequest, {
  UploadRequestProps,
} from "@/actions/generateUploadRequest";
import listFiles from "@/actions/listFiles";
import DownloadButton from "./download-button";
import DeleteButton from "./delete-button";

const expireTimes = [
  { label: "Delete after 6 hours", value: 60 * 60 * 6 },
  { label: "Delete after 8 hours", value: 60 * 60 * 8 },
  { label: "Delete after 12 hours", value: 60 * 60 * 12 },
  { label: "Delete after 24 hours", value: 60 * 60 * 24 },
  { label: "Delete after 3 days", value: 60 * 60 * 24 * 3 },
  { label: "Delete after 5 days", value: 60 * 60 * 24 * 5 },
  { label: "Delete after 7 days", value: 60 * 60 * 24 * 7 },
] as const;

export default function AdminPanel({ bucket }: { bucket: string }) {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [uploadLink, setUploadLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [expireTime, setExpireTime] = useState(expireTimes[0].value.toString());

  const fetchFiles = useCallback(async () => {
    const fileList = await listFiles(bucket);
    if (!fileList) return;

    const fileInfoList: FileInfo[] = fileList.map((obj) => ({
      author: "Not done yet",
      hash: obj.Key ?? "",
      expiresAt: obj.Metadata?.["expires"] ?? "",
      size: obj.Size ?? 0,
      uploadedAt: obj.LastModified?.toLocaleString() ?? "",
      originalName: obj.Metadata?.["original-filename"] ?? "",
    }));

    setFiles(fileInfoList);
  }, [bucket]);

  const handleDelete = (files: string[]) => {
    // @todo useOptimistic instead of useState ?
    // @todo refactor fetchFiles to maintain loading state itself and not the useEffect?
    setFiles((prev) => prev.filter((file) => files.includes(file.hash)));
  };

  useEffect(() => {
    setLoading(true);

    fetchFiles()
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [fetchFiles]);

  const reset = () => {
    setName("");
    setEmail("");
    setIsGenerating(false);
    setExpireTime(expireTimes[0].value.toString());
  };

  const handleUrlGeneration = async () => {
    if (name.trim().length === 0 || email.trim().length === 0) return;

    setIsGenerating(true);
    setError(null);

    const payload: UploadRequestProps = {
      expireIn: Number(expireTime),
      client: {
        name,
        email,
      },
    };

    try {
      const uploadHash = await generateUploadRequest(bucket, payload);

      if (!uploadHash) {
        setError("Error generating sharing URL.");
        return;
      }

      setUploadLink(
        `${location.origin}/upload/${encodeURIComponent(uploadHash)}`
      );
      setModalOpen(false);
      reset();
    } catch (err) {
      console.error("Error while generating url", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>File List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Uploaded By</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded At</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!isLoading &&
                files.map((file) => (
                  <TableRow key={file.hash}>
                    <TableCell>{file.author}</TableCell>
                    <TableCell>{file.originalName}</TableCell>
                    <TableCell>{(file.size / 1024).toFixed(2)} KB</TableCell>
                    <TableCell>{file.uploadedAt}</TableCell>
                    <TableCell>
                      <DownloadButton hash={file.hash} />
                      <DeleteButton hash={file.hash} onDelete={handleDelete} />
                    </TableCell>
                  </TableRow>
                ))}
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <div className="flex w-full items-center justify-center">
                      <LoaderPinwheel className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {files.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No files were found on the server
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Generate Upload Link</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog modal open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setModalOpen(true)}>
                Generate Upload Link
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Upload URL Generation</DialogTitle>
                <DialogDescription>
                  Generate upload URL for customers. Share the URL to them so
                  that they can start uploading files.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Client's Name for Reference"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    E-Mail
                  </Label>
                  <Input
                    id="username"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Client E-Mail Address for Reference"
                    className="col-span-3"
                    autoComplete="off"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="expire" className="text-right">
                    Expire In
                  </Label>
                  <div className="col-span-3">
                    <Select
                      value={expireTime.toString()}
                      onValueChange={setExpireTime}
                    >
                      <SelectTrigger className="w-full mb-4">
                        <SelectValue placeholder="Select expire time" />
                      </SelectTrigger>
                      <SelectContent>
                        {expireTimes.map((duration, index) => (
                          <SelectItem
                            value={duration.value.toString()}
                            key={`duration-${index}-${duration.value}`}
                          >
                            {duration.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {error && <p className="text-red-700">{error}</p>}
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={isGenerating}
                  onClick={handleUrlGeneration}
                >
                  Generate URL
                  {isGenerating && (
                    <LoaderPinwheel className="mr-2 h-4 w-4 animate-spin" />
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {uploadLink && (
            <div className="mt-4">
              <p>Upload Link:</p>
              <a
                href={uploadLink}
                className="flex gap-2 text-blue-500 break-all hover:underline"
                target="_blank"
              >
                {uploadLink} <ExternalLink className="w-4" />
              </a>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <LogoutClick />
      </div>
    </div>
  );
}
