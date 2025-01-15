"use server";

import { S3Client } from "@aws-sdk/client-s3";

const client = new S3Client({
  region: process.env.AWS_DEFAULT_REGION ?? undefined,
  credentials: {
    accessKeyId: process.env?.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env?.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

export default client;
