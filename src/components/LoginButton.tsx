"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function LogiButton() {
  const handleLogin = async () => {
    const supabase = createClient();

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback?next=/admin`,
      },
    });
  };

  return <Button onClick={handleLogin}>Login using Google OAuth</Button>;
}
