import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

interface BuiltItem {
  name: string;
  desc: string;
  tags: string[];
  href: string;
  year?: string;
}

const BUILT: BuiltItem[] = [
  { name: "Aimbot Prediction",        desc: "Velocity-based prediction accounting for ping and bullet travel time. Works without game-specific patching.",                   tags: ["LuaU","Math","Roblox"],          href: "https://github.com/xxpwnxxx420lord/Dominion",                                year: "2024" },
  { name: "GUI Framework",            desc: "Drag-and-drop UI framework for Roblox scripts. Component system, theming, and event hooks built from scratch in LuaU.",        tags: ["LuaU","UI","Framework"],         href: "https://github.com/xxpwnxxx420lord/Scripts/blob/main/framework.lua",          year: "2024" },
  { name: "Discord ↔ Roblox Bridge", desc: "Real-time bridge between Discord bots and Roblox game servers via WebSockets. Sub-200ms latency.",                             tags: ["Python","WebSocket","Discord"],   href: "https://github.com/random-projects-coz-bored-and-ye/Websocket-Discord-bot",   year: "2024" },
  { name: "Cmd-XYZ",                  desc: "Modular admin command framework. Supports aliases, argument parsing, and permission levels.",                                   tags: ["LuaU","Framework","Roblox"],     href: "https://github.com/xxpwnxxx420lord/Cmd-XYZ",                                  year: "2023" },
  { name: "Username Sniper",          desc: "Automated 5-letter Roblox username availability scanner. Logs hits instantly and handles ratelimiting.",                       tags: ["Python","Automation","Roblox"],  href: "https://github.com/abusingroblox/5-letter-name-sniper",                       year: "2023" },
  { name: "Nutho",                    desc: "Feature-rich Roblox script with a solid core architecture. Discontinued — newer work lives in Dominion.",                      tags: ["LuaU","Roblox"],                 href: "https://github.com/xxpwnxxx420lord/Nutho",                                    year: "2023" },
  { name: "Dominion",                 desc: "Universal FPS/TPS script designed to work cross-game without constant patching. Still actively worked on.",                    tags: ["LuaU","FPS","Roblox"],           href: "https://github.com/xxpwnxxx420lord/Dominion",                                 year: "2024" },
  { name: "barnical",                 desc: "Unblocked games site. Hollow Knight, Getting Over It, and more — no trackers, no ads, just games.",                           tags: ["HTML","CSS","JS"],               href: "https://barnical.github.io",                                                  year: "2023" },
];

const TAG_COLORS: Record<string, string> = {
  LuaU:       "#a78bfa",
  Python:     "#60a5fa",
  JavaScript: "#fbbf24",
  JS:         "#fbbf24",
  HTML:       "#fb923c",
  CSS:        "#34d399",
  WebSocket:  "#22d3ee",
  Discord:    "#818cf8",
  Roblox:     "#f87171",
};

export default function BuiltPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-6 pt-16 pb-24">

        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground/50 hover:text-foreground transition-colors mb-12">
          <ArrowLeft size={12}/> back
        </Link>

        {/* Header */}
        <div className="mb-2">
          <span className="font-mono text-[10px] text-primary tracking-widest uppercase">built</span>
        </div>
        <h1 className="text-4xl font-light tracking-tight mb-3">things i&apos;ve shipped.</h1>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mb-14">
          a breakdown of notable stuff. mostly Roblox scripting, some Python, a bit of web.
        </p>

        {/* List */}
        <div className="space-y-px">
          {BUILT.map((item, i) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-5 py-6 border-b border-border/50 hover:border-border transition-colors duration-150"
            >
              {/* Number */}
              <span className="font-mono text-xs text-muted-foreground/20 w-5 shrink-0 pt-0.5 select-none">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Body */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                  <h2 className="text-base font-medium text-foreground group-hover:text-primary transition-colors">
                    {item.name}
                  </h2>
                  {item.year && (
                    <span className="font-mono text-[10px] text-muted-foreground/30">{item.year}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground/60 leading-relaxed mb-3 max-w-md">
                  {item.desc}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map(t => {
                    const color = TAG_COLORS[t] ?? "#888";
                    return (
                      <span
                        key={t}
                        className="font-mono text-[10px] px-1.5 py-0.5 rounded border"
                        style={{ color, background: color + "11", borderColor: color + "33" }}
                      >
                        {t}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Arrow */}
              <ArrowUpRight size={15} className="text-muted-foreground/20 group-hover:text-primary transition-colors shrink-0 mt-0.5"/>
            </a>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-14 font-mono text-[10px] text-muted-foreground/25 text-center">
          {BUILT.length} things · more on{" "}
          <a href="https://github.com/xxpwnxxx420lord" target="_blank" rel="noopener noreferrer" className="hover:text-muted-foreground transition-colors underline underline-offset-2">
            github
          </a>
        </p>
      </div>
    </div>
  );
}
