"use server";

import S3Storage from "@/storage";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export default async function generateUploadRequest(
  Bucket: string,
  filename: string
) {
  try {
    const Key = `${filename}.request`;

    const command = new PutObjectCommand({
      Bucket,
      Key,
      Body: JSON.stringify({ time: new Date().toUTCString() }),
      Expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Set expiration for 3 days
      ContentType: "text/plain",
    });

    await S3Storage.send(command);

    return true;
  } catch (error) {
    console.error("Error uploading file:", error);
    return false;
  }
}
