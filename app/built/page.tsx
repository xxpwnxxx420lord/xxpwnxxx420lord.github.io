import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

const BUILT = [
  { name: "Dominion",        desc: "Dominion Is a extremely good script with only universal supported but soon there will be more games...",                                       tags: ["LuaU", "Math",],       href: "https://github.com/xxpwnxxx420lord/Dominion" },
  { name: "EXP SELFBOT",        desc: "Discrod self bot for getting xp, and balance in EXP",                                       tags: ["Py",],       href: "https://github.com/random-projects-coz-bored-and-ye/EXP-Selfbot/tree/main" },
  { name: "Lucide.Lua",        desc: "Lucide library (icons) converted from node to lua. (Help)",                                       tags: ["Lua","Lucide","Math"],       href: "https://github.com/xxpwnxxx420lord/Lucide.Lua/tree/main/" },
  { name: "Nutho",        desc: "Discontinued roblox script which is really good (6 games)",                                       tags: ["LuaU", "Math",],       href: "https://github.com/xxpwnxxx420lord/Dominion" },
  { name: "Barnical",        desc: "Overpowered fully (nearly) unblocked website with games like Hollow knight, getting over it, blood money, buckshot, REPO, etc",                                       tags: ["Https","Css","js","php"],       href: "https://Barnical.github.io" },
  { name: "CMD-Xyz",        desc: "Infinite yield but with custom featurse, and rid of bloat",                                       tags: ["LuaU"],       href: "https://github.com/xxpwnxxx420lord/Cmd-XYZ" },
  { name: "Media-Player",        desc: "Cool media player built in electron",                                       tags: ["Javascript","Node","Electron","Html","css"],       href: "https://github.com/random-projects-coz-bored-and-ye/Media-Player" },
  { name: "Image-Fetcher",        desc: "Image fetcher built with Node.js (ai generated readme :sob:)",                                       tags: ["Node", "Google", "Axios"],       href: "https://github.com/random-projects-coz-bored-and-ye/NodeJs-ImageScraper" },
  { name: "Websocket bot",        desc: "Discord to roblox websocket bot, so basically if you type 'sudo kill' and its properly configed and connected it will kill your player!",                                       tags: ["Node", "Python","Luau","Websocket"],       href: "https://github.com/random-projects-coz-bored-and-ye/Websocket-Discord-bot/tree/main" },
  { name: "Wuno",        desc: "Shit old script i made in 2025 (Was obfuscated, But heres the src) ",                                       tags: ["Luau"],       href: "https://github.com/Old-Obfuscated-Scripts/ActualScripts/tree/main/Wuno" },
  { name: "Gearz",        desc: "Shit old script i made in 2025 (Was obfuscated, But heres the src)!",                                       tags: ["Luau"],       href: "https://github.com/Old-Obfuscated-Scripts/ActualScripts/tree/main/Gearz" },
  { name: "Webhook spoof",        desc: "Webhook spoofing I think i made (with emojis)",                                       tags: ["Luau"],       href: "http://github.com/Old-Obfuscated-Scripts/Random-Webhook-stuff/blob/main/webhookspoof" },
  { name: "Next.js notes",        desc: "Some notes when i first was learning next.js with examples (1.0 - 1.4)",                                       tags: ["Node", "Typescript", "Next"],       href: "https://github.com/xxpwnxxx420lord/nextjs-notes?tab=readme-ov-file" },
  { name: "5 letter username noter",        desc: "Spams the Roblox API with requests with random 5 letter combos",                                       tags: ["Python"],       href: "http://github.com/abusingroblox/5-letter-name-sniper" },
  { name: "Random mod",        desc: "dum people playground mod i made",                                       tags: ["C#"],       href: "https://github.com/Tropxzz/Dumb-people-playground-mod-i-coded" },
  { name: "Terror",        desc: "Discontinued open source roblox script",                                       tags: ["Luau"],       href: "https://github.com/Tropxzz/Terror" },
  { name: "Omni-Admin",        desc: "Random open source admin thing",                                       tags: ["Luau"],       href: "https://github.com/Tropxzz/Scripts/blob/main/OmniAdmin.lua" },
  { name: "Grape hub",        desc: "prolly like second or third ever script hub I made (Doesn't run) ",                                       tags: ["Luau"],       href: "http://github.com/Tropxzz/Scripts/blob/main/grape%20hub" },
  { name: "Syn icons",        desc: "Plugin I made that sucks because I made a icon pack (1.6k+) ",                                       tags: ["Luau"],       href: "https://create.roblox.com/store/asset/117868479924873" },
  { name: "Bloxfall",        desc: "Alright game I made until my friend ruined it with free models... ",                                       tags: ["Luau"],       href: "https://www.roblox.com/games/85230707189648/Blockfall" },
  { name: "Recoil",        desc: "Fun gun game (Better with friends) ",                                       tags: ["Luau"],       href: "http://roblox.com/games/112520153651457/RECOIL" },
];

export default function BuiltPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground/50 hover:text-foreground transition-colors mb-8">
            <ArrowLeft size={12} /> back
          </Link>
          <h1 className="text-4xl font-light tracking-tight mb-2">things i&apos;ve built</h1>
          <p className="text-muted-foreground text-sm">a deeper breakdown of what i&apos;ve shipped.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BUILT.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col p-4 bg-card border border-border rounded-xl hover:border-muted/60 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-sm font-medium text-foreground leading-snug flex-1 pr-2">{item.name}</h2>
                <ArrowUpRight size={13} className="text-muted-foreground/30 group-hover:text-primary transition-colors shrink-0 mt-0.5" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">{item.desc}</p>
              <div className="flex flex-wrap gap-1">
                {item.tags.map((t) => (
                  <span key={t} className="font-mono text-[9px] text-muted-foreground/50 border border-border px-1.5 py-0.5 rounded">{t}</span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
