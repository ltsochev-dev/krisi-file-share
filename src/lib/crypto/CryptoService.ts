import { base64ToArrayBuffer } from "./utils";

export default class CryptoService {
  private cryptoKey: CryptoKey;

  constructor(cryptoKey: CryptoKey) {
    this.cryptoKey = cryptoKey;
  }

  async encryptFile(
    file: File | ArrayBuffer,
    chunkSize: number = 64 * 1024,
    onProgress?: (progress: number) => void
  ): Promise<ArrayBuffer> {
    const data = file instanceof File ? await file.arrayBuffer() : file;
    const totalSize = data.byteLength;
    const encryptedChunks: ArrayBuffer[] = [];

    let offset = 0;

    while (offset < totalSize) {
      const chunk = data.slice(offset, offset + chunkSize);

      const encryptedChunk = await crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        this.cryptoKey,
        chunk
      );

      encryptedChunks.push(encryptedChunk);
      offset += chunkSize;

      if (onProgress) {
        onProgress(Math.min(100, (offset / totalSize) * 100));
      }
    }

    const combined = this.combineChunks(encryptedChunks);
    return combined;
  }

  private combineChunks(chunks: ArrayBuffer[]) {
    const totalSize = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
    const combined = new Uint8Array(totalSize);

    let offset = 0;
    for (const chunk of chunks) {
      combined.set(new Uint8Array(chunk), offset);
      offset += chunk.byteLength;
    }

    return combined.buffer;
  }

  static async importKey(rsaKey: string): Promise<CryptoKey> {
    const binaryDer = base64ToArrayBuffer(rsaKey);

    return crypto.subtle.importKey(
      "spki",
      binaryDer,
      {
        name: "RSA-OAEP",
        hash: { name: "SHA-256" },
      },
      true,
      ["encrypt"]
    );
  }
}
