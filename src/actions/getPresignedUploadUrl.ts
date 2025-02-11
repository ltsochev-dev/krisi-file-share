"use server";

import S3Storage from "@/storage";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export interface PresignedUploadUrlProps {
  hash: string;
  expireIn: number;
  size: number;
  type: string;
  metadata?: Record<string, string>;
}

export default async function getPresignedUploadUrl(
  Bucket: string,
  { hash, metadata }: PresignedUploadUrlProps
) {
  try {
    const command = new PutObjectCommand({
      Bucket,
      Key: hash,
      // Expires: new Date(Date.now() + expireIn * 1000),
      Metadata: metadata,
    });

    return getSignedUrl(S3Storage, command, { expiresIn: 3600 });
  } catch (err) {
    console.error(
      "Error while generating a simple presigned upload url: ",
      err
    );
    return false;
  }
}
