"use client";

import dynamic from "next/dynamic";
import { Card, CardBody } from "@heroui/react";
import {
  ArrowUpRight, Github, MessageCircle, Copy, Check,
  Terminal, GitCommit, X, GitBranch, Clock, Shuffle,
  BookOpen, Wrench,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const LiquidEther = dynamic(() => import("./LiquidEther"), { ssr: false });

// ─── Types ────────────────────────────────────────────────────────────────────

interface Commit {
  sha: string;
  commit: {
    message: string;
    author: { name: string; date: string };
  };
  html_url: string;
}

interface GHEvent {
  type: string;
  repo: { name: string };
  created_at: string;
  payload: {
    commits?: { message: string }[];
    ref?: string;
    action?: string;
    ref_type?: string;
  };
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SKILLS = [
  { label: "LuaU", pct: 75, color: "#a78bfa" },
  { label: "Python", pct: 37, color: "#60a5fa" },
  { label: "JavaScript", pct: 17, color: "#fbbf24" },
];

const TOOLS = [
  "Roblox Studio", "Three.js", "Next.js", "Node.js",
  "WebSockets", "Git", "CSS / HTML", "Rojo",
];

const PROJECTS = [
  {
    title: "Framework",
    description: "LuaU GUI Framework.",
    tags: ["LuaU", "Roblox", "Scripting"],
    href: "https://github.com/xxpwnxxx420lord/Scripts/blob/main/framework.lua",
    owner: "xxpwnxxx420lord", repo: "Scripts", live: null,
  },
  {
    title: "Nutho",
    description: "Insanely good Roblox script (Discontinued).",
    tags: ["LuaU", "Roblox", "Scripting"],
    href: "https://github.com/xxpwnxxx420lord/Nutho",
    owner: "xxpwnxxx420lord", repo: "Nutho", live: null,
  },
  {
    title: "Dominion",
    description: "WIP Roblox script with universal features for FPS/TPS games.",
    tags: ["LuaU", "Roblox", "Scripting"],
    href: "https://github.com/xxpwnxxx420lord/Dominion",
    owner: "xxpwnxxx420lord", repo: "Dominion", live: null,
  },
  {
    title: "Cmd-XYZ",
    description: "Command framework built in LuaU. Modular design, easy to extend.",
    tags: ["LuaU", "Framework"],
    href: "https://github.com/xxpwnxxx420lord/Cmd-XYZ",
    owner: "xxpwnxxx420lord", repo: "Cmd-XYZ", live: null,
  },
  {
    title: "Discord ↔ Roblox Controller",
    description: "WebSocket bridge linking Discord bots to Roblox game servers in real-time.",
    tags: ["Python", "WebSocket", "Discord"],
    href: "https://github.com/random-projects-coz-bored-and-ye/Websocket-Discord-bot",
    owner: "random-projects-coz-bored-and-ye", repo: "Websocket-Discord-bot", live: null,
  },
  {
    title: "websocketthing",
    description: "JavaScript WebSocket experiment — lightweight, no deps, raw implementation.",
    tags: ["JavaScript", "WebSocket"],
    href: "https://github.com/xxpwnxxx420lord/websocketthing",
    owner: "xxpwnxxx420lord", repo: "websocketthing", live: null,
  },
  {
    title: "5-Letter Username Sniper",
    description: "Automated Roblox 5-character username availability checker.",
    tags: ["Python", "Roblox", "Automation"],
    href: "https://github.com/abusingroblox/5-letter-name-sniper",
    owner: "abusingroblox", repo: "5-letter-name-sniper", live: null,
  },
  {
    title: "barnical",
    description: "One of the best Unblocked games websites — Hollow Knight, Getting Over It, and more!",
    tags: ["HTML", "CSS", "JavaScript"],
    href: "https://github.com/barnical/barnical.github.io",
    owner: "barnical", repo: "barnical.github.io", live: "https://barnical.github.io",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (days > 0) return `${days}d ago`;
  if (hrs > 0) return `${hrs}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "just now";
}

function eventLabel(e: GHEvent): string {
  switch (e.type) {
    case "PushEvent":
      return `pushed to ${e.repo.name.split("/")[1]}`;
    case "CreateEvent":
      return `created ${e.payload.ref_type} in ${e.repo.name.split("/")[1]}`;
    case "WatchEvent":
      return `starred ${e.repo.name}`;
    case "ForkEvent":
      return `forked ${e.repo.name}`;
    case "IssuesEvent":
      return `${e.payload.action} issue in ${e.repo.name.split("/")[1]}`;
    case "PullRequestEvent":
      return `${e.payload.action} PR in ${e.repo.name.split("/")[1]}`;
    default:
      return `activity in ${e.repo.name.split("/")[1]}`;
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SkillBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs text-[#f0ede8] w-24 shrink-0">{label}</span>
      <div className="flex-1 h-[3px] bg-[#3a3a3a] rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="font-mono text-xs text-[#555] w-8 text-right">{pct}%</span>
    </div>
  );
}

function CopyDiscordButton() {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText("discord.com/users/1184740148487925851");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handle} className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#2c2c2c] border border-[#3a3a3a] hover:border-[#555] text-[#888] hover:text-[#f0ede8] transition-all duration-200 font-mono text-xs cursor-pointer">
      {copied ? <Check size={13} className="text-[#4caf7d]" /> : <Copy size={13} />}
      {copied ? "copied!" : "copy link"}
    </button>
  );
}

// ─── Commit Modal ─────────────────────────────────────────────────────────────

function CommitModal({ owner, repo, title, onClose }: {
  owner: string; repo: string; title: string; onClose: () => void;
}) {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/commits/${owner}/${repo}`)
      .then((r) => r.json())
      .then((d) => { setCommits(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [owner, repo]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-[#1e1e1e] border border-[#3a3a3a] rounded-2xl w-full max-w-lg max-h-[70vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2e2e2e]">
          <div className="flex items-center gap-2">
            <GitBranch size={14} className="text-[#a78bfa]" />
            <span className="font-mono text-sm text-[#f0ede8]">{title}</span>
            <span className="font-mono text-xs text-[#555]">/ commits</span>
          </div>
          <button onClick={onClose} className="text-[#555] hover:text-[#f0ede8] transition-colors cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-[#2a2a2a] rounded-lg animate-pulse" />
              ))}
            </div>
          ) : commits.length === 0 ? (
            <div className="p-10 text-center font-mono text-xs text-[#444]">no commits found</div>
          ) : (
            <div className="divide-y divide-[#2a2a2a]">
              {commits.map((c) => (
                <a
                  key={c.sha}
                  href={c.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 px-6 py-4 hover:bg-[#252525] transition-colors group"
                >
                  <GitCommit size={13} className="text-[#555] mt-0.5 shrink-0 group-hover:text-[#a78bfa] transition-colors" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[#ddd] leading-relaxed truncate">
                      {c.commit.message.split("\n")[0]}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-[10px] text-[#555]">{c.sha.slice(0, 7)}</span>
                      <span className="text-[#3a3a3a]">·</span>
                      <Clock size={10} className="text-[#444]" />
                      <span className="font-mono text-[10px] text-[#555]">
                        {timeAgo(c.commit.author.date)}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight size={12} className="text-[#444] group-hover:text-[#a78bfa] transition-colors shrink-0 mt-1" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── GitHub Activity ──────────────────────────────────────────────────────────

function GitHubActivity() {
  const [events, setEvents] = useState<GHEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/github-activity")
      .then((r) => r.json())
      .then((d) => { setEvents(Array.isArray(d) ? d.slice(0, 8) : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section>
      <div className="flex items-center gap-3 mb-7">
        <span className="font-mono text-xs text-[#a78bfa] tracking-widest uppercase">activity</span>
        <div className="flex-1 h-px bg-[#3a3a3a]" />
        <a
          href="https://github.com/xxpwnxxx420lord"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-[#555] hover:text-[#888] flex items-center gap-1 transition-colors"
        >
          github <ArrowUpRight size={11} />
        </a>
      </div>

      {/* Contribution calendar embed */}
      <div className="mb-5 rounded-xl overflow-hidden border border-[#363636] bg-[#1a1a1a] p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://ghchart.rshah.org/a78bfa/xxpwnxxx420lord"
          alt="GitHub contribution chart"
          className="w-full opacity-80"
          style={{ imageRendering: "pixelated" }}
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1,2,3,4].map((i) => (
            <div key={i} className="h-10 bg-[#2a2a2a] rounded-lg animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <p className="font-mono text-xs text-[#444] text-center py-6">no recent activity</p>
      ) : (
        <div className="space-y-1">
          {events.map((e, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-2.5 bg-[#272727] rounded-lg">
              <div className="flex items-center gap-2.5 min-w-0">
                <GitCommit size={11} className="text-[#a78bfa] shrink-0" />
                <span className="text-xs text-[#888] truncate">{eventLabel(e)}</span>
              </div>
              <span className="font-mono text-[10px] text-[#444] shrink-0 ml-3">{timeAgo(e.created_at)}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Random Project Modal ─────────────────────────────────────────────────────

function RandomProjectModal({ onClose }: { onClose: () => void }) {
  const pick = PROJECTS[Math.floor(Math.random() * PROJECTS.length)];
  const [project] = useState(pick);

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-[#1e1e1e] border border-[#3a3a3a] rounded-2xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Shuffle size={13} className="text-[#a78bfa]" />
            <span className="font-mono text-xs text-[#555]">random pick</span>
          </div>
          <button onClick={onClose} className="text-[#555] hover:text-[#f0ede8] transition-colors cursor-pointer">
            <X size={15} />
          </button>
        </div>

        <h2 className="text-xl font-light text-[#f0ede8] mb-2">{project.title}</h2>
        <p className="text-sm text-[#777] leading-relaxed mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.tags.map((t) => (
            <span key={t} className="font-mono text-[10px] text-[#666] border border-[#363636] px-1.5 py-0.5 rounded">
              {t}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#f0ede8] text-[#232323] font-mono text-xs font-semibold hover:bg-white transition-colors"
          >
            <Github size={13} /> view repo
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-[#3a3a3a] text-[#666] font-mono text-xs hover:border-[#555] hover:text-[#f0ede8] transition-colors cursor-pointer"
          >
            dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Portfolio() {
  const [commitModal, setCommitModal] = useState<{ owner: string; repo: string; title: string } | null>(null);
  const [showRandom, setShowRandom] = useState(false);

  const closeCommit = useCallback(() => setCommitModal(null), []);

  return (
    <div className="min-h-screen bg-[#232323] text-[#f0ede8]">

      {/* ── Modals ── */}
      {showRandom && <RandomProjectModal onClose={() => setShowRandom(false)} />}
      {commitModal && (
        <CommitModal
          owner={commitModal.owner}
          repo={commitModal.repo}
          title={commitModal.title}
          onClose={closeCommit}
        />
      )}

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-[#232323]/70 backdrop-blur-md border-b border-[#3a3a3a]/40">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-[#a78bfa]" />
          <span className="font-mono text-sm">syntaxical</span>
        </div>
        <div className="hidden md:flex items-center gap-6 font-mono text-xs text-[#666]">
          {["projects", "skills", "activity", "discord"].map((l) => (
            <a key={l} href={`#${l}`} className="hover:text-[#f0ede8] transition-colors">{l}</a>
          ))}
          <Link href="/messages" className="hover:text-[#f0ede8] transition-colors">writing</Link>
          <Link href="/built" className="hover:text-[#f0ede8] transition-colors">built</Link>
        </div>
        <a
          href="https://github.com/xxpwnxxx420lord"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#f0ede8] text-[#232323] font-mono text-xs font-semibold hover:bg-white transition-colors"
        >
          <Github size={13} /> github
        </a>
      </nav>

      {/* ── Hero with LiquidEther ── */}
      <section className="relative w-full" style={{ height: "100vh", minHeight: 520 }}>
        <div className="absolute inset-0 z-0 overflow-hidden">
          <LiquidEther
            colors={["#0d0520", "#3b1fa8", "#6d28d9", "#a78bfa", "#1a0a3d"]}
            mouseForce={30}
            cursorSize={120}
            isViscous
            viscous={25}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.4}
            isBounce={false}
            autoDemo
            autoSpeed={0.35}
            autoIntensity={2.8}
            takeoverDuration={0.3}
            autoResumeDelay={2000}
            autoRampDuration={1.0}
            style={{ width: "100%", height: "100%", display: "block" }}
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#232323]/40 via-transparent to-[#232323] pointer-events-none" />

        <div className="relative z-20 flex flex-col justify-center h-full max-w-3xl mx-auto px-6 pointer-events-none">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#4caf7d] animate-pulse" />
            <span className="font-mono text-xs text-[#999]">sydney, au · available</span>
          </div>
          <h1 className="text-6xl font-light tracking-tight mb-3 leading-none">Johnny W</h1>
          <p className="text-xl text-[#bbb] font-light mb-4">
            LuaU, Node, and python 💝
          </p>
          <p className="text-[#777] text-sm leading-relaxed max-w-md mb-8">
            Hey! I'm Johnny (some may know me as syntaxical) I code cool stuff, mostly for fun. I have over 20+ Projects, and a countless amount of side projects, you can prob find just laying around.
          </p>
          <div className="flex items-center gap-3 pointer-events-auto">
            <a
              href="https://github.com/xxpwnxxx420lord"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#f0ede8] text-[#232323] font-mono text-xs font-semibold hover:bg-white transition-colors"
            >
              <Github size={14} /> github
            </a>
            <a
              href="#discord"
              className="flex items-center gap-1.5 px-4 py-2 rounded-md border border-[#4a4a4a] text-[#aaa] font-mono text-xs hover:border-[#777] hover:text-[#f0ede8] transition-colors"
            >
              <MessageCircle size={14} /> discord
            </a>
            <button
              onClick={() => setShowRandom(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md border border-[#4a4a4a] text-[#aaa] font-mono text-xs hover:border-[#a78bfa] hover:text-[#a78bfa] transition-colors cursor-pointer"
            >
              <Shuffle size={14} /> random project
            </button>
          </div>
        </div>
      </section>

      {/* ── Main ── */}
      <main className="max-w-3xl mx-auto px-6 pb-24 space-y-20 pt-16">

        {/* ── Quick links ── */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/messages"
            className="flex items-center gap-3 p-4 bg-[#2a2a2a] border border-[#363636] rounded-xl hover:border-[#a78bfa]/40 transition-colors group"
          >
            <BookOpen size={16} className="text-[#a78bfa]" />
            <div>
              <p className="text-sm font-medium text-[#f0ede8]">writing</p>
              <p className="text-xs text-[#555]">guides & devlogs</p>
            </div>
            <ArrowUpRight size={13} className="text-[#444] group-hover:text-[#a78bfa] transition-colors ml-auto" />
          </Link>
          <Link
            href="/built"
            className="flex items-center gap-3 p-4 bg-[#2a2a2a] border border-[#363636] rounded-xl hover:border-[#a78bfa]/40 transition-colors group"
          >
            <Wrench size={16} className="text-[#a78bfa]" />
            <div>
              <p className="text-sm font-medium text-[#f0ede8]">things i&apos;ve built</p>
              <p className="text-xs text-[#555]">deeper breakdown</p>
            </div>
            <ArrowUpRight size={13} className="text-[#444] group-hover:text-[#a78bfa] transition-colors ml-auto" />
          </Link>
        </div>

        {/* ── Projects ── */}
        <section id="projects">
          <div className="flex items-center gap-3 mb-7">
            <span className="font-mono text-xs text-[#a78bfa] tracking-widest uppercase">projects</span>
            <div className="flex-1 h-px bg-[#3a3a3a]" />
            <a
              href="https://github.com/xxpwnxxx420lord"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-[#555] hover:text-[#888] flex items-center gap-1 transition-colors"
            >
              all repos <ArrowUpRight size={11} />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PROJECTS.map((p) => (
              <Card key={p.title} className="bg-[#2a2a2a] border border-[#363636] rounded-lg shadow-none hover:border-[#4a4a4a] transition-colors duration-200">
                <CardBody className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-[#f0ede8] text-sm leading-snug">{p.title}</h3>
                    <div className="flex items-center gap-2 ml-2 shrink-0">
                      {/* Commits button */}
                      <button
                        onClick={() => setCommitModal({ owner: p.owner, repo: p.repo, title: p.title })}
                        className="text-[#444] hover:text-[#a78bfa] transition-colors cursor-pointer"
                        title="View commits"
                      >
                        <GitCommit size={13} />
                      </button>
                      <a href={p.href} target="_blank" rel="noopener noreferrer" className="text-[#555] hover:text-[#f0ede8] transition-colors">
                        <Github size={13} />
                      </a>
                      {p.live && (
                        <a href={p.live} target="_blank" rel="noopener noreferrer" className="text-[#555] hover:text-[#a78bfa] transition-colors">
                          <ArrowUpRight size={13} />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-[#777] leading-relaxed mb-3">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span key={t} className="font-mono text-[10px] text-[#666] border border-[#363636] px-1.5 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </section>

        {/* ── Skills ── */}
        <section id="skills">
          <div className="flex items-center gap-3 mb-7">
            <span className="font-mono text-xs text-[#a78bfa] tracking-widest uppercase">skills</span>
            <div className="flex-1 h-px bg-[#3a3a3a]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div>
              <p className="font-mono text-[10px] text-[#555] uppercase tracking-wider mb-5">languages</p>
              <div className="space-y-4">
                {SKILLS.map((s) => <SkillBar key={s.label} {...s} />)}
                <p className="font-mono text-[10px] text-[#444] mt-1">(estimates)</p>
              </div>
            </div>
            <div>
              <p className="font-mono text-[10px] text-[#555] uppercase tracking-wider mb-5">tools & tech</p>
              <div className="flex flex-wrap gap-2">
                {TOOLS.map((t) => (
                  <span key={t} className="font-mono text-xs text-[#888] bg-[#2c2c2c] border border-[#363636] px-2.5 py-1 rounded-md">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── GitHub Activity ── */}
        <div id="activity">
          <GitHubActivity />
        </div>

        {/* ── Discord ── */}
        <section id="discord">
          <div className="flex items-center gap-3 mb-7">
            <span className="font-mono text-xs text-[#a78bfa] tracking-widest uppercase">discord</span>
            <div className="flex-1 h-px bg-[#3a3a3a]" />
          </div>
          <div className="bg-[#2a2a2a] border border-[#363636] rounded-xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle size={14} className="text-[#a78bfa]" />
                <span className="font-medium text-[#f0ede8] text-sm">hit me up on discord</span>
              </div>
              <p className="text-xs text-[#666] leading-relaxed max-w-xs">
                best way to reach me. dm if you want to collab, have a project, or just want to chat.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <CopyDiscordButton />
              <a
                href="https://discord.com/users/1184740148487925851"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#5865f2] hover:bg-[#4752c4] text-white font-mono text-xs font-semibold transition-colors"
              >
                <ArrowUpRight size={13} /> open
              </a>
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t border-[#2e2e2e] px-6 py-5">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <span className="font-mono text-xs text-[#3a3a3a]">syntaxical © {new Date().getFullYear()}</span>
          <span className="font-mono text-xs text-[#3a3a3a]">sydney, au</span>
        </div>
      </footer>
    </div>
  );
}
