const AppSettings = {
  encryptPubKey: process.env?.NEXT_PUBLIC_ENCRYPTION_PUBLIC_KEY ?? null,
} as const;

export default AppSettings;
