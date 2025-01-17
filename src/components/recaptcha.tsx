"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

export interface RecaptchaProps {
  siteKey: string;
  onVerify?: (token: string) => void;
}

export default function Recaptcha({ siteKey, onVerify }: RecaptchaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  const handleOnLoad = () => {
    setSdkLoaded(true);
  };

  useEffect(() => {
    let turnStileId: string | undefined;

    if (sdkLoaded && containerRef.current) {
      turnStileId = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: onVerify,
      });
    }

    return () => {
      if ("turnstile" in window && turnStileId) {
        window.turnstile.remove(turnStileId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sdkLoaded, siteKey]);

  return (
    <div className="block flex-row">
      <div
        className="cf-turnstile"
        data-size="flexible"
        ref={containerRef}
      ></div>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        onReady={handleOnLoad}
        async
        defer
      />
    </div>
  );
}
