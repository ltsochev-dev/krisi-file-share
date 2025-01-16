import { useCallback, useEffect, useState } from "react";
import CryptoService from "@/lib/crypto/CryptoService";

export default function useCrypto(pubKey?: string | null) {
  const [cryptoService, setCryptoService] = useState<CryptoService | null>(
    null
  );
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasError = error !== null;

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
      chunkSize = 1024 * 64,
      onProgress,
    }: {
      file: File | ArrayBuffer;
      chunkSize?: number;
      onProgress?: (progress: number) => void;
    }) => {
      if (!cryptoService || !loaded) {
        setError("Encryption service is not ready");
        return new ArrayBuffer();
      }

      try {
        // @todo implement onProgress
        return cryptoService.encryptFile(file, chunkSize, onProgress);
      } catch (err) {
        setError("Encryption failed");
        console.error(err);
        return new ArrayBuffer();
      }
    },
    [cryptoService, loaded]
  );

  return {
    cryptoService,
    encryptFile,
    loaded,
    hasError,
    error,
  };
}
