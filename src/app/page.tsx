import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/ui/Hero";
import FeaturesSection from "@/components/ui/FeaturesSection";
import GitHubActivity from "@/components/ui/GitHubActivity";
import ArticlesSection from "@/components/ui/ArticlesSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />
      <FeaturesSection />
      <GitHubActivity />
      <ArticlesSection />
      <Footer />
    </main>
  );
}