"use client";

import { useState } from "react";
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

const expireTimes = [
  { label: "Delete after 6 hours", value: 60 * 60 * 6 },
  { label: "Delete after 8 hours", value: 60 * 60 * 8 },
  { label: "Delete after 12 hours", value: 60 * 60 * 12 },
  { label: "Delete after 24 hours", value: 60 * 60 * 24 },
  { label: "Delete after 3 days", value: 60 * 60 * 24 * 3 },
  { label: "Delete after 5 days", value: 60 * 60 * 24 * 5 },
  { label: "Delete after 7 days", value: 60 * 60 * 24 * 7 },
] as const;

export default function AdminPanel() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [uploadLink, setUploadLink] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [expireTime, setExpireTime] = useState(expireTimes[0].value.toString());

  const reset = () => {
    setName("");
    setEmail("");
    setIsGenerating(false);
    setExpireTime(expireTimes[0].value.toString());
  };

  const handleUrlGeneration = () => {
    if (name.trim().length === 0 || email.trim().length === 0) return;

    setIsGenerating(true);

    setTimeout(() => {
      reset();
      setUploadLink("https://1337.code/url");
      setModalOpen(false);
      setFiles([]);
    }, 3000);
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
              {files.map((file) => (
                <TableRow key={file.pathname}>
                  <TableCell>{file.pathname}</TableCell>
                  <TableCell>{(file.size / 1024).toFixed(2)} KB</TableCell>
                  <TableCell>
                    {new Date(file.uploadedAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <a
                      href={file.url}
                      download
                      className="text-blue-500 hover:underline"
                    >
                      Download
                    </a>
                  </TableCell>
                </TableRow>
              ))}
              {files.length === 0 && (
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
                    placeholder="Clien't E-Mail Address for Reference"
                    className="col-span-3"
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
