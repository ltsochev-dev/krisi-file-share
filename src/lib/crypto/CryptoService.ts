import { base64ToArrayBuffer } from "./utils";

export default class CryptoService {
  private pubKey: CryptoKey;

  constructor(pubKey: CryptoKey) {
    this.pubKey = pubKey;
  }

  static async importKey(pubKey: string) {
    const binaryDer = base64ToArrayBuffer(pubKey);

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

  generateIv(length = 12) {
    return window.crypto.getRandomValues(new Uint8Array(length));
  }

  async encryptFile(file: File, aesKey: CryptoKey, iv: Uint8Array) {
    const fileBuffer = await file.arrayBuffer();

    return window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      aesKey,
      fileBuffer
    );
  }

  async encryptFileToStream(
    file: File,
    aesKey: CryptoKey,
    iv: Uint8Array,
    chunkSize = 1024 * 1024 * 16
  ) {
    return new ReadableStream({
      async start(controller) {
        let offset = 0;

        while (offset < file.size) {
          const chunk = file.slice(
            offset,
            Math.min(file.size, offset + chunkSize)
          );
          const buffer = await new Response(chunk).arrayBuffer();

          const encryptedChunk = await window.crypto.subtle.encrypt(
            {
              name: "AES-GCM",
              iv,
            },
            aesKey,
            buffer
          );

          controller.enqueue(new Uint8Array(encryptedChunk));
          offset += buffer.byteLength;
        }

        controller.close();
      },
      cancel(reason) {
        console.log("Encrypt stream cancelled", reason);
      },
    });
  }

  async generateKey() {
    const aesKey = await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt"]
    );

    const wrappedKey = await window.crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      this.pubKey,
      await window.crypto.subtle.exportKey("raw", aesKey)
    );

    return { wrappedKey, aesKey };
  }
}
