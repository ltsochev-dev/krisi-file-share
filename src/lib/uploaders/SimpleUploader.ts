"use client";

import type { AxiosRequestConfig, AxiosProgressEvent } from "axios";
import axios from "axios";

type ProgressEventHandler = (progress: UploadProgressEvent) => void;

export interface UploadProgressEvent extends AxiosProgressEvent {
  percentCompleted: number | null;
}

export interface SimpleUploaderProps {
  file: File;
  presignedUrl: string;
  onProgress: ProgressEventHandler;
  headers?: AxiosRequestConfig["headers"];
}

export default class SimpleUploader {
  private file: Blob;
  private presignedUrl: string;
  private onProgress?: ProgressEventHandler;
  private headers?: AxiosRequestConfig["headers"];

  constructor({
    file,
    presignedUrl,
    onProgress,
    headers,
  }: SimpleUploaderProps) {
    this.file = file;
    this.headers = headers;
    this.presignedUrl = presignedUrl;
    this.onProgress = onProgress;
  }

  private axiosConfig(): AxiosRequestConfig {
    return {
      headers: {
        "Content-Type": "application/octet-stream",
        ...this.headers,
      },
      onUploadProgress: (progress: AxiosProgressEvent) => {
        if (this.onProgress) {
          const percentCompleted = progress.total
            ? Math.round(progress.loaded / progress.total) * 100
            : null;

          this.onProgress({ percentCompleted, ...progress });
        }
      },
    };
  }

  async upload() {
    const response = await axios.put(
      this.presignedUrl,
      this.file,
      this.axiosConfig()
    );

    if (response.status !== 200) {
      throw new Error(`Failed to upload chunk: ${response.statusText}`);
    }

    return response;
  }
}
