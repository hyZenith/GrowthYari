import { Header } from "@/components/header";
import { HeroSection } from "@/components/heroSection";
import { FeatureSection } from "@/components/featureSection";
import { SolutionSection } from "@/components/solutionSection";
import { YariConnect } from "@/components/yariConnect";
import { ConnectionSection } from "@/components/connectionSection";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <FeatureSection />
      <SolutionSection />
      <YariConnect />
      <ConnectionSection />
      <Footer />
    </main>

  );
}
