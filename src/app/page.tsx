import Features from "@/components/features";
import Hero from "@/components/hero";
import { LogoutClick } from "@/components/logout-btn";
import RequestUrl from "@/components/request-url";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  const { user } = data ?? {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <main className="container mx-auto px-4 py-8">
        <Hero>
          {!error && user && (
            <div className="user-panel">
              <p className="text-center mb-4">Logged in as {user.email}</p>
              <div className="flex flex-wrap gap-4 justify-center items-center">
                {user?.user_metadata?.is_super_admin && (
                  <Link
                    href="/admin"
                    className="flex items-center h-12 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium"
                  >
                    Admin Panel
                  </Link>
                )}
                <LogoutClick />
              </div>
            </div>
          )}
          {!user && (
            <div className="flex gap-4 justify-center items-center">
              <Link
                href="/login"
                className="px-4 py-2 w-full bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium"
              >
                Go to login page
              </Link>
              <RequestUrl />
            </div>
          )}
        </Hero>
        <Features />
      </main>
    </div>
  );
}
