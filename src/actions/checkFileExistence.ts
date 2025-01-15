"use server";

import S3Storage from "@/storage";
import { HeadObjectCommand } from "@aws-sdk/client-s3";

export default async function checkFileExistence(
  Bucket: string,
  filename: string
) {
  try {
    const command = new HeadObjectCommand({
      Bucket,
      Key: filename,
    });
    await S3Storage.send(command);
    return true;
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "NotFound"
    ) {
      console.log(`File does not exist: ${filename}`);
      return false;
    }
    console.error("Error checking file existence:", error);
    throw error;
  }
}
