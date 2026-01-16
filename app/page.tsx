"use client";
import { AnimatedText } from "@/components/ui/animated-text";
import { HoverLink } from "@/components/ui/hover-link";
import { SectionTitle } from "@/components/ui/section-title";
import Dock from "@/components/Dock";
import BlurText from "@/components/BlurText";
import { FaGithub, FaYoutube, FaDiscord, FaCube } from "react-icons/fa";
import SpotlightCard from "@/components/SpotlightCard";
import { useEffect, useRef } from "react";
export default function Home() {
  const dockItems = [
    {
      icon: <FaGithub size={18} />,
      label: "GitHub",
      onClick: () =>
        window.open("https://github.com/xxpwnxxx420lord/", "_blank"),
    },
    {
      icon: <FaYoutube size={18} />,
      label: "YouTube",
      onClick: () =>
        window.open("https://www.youtube.com/@Syntax1cal", "_blank"),
    },
    {
      icon: <FaCube size={18} />,
      label: "Roblox",
      onClick: () =>
        window.open(
          "https://www.roblox.com/users/1928403403/profile",
          "_blank"
        ),
    },
    {
      icon: <FaDiscord size={18} />,
      label: "Discord",
      onClick: () => window.open("https://discord.gg/JmnsBfBAk9", "_blank"),
    },
  ];
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Video autoplay prevented:", error);
      });
    }
  }, []);

  return (
    <div className="h-screen w-screen bg-black text-white font-mono relative flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted={false}
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source
          src="https://raw.githubusercontent.com/Barnical/Barnical.github.io/main/Videos/YTDown.com_YouTube_GTR-r35-Edit-SLAY-After-Effects-Laydin-E_Media_4mHi-N4D3VU_001_1080p.mp4"
          type="video/mp4"
        />
      </video>
      
      {/* Transparent overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />
      
      <div className="relative z-20 w-full max-w-md px-4 flex flex-col items-center pb-24">
        <SpotlightCard className="w-full p-6" spotlightColor="rgba(170, 0, 255, 0.51)">
          <div className="space-y-5">
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-full border-2 border-white/20 overflow-hidden backdrop-blur-sm">
                <img
                  src="https://rscripts.net/_next/image?url=%2Fassets%2Favatars%2Favatar_67a4813c09a084ca96213dcc_1768534790010_XMgiBWHZ.webp&w=256&q=75"
                  alt="Profile Picture"
                  className="w-full h-full object-cover"
                />
              </div>
              <header className="text-center">
                <BlurText
                  text="Hey, I'm Syntaxical! 👋"
                  delay={150}
                  animateBy="words"
                  direction="top"
                  className="text-lg font-normal tracking-tight"
                />
              </header>
            </div>
            <div className="space-y-4 text-xs leading-relaxed">
              <section>
                <AnimatedText delay={0.1}>
                  <p className="text-white/70 text-center">
                    I'm a developer and designer who loves to create things! I'm currently a student who lives in New South Wales, Australia!
                  </p>
                </AnimatedText>
              </section>
              <section className="space-y-2">
                <SectionTitle className="text-xs font-normal text-white/80 uppercase tracking-wider text-center">
                  About
                </SectionTitle>
                <AnimatedText delay={0.2}>
                  <p className="text-white/60 text-center text-xs">
                    I code Luau, Python, and Javascript (poorly), I also make terrible UI's in Roblox Studio, check out my github below!
                  </p>
                </AnimatedText>
              </section>
              <section className="space-y-3 pt-2">
                <SectionTitle className="text-xs font-normal text-white/80 uppercase tracking-wider text-center">
                  Links
                </SectionTitle>
                <AnimatedText delay={0.3}>
                  <ul className="space-y-2 text-white/60 text-center text-xs">
                    <li>
                      <HoverLink
                        href="https://barnical.github.io"
                        className="text-white/60 hover:text-white transition-colors"
                      >
                        Barnical!
                      </HoverLink>
                    </li>
                    <li>
                      <HoverLink
                        href="https://open.spotify.com/playlist/70RJILrVrpc5tmByjZCB1t?si=8bfd21ced81041ae"
                        className="text-white/60 hover:text-white transition-colors"
                      >
                        My playlist!
                      </HoverLink>
                    </li>
                  </ul>
                </AnimatedText>
              </section>
            </div>
          </div>
        </SpotlightCard>
      </div>
      <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50 pb-4">
        <Dock
          items={dockItems}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />
      </div>
    </div>
  );
}