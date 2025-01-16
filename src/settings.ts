const AppSettings = {
  encryptPubKey: process.env?.NEXT_PUBLIC_ENCRYPTION_PUBLIC_KEY ?? null,
  multipartMinSize: 1024 * 1024 * 5, // 5 MB
} as const;

export default AppSettings;
