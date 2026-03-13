"use client";

import dynamic from "next/dynamic";
import {
  ArrowUpRight, Github, MessageCircle, Copy, Check,
  Terminal, GitCommit, GitBranch, Clock, Shuffle,
  BookOpen, Wrench, Eye, Code2,
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const LiquidEther = dynamic(() => import("./LiquidEther"), { ssr: false });

// ─── Types ────────────────────────────────────────────────────────────────────

interface Commit {
  sha: string;
  commit: { message: string; author: { name: string; date: string } };
  html_url: string;
}
interface GHEvent {
  type: string; repo: { name: string }; created_at: string;
  payload: { ref?: string; action?: string; ref_type?: string };
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SKILLS = [
  { label: "LuaU",       pct: 75, color: "#a78bfa" },
  { label: "Python",     pct: 37, color: "#60a5fa" },
  { label: "JavaScript", pct: 17, color: "#fbbf24" },
];
const TOOLS = ["Roblox Studio","Three.js","Next.js","Node.js","WebSockets","Git","CSS / HTML","Rojo"];
const PROJECTS = [
  { title: "Framework",                   description: "LuaU GUI Framework.",                                                                        tags: ["LuaU","Roblox","Scripting"],         href: "https://github.com/xxpwnxxx420lord/Scripts/blob/main/framework.lua",          owner: "xxpwnxxx420lord",                   repo: "Scripts",               live: null },
  { title: "Nutho",                        description: "Insanely good Roblox script (Discontinued).",                                               tags: ["LuaU","Roblox","Scripting"],         href: "https://github.com/xxpwnxxx420lord/Nutho",                                    owner: "xxpwnxxx420lord",                   repo: "Nutho",                 live: null },
  { title: "Dominion",                     description: "WIP Roblox script with universal features for FPS/TPS games.",                              tags: ["LuaU","Roblox","Scripting"],         href: "https://github.com/xxpwnxxx420lord/Dominion",                                 owner: "xxpwnxxx420lord",                   repo: "Dominion",              live: null },
  { title: "Cmd-XYZ",                      description: "Infinite Yield but with less features, and more features.",                          tags: ["LuaU","Framework"],                  href: "https://github.com/xxpwnxxx420lord/Cmd-XYZ",                                  owner: "xxpwnxxx420lord",                   repo: "Cmd-XYZ",               live: null },
  { title: "barnical",                     description: "One of the best Unblocked games websites — Hollow Knight, Getting Over It, and more!",      tags: ["HTML","CSS","JavaScript"],           href: "https://github.com/barnical/barnical.github.io",                               owner: "barnical",                          repo: "barnical.github.io",    live: "https://barnical.github.io" },
  { title: "And more...", description: "Check out the built tab",                 tags: [""],       href: "https://www.syntaxical.space/built",   owner: "xxpwnxxx420lord",  repo: "xxpwnxxx420lord.github.io", live: null },

];

const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];

function useEntranceAnim<T extends HTMLElement = HTMLElement>(opts?: { delay?: number; threshold?: number }) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.classList.add("will-animate");
    if (opts?.delay) el.style.transitionDelay = `${opts.delay}ms`;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("in-view"); obs.disconnect(); } },
      { threshold: opts?.threshold ?? 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [opts?.delay, opts?.threshold]);
  return ref;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff/60000), h = Math.floor(m/60), day = Math.floor(h/24);
  if (day) return `${day}d ago`; if (h) return `${h}h ago`; if (m) return `${m}m ago`; return "just now";
}
function eventLabel(e: GHEvent) {
  const r = e.repo.name.split("/")[1];
  switch (e.type) {
    case "PushEvent": return `pushed to ${r}`;
    case "CreateEvent": return `created ${e.payload.ref_type} in ${r}`;
    case "WatchEvent": return `starred ${e.repo.name}`;
    case "ForkEvent": return `forked ${e.repo.name}`;
    case "IssuesEvent": return `${e.payload.action} issue in ${r}`;
    case "PullRequestEvent": return `${e.payload.action} PR in ${r}`;
    default: return `activity in ${r}`;
  }
}

