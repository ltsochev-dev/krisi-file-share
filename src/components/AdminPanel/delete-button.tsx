"use client";

import { useState } from "react";
import { Delete, LoaderPinwheel } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteObject from "@/actions/deleteObject";

export default function DeleteButton({ hash }: { hash: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm("Are you sure you wish to delete the selected file?")) {
      return;
    }

    try {
      setLoading(true);

      await DeleteObject(process.env.NEXT_PUBLIC_AWS_BUCKET!, { hash });
    } catch (e) {
      console.error(e);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={handleDelete} disabled={loading} variant="link">
        {loading && <LoaderPinwheel className="mr-2 h-4 w-4 animate-spin" />}
        {!loading && <Delete className="mr-2 h-4 w-4 text-red-600" />}
        Delete file
      </Button>
      {error && <p className="text-red-600 text-xs">{error}</p>}
    </>
  );
}
