import { useEffect, useState } from "react";
import CryptoService from "@/lib/crypto/CryptoService";

export default function useCrypto(pubKey?: string | null) {
  const [cryptoService, setCryptoService] = useState<CryptoService | null>(
    null
  );
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return {
    cryptoService,
    loaded,
    error,
  };
}
