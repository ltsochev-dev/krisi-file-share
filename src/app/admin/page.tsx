import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogoutClick } from "@/components/logout-btn";

export default async function PrivatePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  const { user } = data;
  const isAdmin = user?.user_metadata?.is_super_admin ?? false;

  if (!isAdmin) {
    await supabase.auth.signOut();
    redirect("/login?error=unauthorized");
  }

  return (
    <p>
      Hello {data.user.email} - <LogoutClick />
    </p>
  );
}
