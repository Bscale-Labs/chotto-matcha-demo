import "server-only";

import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client
} from "@aws-sdk/client-s3";

export type StoredAsset = {
  key: string;
  url: string;
};

function requiredEnv(key: string) {
  const value = process.env[key];
  if (!value) throw new Error(`${key} is not set`);
  return value;
}

function getBucketConfig() {
  return {
    bucket: requiredEnv("BUCKET_NAME"),
    endpoint: requiredEnv("BUCKET_ENDPOINT"),
    accessKeyId: requiredEnv("BUCKET_ACCESS_KEY_ID"),
    secretAccessKey: requiredEnv("BUCKET_SECRET_ACCESS_KEY")
  };
}

let s3Client: S3Client | null = null;

function getS3Client() {
  if (s3Client) return s3Client;
  const config = getBucketConfig();
  s3Client = new S3Client({
    endpoint: config.endpoint,
    region: process.env.BUCKET_REGION ?? "auto",
    forcePathStyle: true,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey
    }
  });
  return s3Client;
}

export function getAssetUrl(key: string) {
  return `/api/uploads/${key.split("/").map(encodeURIComponent).join("/")}`;
}

export async function putAssetObject({
  key,
  file,
  contentType
}: {
  key: string;
  file: File;
  contentType: string;
}) {
  const config = getBucketConfig();
  const body = Buffer.from(await file.arrayBuffer());
  await getS3Client().send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: body,
      ContentType: contentType
    })
  );
  return { key, url: getAssetUrl(key) };
}

export async function getAssetObject(key: string) {
  const config = getBucketConfig();
  return getS3Client().send(
    new GetObjectCommand({
      Bucket: config.bucket,
      Key: key
    })
  );
}

export async function deleteAssetObject(key: string) {
  const config = getBucketConfig();
  await getS3Client().send(
    new DeleteObjectCommand({
      Bucket: config.bucket,
      Key: key
    })
  );
}
