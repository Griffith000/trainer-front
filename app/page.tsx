import {
  FAQ,
  Features,
  Footer,
  Hero,
  HowItWorks,
  Navbar,
} from "@/components/landing";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
