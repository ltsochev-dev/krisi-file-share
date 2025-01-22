"use client";

import getPresignedDownloadUrl from "@/actions/getPresignedDownloadUrl";
import { Button } from "@/components/ui/button";
import { DownloadIcon, Key, LoaderPinwheel } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

type FileInfo = Awaited<ReturnType<typeof getPresignedDownloadUrl>>;

export default function DownloadButton({ hash }: { hash: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);

  const handleDownload = useCallback(async () => {
    setFileInfo(null);
    setLoading(true);
    setError(null);

    try {
      const presignedRes = await getPresignedDownloadUrl(
        process.env.NEXT_PUBLIC_AWS_BUCKET!,
        hash
      );

      if (!presignedRes) {
        setError("Something went wrong");
        return;
      }

      setFileInfo({ ...presignedRes });
    } catch (e) {
      console.error("Error occured: ", e);
      if (e instanceof Error) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  }, [hash]);

  return (
    <>
      {!fileInfo && (
        <Button onClick={handleDownload} disabled={loading} variant="link">
          {loading && <LoaderPinwheel className="mr-2 h-4 w-4 animate-spin" />}
          {!loading && <DownloadIcon className="mr-2 h-4 w-4" />}
          Fetch info
        </Button>
      )}
      {fileInfo && (
        <div className="flex items-center gap-2">
          <Link
            href={fileInfo.url}
            download={fileInfo.filename}
            className="flex items-center justify-start"
          >
            {!loading && <DownloadIcon className="mr-2 h-4 w-4" />}
            Download
          </Link>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link">
                <Key className="h-4 w-4" />
                Key Data
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Decryption information</DialogTitle>
                <DialogDescription>
                  Insert this data into your decryptor alongside the file that
                  you just downloaded. You&apos;ll end up with an actual file
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="aesKey" className="text-right">
                    AES Key
                  </Label>
                  <Input
                    id="aesKey"
                    value={fileInfo.aesKey}
                    className="col-span-3"
                    readOnly
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="aes-iv" className="text-right">
                    AES IV
                  </Label>
                  <Input
                    id="aes-iv"
                    value={fileInfo.aesIv}
                    className="col-span-3"
                    readOnly
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
      {error && <p className="text-red-700">{error}</p>}
    </>
  );
}
