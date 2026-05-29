import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/ui/Hero";
import GitHubActivity from "@/components/ui/GitHubActivity";
import ArticlesSection from "@/components/ui/ArticlesSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />
      <GitHubActivity />
      <ArticlesSection />
    </main>
  );
}