import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import FeaturedWork from "@/components/sections/FeaturedWork";
import Drive from "@/components/sections/Drive";
import Testimonials from "@/components/sections/Testimonials";
import CtaBand from "@/components/sections/CtaBand";

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <FeaturedWork />
      <Drive />
      <Testimonials />
      <CtaBand />
    </main>
  );
}
