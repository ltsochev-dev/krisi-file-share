import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminPanel from "@/components/AdminPanel";

export default async function AdminPage() {
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <AdminPanel bucket={process.env.NEXT_PUBLIC_AWS_BUCKET!} />
    </div>
  );
}
