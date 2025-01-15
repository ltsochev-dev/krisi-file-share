import Features from "@/components/features";
import Hero from "@/components/hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <main className="container mx-auto px-4 py-8">
        <Hero />
        <Features />
      </main>
    </div>
  );
}