// ─── Easter eggs ─────────────────────────────────────────────────────────────

function MatrixRain({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!; c.width = window.innerWidth; c.height = window.innerHeight;
    const ctx = c.getContext("2d")!;
    const cols = Math.floor(c.width/16); const drops: number[] = Array(cols).fill(1);
    const chars = "アイウエオカキクケコ01ABCDEF";
    let frame = 0; let raf: number;
    const tick = () => {
      ctx.fillStyle = "rgba(35,35,35,0.07)"; ctx.fillRect(0,0,c.width,c.height);
      ctx.fillStyle = "#a78bfa"; ctx.font = "13px monospace";
      drops.forEach((y,i) => {
        ctx.fillText(chars[Math.floor(Math.random()*chars.length)], i*16, y*16);
        if (y*16 > c.height && Math.random()>.975) drops[i]=0; drops[i]++;
      });
      frame++; if (frame<200) { raf = requestAnimationFrame(tick); } else onDone();
    };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [onDone]);
  return <canvas ref={ref} className="fixed inset-0 z-[200] pointer-events-none" />;
}

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="fixed bottom-8 left-1/2 z-[150] px-5 py-3 bg-popover border border-primary/30 rounded-xl font-mono text-xs text-primary shadow-2xl animate-slide-up whitespace-nowrap">
      {msg}
    </div>
  );
}

// ─── Modals ───────────────────────────────────────────────────────────────────

function CommitModal({ owner, repo, title, open, onOpenChange }: {
  owner: string; repo: string; title: string; open: boolean; onOpenChange: (v: boolean) => void;
}) {
  const [commits, setCommits] = useState<Commit[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!open) return; setLoading(true);
    fetch(`/api/commits/${owner}/${repo}`).then(r=>r.json()).then(d=>{setCommits(Array.isArray(d)?d:[]); setLoading(false);}).catch(()=>setLoading(false));
  }, [owner, repo, open]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[70vh] flex flex-col p-0">
        <DialogHeader>
          <DialogTitle><GitBranch size={14} className="text-primary"/>{title}<span className="text-muted-foreground font-normal">/ commits</span></DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto flex-1">
          {loading ? <div className="p-6 space-y-3">{[1,2,3].map(i=><div key={i} className="h-12 bg-muted rounded-lg animate-pulse"/>)}</div>
          : commits.length===0 ? <div className="p-10 text-center font-mono text-xs text-muted-foreground">no commits found</div>
          : <div className="divide-y divide-border">{commits.map(c=>(
            <a key={c.sha} href={c.html_url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 px-6 py-4 hover:bg-accent/30 transition-colors group">
              <GitCommit size={13} className="text-muted-foreground/30 mt-0.5 shrink-0 group-hover:text-primary transition-colors"/>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-foreground leading-relaxed truncate">{c.commit.message.split("\n")[0]}</p>
                <div className="flex items-center gap-2 mt-1"><span className="font-mono text-[10px] text-muted-foreground">{c.sha.slice(0,7)}</span><span className="text-border">·</span><Clock size={10} className="text-muted-foreground/30"/><span className="font-mono text-[10px] text-muted-foreground">{timeAgo(c.commit.author.date)}</span></div>
              </div>
              <ArrowUpRight size={12} className="text-muted-foreground/20 group-hover:text-primary transition-colors shrink-0 mt-1"/>
            </a>
          ))}</div>}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RandomModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [project] = useState(() => PROJECTS[Math.floor(Math.random()*PROJECTS.length)]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle><Shuffle size={13} className="text-primary"/>random pick</DialogTitle></DialogHeader>
        <div className="px-6 py-5">
          <h2 className="text-xl font-light text-foreground mb-2">{project.title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{project.description}</p>
          <div className="flex flex-wrap gap-1.5 mb-6">{project.tags.map(t=><Badge key={t}>{t}</Badge>)}</div>
          <div className="flex items-center gap-2">
            <Button asChild><a href={project.href} target="_blank" rel="noopener noreferrer"><Github size={13}/> view repo</a></Button>
            <Button variant="outline" onClick={()=>onOpenChange(false)}>dismiss</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function KonamiModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs text-center">
        <div className="px-6 py-8"><div className="text-5xl mb-4">🎮</div>
          <h2 className="font-mono text-primary text-base mb-3">konami code unlocked</h2>
          <p className="text-muted-foreground text-xs leading-relaxed mb-6">you actually knew that. respect.<br/>there is no reward, this is just funny.</p>
          <Button variant="ghost" size="sm" onClick={()=>onOpenChange(false)}>ok cool</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Components ───────────────────────────────────────────────────────────────

function SectionHeader({ label, children }: { label: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-7">
      <span className="font-mono text-[11px] text-primary tracking-widest uppercase">{label}</span>
      <Separator className="flex-1"/>
      {children}
    </div>
  );
}

function SkillBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setAnimated(true); obs.disconnect(); } }, { threshold: 0.3 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="flex items-center gap-3">
      <span className="font-mono text-xs text-foreground w-24 shrink-0">{label}</span>
      <div className="flex-1 h-[3px] bg-muted rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: animated ? `${pct}%` : "0%", backgroundColor: color }}/>
      </div>
      <span className="font-mono text-xs text-muted-foreground w-8 text-right">{pct}%</span>
    </div>
  );
}

