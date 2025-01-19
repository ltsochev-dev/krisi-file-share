"use client";

import getPresignedDownloadUrl from "@/actions/getPresignedDownloadUrl";
import { Button } from "@/components/ui/button";
import { DownloadIcon, LoaderPinwheel } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";

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
        process.env.AWS_BUCKET!,
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
        <Link
          href={fileInfo.url}
          download
          className="flex items-center justify-start"
        >
          {!loading && <DownloadIcon className="mr-2 h-4 w-4" />}
          Download
        </Link>
      )}
      {error && <p className="text-red-700">{error}</p>}
    </>
  );
}
