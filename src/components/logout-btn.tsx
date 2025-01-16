"use client";

import { createClient as browserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutClick() {
  const router = useRouter();

  const handleClick = async () => {
    const supabase = browserClient();

    await supabase.auth.signOut();

    router.push("/login");
  };

  return (
    <Button onClick={handleClick} className="bg-purple-600 hover:bg-purple-700">
      Sign Out
    </Button>
  );
}
