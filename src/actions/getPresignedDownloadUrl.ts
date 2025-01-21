"use server";

import S3Storage from "@/storage";
import { GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default async function getPresignedDownloadUrl(
  bucket: string,
  hash: string
) {
  const awsBucket =
    bucket?.length > 0 ? bucket : process.env.NEXT_PUBLIC_AWS_BUCKET!;
  const command = new GetObjectCommand({
    Bucket: awsBucket,
    Key: hash,
  });

  const metadata = await getMetadata(awsBucket, hash);
  if (!metadata) {
    return false;
  }

  const presignedUrl = await getSignedUrl(S3Storage, command, {
    expiresIn: 3600,
  });

  const url = presignedUrl;

  return {
    filename: metadata?.["original-filename"] ?? hash,
    extension: metadata?.["original-extension"],
    type: metadata?.["mimetype"],
    size: metadata.size,
    aesKey: metadata?.["aes-key"],
    aesIv: metadata?.["aes-iv"],
    url,
  };
}

async function getMetadata(bucket: string, hash: string) {
  const command = new HeadObjectCommand({
    Bucket: bucket,
    Key: hash,
  });

  const metadataResponse = await S3Storage.send(command);

  return {
    size: metadataResponse.ContentLength?.toString() as string,
    ...metadataResponse.Metadata,
  };

  return metadataResponse.Metadata;
}
