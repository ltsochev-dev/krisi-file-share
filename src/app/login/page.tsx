import LogiButton from "@/components/LoginButton";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <main className="container mx-auto px-4 py-8">
        <div className="flex w-full justify-center">
          <LogiButton />
        </div>
      </main>
    </div>
  );
}
