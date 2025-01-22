"use server";

import S3Storage from "@/storage";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";

export default async function DeleteObject(
  Bucket: string,
  { hash }: { hash: string }
) {
  const fileList = [hash, `${hash}.request`];

  const command = new DeleteObjectsCommand({
    Bucket,
    Delete: {
      Objects: fileList.map((Key) => ({ Key })),
    },
  });

  const { Deleted } = await S3Storage.send(command);

  return Deleted;
}
