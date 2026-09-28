import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MeetIvanSection from "@/components/MeetIvanSection";
import MemoriesSection from "@/components/MemoriesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import DestinationsSection from "@/components/DestinationsSection";
import DestinationsIntro from "@/components/DestinationsIntro";
import fs from 'fs';
import path from 'path';

export default function Home() {
  const memoriesDir = path.join(process.cwd(), 'public', 'memories')
  let memoryImages: string[] = []
  try {
    const files = fs.readdirSync(memoriesDir)
    memoryImages = files.filter(f => f.match(/\.(jpg|jpeg|png|webp|gif)$/i))
  } catch (e) {
    console.error("Failed to read memories directory", e)
  }

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />

        {/* Placeholder sections for nav scroll-spy */}
        <MeetIvanSection />
        <MemoriesSection images={memoryImages} />
        <TestimonialsSection />
        <DestinationsIntro />
        <DestinationsSection />
      </main>
    </>
  );
}
