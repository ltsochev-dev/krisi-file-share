import { useCallback, useEffect, useState } from "react";
import CryptoService from "@/lib/crypto/CryptoService";

export default function useCrypto(pubKey?: string | null) {
  const [cryptoService, setCryptoService] = useState<CryptoService | null>(
    null
  );
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasError = error !== null;

  const monitorStreamProgress = useCallback(
    (readableStream: ReadableStream, onProgress?: (bytes: number) => void) => {
      let bytesProcessed = 0;

      const reader = readableStream.getReader();

      return new ReadableStream({
        async start(controller) {
          const push = async () => {
            const chunk = await reader.read();
            if (chunk.done) {
              controller.close();
              return;
            }

            // Track progress
            bytesProcessed += chunk.value.length;
            onProgress?.(bytesProcessed);

            controller.enqueue(chunk.value);
            await push();
          };

          push();
        },
        cancel(reason) {
          reader.cancel(reason);
        },
      });
    },
    []
  );

  useEffect(() => {
    const initCryptoService = async () => {
      try {
        const key = await CryptoService.importKey(pubKey!);
        const service = new CryptoService(key);

        setCryptoService(service);
        setLoaded(true);
      } catch (error) {
        setError("Failed to initialize encryption service");
        console.error("Failed to initialize encryption service:", error);
      }
    };

    if (pubKey) {
      initCryptoService();
    }
  }, [pubKey]);

  const encryptFile = useCallback(
    async ({
      file,
      chunkSize = 1024 * 1024 * 64,
    }: {
      file: File;
      chunkSize?: number;
    }) => {
      if (!cryptoService || !loaded) {
        setError("Encryption service is not ready");
        return Promise.resolve(null);
      }

      try {
        // Generate AES-GCM-256 key for file encryption
        const iv = await cryptoService.generateIv();
        const { aesKey, wrappedKey } = await cryptoService.generateKey();

        const base64EncryptedKey = btoa(
          String.fromCharCode(...new Uint8Array(wrappedKey))
        );
        const ivBase64 = btoa(String.fromCharCode(...iv));
        const encryptStream = await cryptoService.encryptFile(
          file,
          aesKey,
          iv,
          chunkSize
        );

        return {
          iv: ivBase64,
          key: base64EncryptedKey,
          fileStream: encryptStream,
        };
      } catch (err) {
        setError("Encryption failed");
        console.error(err);
        return Promise.resolve(null);
      }
    },
    [cryptoService, loaded]
  );

  return {
    cryptoService,
    encryptFile,
    monitorStreamProgress,
    loaded,
    hasError,
    error,
  };
}