function GitHubActivity() {
  const [events, setEvents] = useState<GHEvent[]>([]); const [loading, setLoading] = useState(true);
  const ref = useEntranceAnim<HTMLDivElement>({ delay: 60 });
  useEffect(() => {
    fetch("/api/github-activity").then(r=>r.json()).then(d=>{setEvents(Array.isArray(d)?d.slice(0,8):[]); setLoading(false);}).catch(()=>setLoading(false));
  }, []);
  return (
    <section id="activity" ref={ref}>
      <SectionHeader label="activity">
        <a href="https://github.com/xxpwnxxx420lord" target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">github <ArrowUpRight size={11}/></a>
      </SectionHeader>
      <div className="mb-5 rounded-xl overflow-hidden border border-border bg-card p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://ghchart.rshah.org/a78bfa/xxpwnxxx420lord" alt="GitHub contribution chart" className="w-full opacity-80" style={{imageRendering:"pixelated"}}/>
      </div>
      {loading
        ? <div className="space-y-2">{[1,2,3,4].map(i=><div key={i} className="h-10 bg-muted rounded-lg animate-pulse"/>)}</div>
        : events.length===0
          ? <p className="font-mono text-xs text-muted-foreground text-center py-6">no recent activity</p>
          : <div className="space-y-1">
            {events.map((e,i)=>(
              <div key={i} className="flex items-center justify-between px-4 py-2.5 bg-card border border-border rounded-lg hover:border-muted/60 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0"><GitCommit size={11} className="text-primary shrink-0"/><span className="text-xs text-muted-foreground truncate">{eventLabel(e)}</span></div>
                <span className="font-mono text-[10px] text-muted-foreground/40 shrink-0 ml-3">{timeAgo(e.created_at)}</span>
              </div>
            ))}
          </div>
      }
    </section>
  );
}

function VisitorCount() {
  const [count, setCount] = useState<number|null>(null);
  useEffect(()=>{fetch("/api/visitors").then(r=>r.json()).then(d=>setCount(d.count)).catch(()=>null);},[]);
  if (!count) return null;
  return <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground/25"><Eye size={11}/>{count.toLocaleString()} visits</span>;
}

