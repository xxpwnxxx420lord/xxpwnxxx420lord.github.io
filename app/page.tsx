"use client";
import { AnimatedText } from "@/components/ui/animated-text";
import { HoverLink } from "@/components/ui/hover-link";
import { SectionTitle } from "@/components/ui/section-title";
import Dock from "@/components/Dock";
import ShinyText from "@/components/ShinyText";
import { FaGithub, FaYoutube, FaDiscord, FaGamepad } from "react-icons/fa";
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
      icon: <FaGamepad size={18} />,
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
  return (
    <div className="min-h-screen bg-black text-white font-mono relative">
      {" "}
      <main className="container mx-auto px-6 py-16 max-w-4xl pb-32 relative z-10">
        {" "}
        <div className="space-y-8">
          {" "}
          <header className="border-b border-white/10 pb-8">
            {" "}
            <AnimatedText>
              {" "}
              <h1 className="text-2xl font-normal tracking-tight">
                {" "}
                <ShinyText
                  text="Hey, I'm Syntaxical! 👋"
                  speed={2}
                  delay={0}
                  color="#b5b5b5"
                  shineColor="#ffffff"
                  spread={120}
                  direction="left"
                  yoyo={false}
                  pauseOnHover={false}
                />{" "}
              </h1>{" "}
            </AnimatedText>{" "}
          </header>{" "}
          <div className="space-y-6 text-sm leading-relaxed">
            {" "}
            <section>
              {" "}
              <AnimatedText delay={0.1}>
                {" "}
                <p className="text-white/60 mb-4">
                  {" "}
                  I'm a developer and designer who loves to create things! I'm currently a student who lives in New South Wales, Australia!{" "}
                </p>{" "}
              </AnimatedText>{" "}
            </section>{" "}
            <section className="space-y-4">
              {" "}
              <SectionTitle className="text-base font-normal text-white/80 uppercase tracking-wider">
                {" "}
                About{" "}
              </SectionTitle>{" "}
              <AnimatedText delay={0.2}>
                {" "}
                  {" "}
                <p className="text-white/60">
                  I code luau, python, and javascript (poorly) check out my github below!{" "}
                </p>{" "}
              </AnimatedText>{" "}
            </section>{" "}
            <section className="space-y-4">
              {" "}
              <SectionTitle className="text-base font-normal text-white/80 uppercase tracking-wider">
                {" "}
                Links{" "}
              </SectionTitle>{" "}
              <AnimatedText delay={0.3}>
                {" "}
                <ul className="space-y-2 text-white/60">
                  {" "}
                  <li>
                    {" "}
                    <HoverLink
                      href="#"
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      {" "}
                      Example Link{" "}
                    </HoverLink>{" "}
                  </li>{" "}
                </ul>{" "}
              </AnimatedText>{" "}
            </section>{" "}
          </div>{" "}
          <footer className="border-t border-white/10 pt-8 mt-16">
            {" "}
            <AnimatedText delay={0.4}>
              {" "}
              <p className="text-xs text-white/40">
                {" "}
                © {new Date().getFullYear()}{" "}
              </p>{" "}
            </AnimatedText>{" "}
          </footer>{" "}
        </div>{" "}
      </main>{" "}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50">
        {" "}
        <Dock
          items={dockItems}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />{" "}
      </div>{" "}
    </div>
  );
}
