import Preloader from "@/components/site/Preloader";
import CustomCursor from "@/components/site/CustomCursor";
import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import Marquee from "@/components/site/Marquee";
import Engagements from "@/components/site/Engagements";
import Signatures from "@/components/site/Signatures";
import MenuSection from "@/components/site/MenuSection";
import Traiteur from "@/components/site/Traiteur";
import Reviews from "@/components/site/Reviews";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";

export default function Home() {
  return (
    <div className="grain relative min-h-screen flex flex-col">
      <Preloader />
      <CustomCursor />
      <Navbar />

      <main className="flex-1">
        <Hero />
        <Marquee />
        <Engagements />
        <Signatures />
        <MenuSection />
        <Traiteur />
        <Reviews />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
