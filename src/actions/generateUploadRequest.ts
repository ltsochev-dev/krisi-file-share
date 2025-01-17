"use server";

import S3Storage from "@/storage";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";

export interface UploadRequestProps {
  expireIn: number;
  client: {
    name: string;
    email: string;
  };
}

export default async function generateUploadRequest(
  Bucket: string,
  { ...props }: UploadRequestProps
) {
  try {
    const filename = nanoid();
    const Key = `${filename}.request`;

    const command = new PutObjectCommand({
      Bucket,
      Key,
      Body: JSON.stringify(generateMetadata({ ...props })),
      Expires: new Date(Date.now() + props.expireIn * 1000),
      ContentType: "text/plain",
    });

    await S3Storage.send(command);

    return filename;
  } catch (error) {
    console.error("Error uploading file:", error);
    return false;
  }
}

const generateMetadata = (props: UploadRequestProps) => ({
  time: new Date().toUTCString(),
  ...props,
});
