"use server";

import S3Storage from "@/storage";
import {
  HeadObjectCommand,
  ListObjectsV2Command,
  ListObjectsV2CommandOutput,
} from "@aws-sdk/client-s3";

export default async function listFiles(bucket: string) {
  try {
    const fileList: {
      Key: string | undefined;
      Size: number | undefined;
      LastModified: Date | undefined;
      Metadata: Record<string, string> | undefined;
    }[] = [];
    let continuationToken: string | undefined;

    do {
      const command = new ListObjectsV2Command({
        Bucket: bucket,
        ContinuationToken: continuationToken,
      });

      const data: ListObjectsV2CommandOutput = await S3Storage.send(command);
      if (!data.Contents) return false;

      const metadataPromises = data.Contents.filter(
        (obj) => obj.Key?.includes(".request") === false
      )
        .map(async (obj) => {
          if (obj.Key) {
            const headResponse = await S3Storage.send(
              new HeadObjectCommand({ Bucket: bucket, Key: obj.Key })
            );

            return {
              Key: obj.Key,
              Metadata: headResponse.Metadata,
              Size: obj.Size,
              LastModified: obj.LastModified,
            };
          }
        })
        .filter(Boolean);

      const results = await Promise.all(metadataPromises);
      results.forEach((item) => {
        if (item) {
          fileList.push(item);
        }
      });

      continuationToken = data.ContinuationToken;
    } while (continuationToken);

    const sortedObjects = fileList.sort(
      (a, b) =>
        (b.LastModified?.getTime() || 0) - (a.LastModified?.getTime() || 0)
    );

    return sortedObjects;
  } catch (err) {
    console.error("Error while fetching S3 objects:", err);
    return false;
  }
}
