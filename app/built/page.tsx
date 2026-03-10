import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

const BUILT = [
  {
    name: "Dominion (WIP)",
    desc: "A work in progress universal roblox script with countless features being one of the most populated scripts.",
    tags: ["LuaU", "Math"],
    href: "https://github.com/xxpwnxxx420lord/Dominion",
  },
  {
    name: "GUI Framework",
    desc: "Drag-and-drop UI framework for Roblox scripts. Components and theming from scratch.",
    tags: ["LuaU", "UI"],
    href: "https://github.com/xxpwnxxx420lord/Scripts/blob/main/framework.lua",
  },
  {
    name: "Discord↔Roblox Bridge",
    desc: "Real-time bridge between Discord and Roblox via WebSockets. Sub-200ms latency.",
    tags: ["Python", "WebSocket"],
    href: "https://github.com/random-projects-coz-bored-and-ye/Websocket-Discord-bot",
  },
  {
    name: "Cmd-XYZ",
    desc: "Infinite yield fork removing all random commands, and adding gen useful ones, aswell as plugins.",
    tags: ["LuaU", "Framework"],
    href: "https://github.com/xxpwnxxx420lord/Cmd-XYZ",
  },
  {
    name: "Username Sniper",
    desc: "Automated 5-letter Roblox username availability scanner. Logs hits.",
    tags: ["Python", "Automation"],
    href: "https://github.com/abusingroblox/5-letter-name-sniper",
  },
  {
    name: "Nutho",
    desc: "Feature-rich Roblox script with a solid core. Discontinued.",
    tags: ["LuaU", "Roblox"],
    href: "https://github.com/xxpwnxxx420lord/Nutho",
  },
  {
    name: "Icon pack",
    desc: "Simple roblox Icon pack with 1.6k+ icons.",
    tags: ["LuaU", "Assets"],
    href: "https://github.com/xxpwnxxx420lord/Scripts/blob/main/iconpack.lua?raw=true",
  },
  {
    name: "barnical",
    desc: "Unblocked games site. Hollow Knight, Getting Over It, and more!.",
    tags: ["HTML", "CSS"],
    href: "https://barnical.github.io",
  },
  {
    name: "Synicons",
    desc: "A roblox plugin that uses The icon pack above to make a UI library usable in roblox studio .",
    tags: ["LuaU",],
    href: "https://create.roblox.com/store/asset/117868479924873",
  },
  {
    name: "NuthScripts",
    desc: "Roblox script that uses the RScripts API to make a script library thing .",
    tags: ["Luau"],
    href: "https://create.roblox.com/store/asset/117868479924873",
  },
  {
    name: "Shit build a boat for treasure autofarm",
    desc: "Self explainatory .",
    tags: ["Luau"],
    href: "https://github.com/xxpwnxxx420lord/Scripts/blob/main/babft.lua?raw=true",
  },
  {
    name: "Random mod",
    desc: "People playground mod I made in C#.",
    tags: ["Cpp"],
    href: "https://github.com/Tropxzz/Dumb-people-playground-mod-i-coded",
  },
  {
    name: "Gearz",
    desc: "Source code of a old script I made that was orignally obfuscated.",
    tags: ["Luau"],
    href: "https://github.com/Old-Obfuscated-Scripts/ActualScripts/tree/main/Gearz",
  },
  {
    name: "Wuno",
    desc: "Source code of a old script I made that was orignally obfuscated.",
    tags: ["Luau"],
    href: "https://github.com/Old-Obfuscated-Scripts/ActualScripts/tree/main/Wuno",
  },
  {
    name: "Flying module",
    desc: "Some flying module i made (i think).",
    tags: ["Luau"],
    href: "https://github.com/Old-Obfuscated-Scripts/Utilies/blob/main/Flying%20module%20ig",
  },
];

export default function BuiltPage() {
  return (
    <div className="min-h-screen bg-[#232323] text-[#f0ede8]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-[#555] hover:text-[#f0ede8] transition-colors mb-8"
          >
            <ArrowLeft size={12} /> back
          </Link>
          <h1 className="text-4xl font-light tracking-tight mb-2">things i&apos;ve built</h1>
          <p className="text-[#666] text-sm">Feel free to star some of this repos if you like 'em1!</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BUILT.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col p-4 bg-[#2a2a2a] border border-[#363636] rounded-xl hover:border-[#4a4a4a] transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-sm font-medium text-[#f0ede8] leading-snug flex-1 pr-2">{item.name}</h2>
                <ArrowUpRight size={13} className="text-[#444] group-hover:text-[#a78bfa] transition-colors shrink-0 mt-0.5" />
              </div>
              <p className="text-xs text-[#666] leading-relaxed mb-4 flex-1">{item.desc}</p>
              <div className="flex flex-wrap gap-1">
                {item.tags.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[9px] text-[#555] border border-[#333] px-1.5 py-0.5 rounded"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