function DiscordCopyButton() {
  const [copied, setCopied] = useState(false);
  return (
    <Button variant="outline" onClick={()=>{navigator.clipboard.writeText("discord.com/users/1184740148487925851"); setCopied(true); setTimeout(()=>setCopied(false),2000);}}>
      {copied ? <Check size={13} className="text-green-500"/> : <Copy size={13}/>}{copied ? "copied!" : "copy link"}
    </Button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Portfolio() {
  const [commitModal, setCommitModal] = useState<{owner:string;repo:string;title:string}|null>(null);
  const [showRandom, setShowRandom] = useState(false);
  const [showKonami, setShowKonami] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const [toast, setToast] = useState<string|null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [fluidMounted, setFluidMounted] = useState(false);

  const logoClicks = useRef(0);
  const logoTimer = useRef<ReturnType<typeof setTimeout>|null>(null);
  const konamiProgress = useRef(0);
  const typedBuffer = useRef("");

  const quickLinksRef = useEntranceAnim<HTMLDivElement>({ delay: 0 });
  const projectsRef   = useEntranceAnim<HTMLElement>({ delay: 60 });
  const skillsRef     = useEntranceAnim<HTMLElement>({ delay: 60 });
  const rscriptsRef   = useEntranceAnim<HTMLElement>({ delay: 60 });
  const discordRef    = useEntranceAnim<HTMLElement>({ delay: 60 });

  useEffect(() => { const t = setTimeout(()=>setFluidMounted(true), 400); return ()=>clearTimeout(t); }, []);
  useEffect(() => {
    const fn=()=>setScrolled(window.scrollY>10);
    window.addEventListener("scroll",fn,{passive:true}); return ()=>window.removeEventListener("scroll",fn);
  }, []);
  useEffect(() => {
    const fn=(e:KeyboardEvent)=>{
      if (e.key===KONAMI[konamiProgress.current]) { konamiProgress.current++; if(konamiProgress.current===KONAMI.length){konamiProgress.current=0;setShowKonami(true);} } else konamiProgress.current=0;
    };
    window.addEventListener("keydown",fn); return ()=>window.removeEventListener("keydown",fn);
  }, []);
  useEffect(() => {
    const fn=(e:KeyboardEvent)=>{
      if(e.key.length!==1) return;
      typedBuffer.current=(typedBuffer.current+e.key).slice(-8).toLowerCase();
      if(typedBuffer.current.includes("skid")){typedBuffer.current="";setToast("💀 lol u typed skid. at least ur self aware");}
      if(typedBuffer.current.includes("luau")){typedBuffer.current="";setToast("yes luau is a real language. no it's not 'just lua'");}
    };
    window.addEventListener("keydown",fn); return ()=>window.removeEventListener("keydown",fn);
  }, []);

  const handleLogoClick = useCallback(()=>{
    logoClicks.current++;
    if(logoTimer.current) clearTimeout(logoTimer.current);
    logoTimer.current=setTimeout(()=>{logoClicks.current=0;},1200);
    if(logoClicks.current>=5){logoClicks.current=0;setShowMatrix(true);}
  },[]);

  return (
    <TooltipProvider delayDuration={350}>
      <div className="min-h-screen bg-background text-foreground">

        {showMatrix && <MatrixRain onDone={()=>setShowMatrix(false)}/>}
        {toast && <Toast msg={toast} onDone={()=>setToast(null)}/>}

        <RandomModal open={showRandom} onOpenChange={setShowRandom}/>
        <KonamiModal open={showKonami} onOpenChange={setShowKonami}/>
        {commitModal && <CommitModal open={!!commitModal} onOpenChange={v=>{if(!v)setCommitModal(null);}} owner={commitModal.owner} repo={commitModal.repo} title={commitModal.title}/>}

        {/* ── Nav ── */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${scrolled?"bg-background/95 backdrop-blur-xl border-b border-border":""}`}>
          <div className="max-w-5xl mx-auto px-5 h-12 flex items-center gap-4">
            <button onClick={handleLogoClick} className="flex items-center gap-2 cursor-pointer select-none group shrink-0">
              <Terminal size={13} className="text-primary"/>
              <span className="font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">syntaxical</span>
            </button>
            <div className="hidden md:flex items-center gap-0.5 flex-1">
              {["projects","skills","activity","discord"].map(l=>(
                <a key={l} href={`#${l}`} className="px-2.5 py-1 font-mono text-[11px] text-muted-foreground/50 hover:text-muted-foreground rounded transition-colors">{l}</a>
              ))}
              <Link href="/messages" className="px-2.5 py-1 font-mono text-[11px] text-muted-foreground/50 hover:text-muted-foreground rounded transition-colors">writing</Link>
              <Link href="/built"    className="px-2.5 py-1 font-mono text-[11px] text-muted-foreground/50 hover:text-muted-foreground rounded transition-colors">built</Link>
              <Link href="/playground" className="px-2.5 py-1 font-mono text-[11px] text-muted-foreground/50 hover:text-primary rounded transition-colors flex items-center gap-1"><Code2 size={11}/>playground</Link>
            </div>
            <div className="flex items-center gap-2 ml-auto shrink-0">
              <Button variant="outline" size="sm" asChild>
                <a href="https://github.com/xxpwnxxx420lord" target="_blank" rel="noopener noreferrer"><Github size={12}/> github</a>
              </Button>
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="relative w-full" style={{height:"100vh",minHeight:520}}>
          <div className="absolute inset-0 z-0 overflow-hidden">
            {fluidMounted && (
              <LiquidEther colors={["#060212","#1e0764","#4c1d95","#7c3aed","#ddd6fe"]}
                mouseForce={18} cursorSize={60} isViscous viscous={30}
                iterationsViscous={16} iterationsPoisson={16} resolution={0.25}
                isBounce={false} autoDemo autoSpeed={0.2} autoIntensity={2.2}
                takeoverDuration={0.2} autoResumeDelay={1800} autoRampDuration={1.5}
                style={{width:"100%",height:"100%",display:"block"}}/>
            )}
          </div>
          <div className="absolute inset-0 z-10 pointer-events-none" style={{background:"linear-gradient(to bottom, rgba(35,35,35,0.15) 0%, transparent 35%, #232323 100%)"}}/>
          <div className="relative z-20 flex flex-col justify-center h-full max-w-3xl mx-auto px-6 pointer-events-none">
            <div className="hero-word flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
              <span className="font-mono text-xs text-muted-foreground">sydney, au · available</span>
            </div>
            <h1 className="hero-word text-6xl font-light tracking-tight mb-3 leading-none">Syntaxical</h1>
            <p className="hero-word text-xl text-muted-foreground font-light mb-4">LuaU, Node, and python 💝</p>
            <p className="hero-word text-muted-foreground text-sm leading-relaxed max-w-md mb-8">
              Hey! I&apos;m Johnny (some may know me as syntaxical) I code cool stuff, mostly for fun. I have over 20+ Projects, and a countless amount of side projects, you can prob find just laying around.
            </p>
            <div className="hero-word flex flex-wrap items-center gap-3 pointer-events-auto">
              <Button asChild><a href="https://github.com/xxpwnxxx420lord" target="_blank" rel="noopener noreferrer"><Github size={14}/> github</a></Button>
              <Button variant="outline" asChild><a href="#discord"><MessageCircle size={14}/> discord</a></Button>
              <Button variant="purple" onClick={()=>setShowRandom(true)}><Shuffle size={14}/> random project</Button>
            </div>
          </div>
        </section>

        {/* ── Main ── */}
        <main className="max-w-3xl mx-auto px-6 pb-24 space-y-20 pt-16">

          {/* Quick links */}
          <div ref={quickLinksRef} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              {href:"/messages", icon:BookOpen, label:"writing",    sub:"guides & devlogs"},
              {href:"/built",    icon:Wrench,   label:"built",      sub:"things i've made"},
              {href:"/playground",icon:Code2,   label:"playground", sub:"js, html, python"},
            ].map(({href,icon:Icon,label,sub},i)=>(
              <Link key={href} href={href}
                className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 group col-span-1"
                style={{transitionDelay:`${i*50}ms`}}>
                <Icon size={15} className="text-primary shrink-0"/>
                <div><p className="text-sm font-medium text-foreground">{label}</p><p className="text-xs text-muted-foreground">{sub}</p></div>
                <ArrowUpRight size={13} className="text-muted-foreground/20 group-hover:text-primary transition-colors ml-auto"/>
              </Link>
            ))}
          </div>

          {/* Projects */}
          <section id="projects" ref={projectsRef}>
            <SectionHeader label="projects">
              <a href="https://github.com/xxpwnxxx420lord" target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">all repos <ArrowUpRight size={11}/></a>
            </SectionHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PROJECTS.map((p,i)=>(
                <Card key={p.title}
                  className="hover:border-muted/50 hover:-translate-y-0.5 transition-all duration-200"
                  style={{transitionDelay:`${i*25}ms`}}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-foreground text-sm leading-snug">{p.title}</h3>
                      <div className="flex items-center gap-1 ml-2 shrink-0">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button onClick={()=>setCommitModal({owner:p.owner,repo:p.repo,title:p.title})} className="p-1 text-muted-foreground/30 hover:text-primary transition-colors cursor-pointer rounded"><GitCommit size={13}/></button>
                          </TooltipTrigger>
                          <TooltipContent>view commits</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a href={p.href} target="_blank" rel="noopener noreferrer" className="p-1 text-muted-foreground/30 hover:text-foreground transition-colors rounded"><Github size={13}/></a>
                          </TooltipTrigger>
                          <TooltipContent>view repo</TooltipContent>
                        </Tooltip>
                        {p.live && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <a href={p.live} target="_blank" rel="noopener noreferrer" className="p-1 text-muted-foreground/30 hover:text-primary transition-colors rounded"><ArrowUpRight size={13}/></a>
                            </TooltipTrigger>
                            <TooltipContent>live site</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">{p.description}</p>
                    <div className="flex flex-wrap gap-1.5">{p.tags.map(t=><Badge key={t}>{t}</Badge>)}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section id="skills" ref={skillsRef}>
            <SectionHeader label="skills"/>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div>
                <p className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-wider mb-5">languages</p>
                <div className="space-y-4">
                  {SKILLS.map(s=><SkillBar key={s.label} {...s}/>)}
                  <p className="font-mono text-[10px] text-muted-foreground/25 mt-1">(estimates)</p>
                </div>
              </div>
              <div>
                <p className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-wider mb-5">tools & tech</p>
                <div className="flex flex-wrap gap-2">
                  {TOOLS.map((t,i)=>(
                    <Badge key={t} className="text-xs px-2.5 py-1 hover:border-primary/40 hover:text-primary transition-colors cursor-default"
                      style={{transitionDelay:`${i*30}ms`}}>{t}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <GitHubActivity/>

          {/* rscripts widget */}
          <section ref={rscriptsRef}>
            <SectionHeader label="rscripts"/>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <a href="https://rscripts.net/user/syntaxical" target="_blank" rel="noopener noreferrer"
                className="hover:opacity-90 transition-opacity rounded-xl overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="syntaxical on Rscripts"
                  loading="lazy"
                  width="360"
                  height="132"
                  src="https://rscripts.net/api/embed/user/syntaxical?theme=dark"
                  className="rounded-xl"
                />
              </a>
              <div>
                <p className="text-sm font-medium text-foreground mb-1">find my scripts on rscripts</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">Roblox scripts, exploits, and whatever else I&apos;ve published. Check the profile for the latest stuff.</p>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://rscripts.net/user/syntaxical" target="_blank" rel="noopener noreferrer">
                    view profile <ArrowUpRight size={12}/>
                  </a>
                </Button>
              </div>
            </div>
          </section>

          {/* Discord */}
          <section id="discord" ref={discordRef}>
            <SectionHeader label="discord"/>
            <Card>
              <CardContent className="p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2"><MessageCircle size={14} className="text-primary"/><span className="font-medium text-foreground text-sm">hit me up on discord</span></div>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">best way to reach me. dm if you want to collab, have a project, or just want to chat.</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <DiscordCopyButton/>
                  <Button variant="discord" asChild>
                    <a href="https://discord.com/users/1184740148487925851" target="_blank" rel="noopener noreferrer"><ArrowUpRight size={13}/> open</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

        </main>

        <footer className="border-t border-border px-6 py-5">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <span className="font-mono text-xs text-muted-foreground/20">syntaxical © {new Date().getFullYear()}</span>
            <VisitorCount/>
            <span className="font-mono text-xs text-muted-foreground/20">sydney, au</span>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}
