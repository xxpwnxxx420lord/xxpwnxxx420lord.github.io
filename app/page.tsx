import { useState, useEffect, useRef, useCallback } from "react";

// ─── BLUR TEXT ───
function BlurText({ text, delay = 0, style }) {
  const words = text.split(" ");
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <span ref={ref} style={{ display: "inline", ...style }}>
      {words.map((w, i) => (
        <span key={i} style={{
          display: "inline-block", marginRight: "0.28em",
          opacity: visible ? 1 : 0,
          filter: visible ? "blur(0px)" : "blur(14px)",
          transform: visible ? "translateY(0)" : "translateY(10px)",
          transition: `opacity 0.55s ease ${delay + i * 0.07}s, filter 0.55s ease ${delay + i * 0.07}s, transform 0.45s ease ${delay + i * 0.07}s`,
        }}>{w}</span>
      ))}
    </span>
  );
}

// ─── SCRAMBLE TEXT ───
function ScrambleText({ text, trigger, speed = 38 }) {
  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";
  const [display, setDisplay] = useState(text);
  const frame = useRef(null);
  useEffect(() => {
    if (!trigger) { setDisplay(text); return; }
    let iter = 0;
    clearInterval(frame.current);
    frame.current = setInterval(() => {
      setDisplay(text.split("").map((ch, i) =>
        ch === " " ? " " : i < iter ? text[i] : CHARS[Math.floor(Math.random() * CHARS.length)]
      ).join(""));
      iter += 0.45;
      if (iter >= text.length) clearInterval(frame.current);
    }, speed);
    return () => clearInterval(frame.current);
  }, [trigger, text]);
  return <span>{display}</span>;
}

// ─── PARTICLE CANVAS ───
function ParticleCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;
    const pts = Array.from({ length: 48 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      o: Math.random() * 0.35 + 0.1,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,233,149,${p.o})`; ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      });
      for (let i = 0; i < pts.length; i++)
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 85) {
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(139,233,149,${0.06 * (1 - d / 85)})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      raf = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

// ─── MAGNET ───
function Magnet({ children, strength = 0.3 }) {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${dx * strength}px,${dy * strength}px)`;
  }, [strength]);
  const onLeave = useCallback(() => { if (ref.current) ref.current.style.transform = "translate(0,0)"; }, []);
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ transition: "transform 0.35s cubic-bezier(.23,1,.32,1)", display: "inline-block" }}>
      {children}
    </div>
  );
}

// ─── CLICK SPARK ───
function ClickSpark({ children }) {
  const [sparks, setSparks] = useState([]);
  const click = (e) => {
    const id = Date.now();
    setSparks(s => [...s, { id, x: e.clientX, y: e.clientY }]);
    setTimeout(() => setSparks(s => s.filter(sp => sp.id !== id)), 650);
  };
  return (
    <div onClick={click} style={{ display: "contents" }}>
      {children}
      {sparks.map(sp => (
        <div key={sp.id} style={{ position: "fixed", left: sp.x, top: sp.y, pointerEvents: "none", zIndex: 9999 }}>
          {[...Array(8)].map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return <div key={i} style={{
              position: "absolute", width: 3, height: 3, borderRadius: "50%",
              background: "#8be995", animation: "spark 0.55s ease forwards",
              "--dx": `${Math.cos(a) * 26}px`, "--dy": `${Math.sin(a) * 26}px`,
            }} />;
          })}
        </div>
      ))}
    </div>
  );
}

// ─── CURSOR BLOB ───
function CursorBlob() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const move = (e) => { el.style.transform = `translate(${e.clientX - 140}px,${e.clientY - 140}px)`; };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <div ref={ref} style={{
      position: "fixed", top: 0, left: 0, width: 280, height: 280, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(139,233,149,0.06) 0%, transparent 70%)",
      pointerEvents: "none", zIndex: 0, transition: "transform 0.1s ease",
    }} />
  );
}

// ─── DATA ───
const projects = [
  {
    num: "01",
    title: "Cmd-XYZ",
    tag: "Luau",
    desc: "Roblox command system. Admin tools and script execution.",
    url: "https://github.com/xxpwnxxx420lord/Cmd-XYZ",
    year: "2024",
  },
  {
    num: "02",
    title: "Discord → Roblox",
    tag: "Python + Luau",
    desc: "WebSocket bridge — kick players from a Discord bot.",
    url: "https://github.com/xxpwnxxx420lord/discord-to-roblox-kicking",
    year: "2024",
  },
  {
    num: "03",
    title: "WebSocket Thing",
    tag: "JavaScript",
    desc: "Real-time WebSocket server experiments. 1 star.",
    url: "https://github.com/xxpwnxxx420lord/websocketthing",
    year: "2025",
  },
  {
    num: "04",
    title: "Nutho",
    tag: "Luau",
    desc: "You VS Homer — first Roblox game release. Still in beta.",
    url: "https://github.com/xxpwnxxx420lord/Scripts",
    year: "2025",
  },
  {
    num: "05",
    title: "Mini-Projects",
    tag: "Luau",
    desc: "Collection of Roblox exploit and utility scripts.",
    url: "https://github.com/xxpwnxxx420lord/Scripts",
    year: "2024",
  },
  {
    num: "06",
    title: "barnical",
    tag: "Web",
    desc: "Personal site. Live at barnical.github.io.",
    url: "https://barnical.github.io",
    year: "2025",
  },
];

const skills = [
  { name: "Luau", level: 75 },
  { name: "Python", level: 37 },
  { name: "JavaScript", level: 17 },
];

// ─── APP ───
export default function Portfolio() {
  const [hovered, setHovered] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [scramble, setScramble] = useState({});

  useEffect(() => { setTimeout(() => setLoaded(true), 60); }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #0a0f0b;
          --fg: #e8f0e9;
          --muted: rgba(232,240,233,0.38);
          --accent: #8be995;
          --accent2: rgba(139,233,149,0.15);
          --line: rgba(232,240,233,0.08);
        }
        html, body { background: var(--bg); color: var(--fg); font-family: 'Geist Mono', monospace; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        a { color: inherit; text-decoration: none; }
        ::selection { background: rgba(139,233,149,0.2); }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(139,233,149,0.15); border-radius: 2px; }

        @keyframes spark {
          0%   { opacity:1; transform:translate(0,0) scale(1); }
          100% { opacity:0; transform:translate(var(--dx),var(--dy)) scale(0); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes lineGrow {
          from { transform:scaleX(0); }
          to   { transform:scaleX(1); }
        }
        @keyframes barFill {
          from { width: 0; }
          to   { width: var(--w); }
        }
        .project-row { transition: opacity 0.15s ease; }
        .project-row:hover .row-num { color: var(--accent); }
      `}</style>

      <CursorBlob />

      <div style={{
        maxWidth: 700, margin: "0 auto", padding: "60px 28px 100px",
        position: "relative", zIndex: 1,
        opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.65s ease, transform 0.65s ease",
      }}>

        {/* NAV */}
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 80 }}>
          <Magnet>
            <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, letterSpacing: "-0.01em" }}>
              Johnny W
            </span>
          </Magnet>
          <Magnet>
            <a href="https://github.com/xxpwnxxx420lord" target="_blank" rel="noreferrer"
              style={{
                fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
                color: "var(--accent)", border: "1px solid rgba(139,233,149,0.25)",
                padding: "8px 16px", borderRadius: 2,
                background: "rgba(139,233,149,0.04)",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(139,233,149,0.09)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(139,233,149,0.04)"}
            >
              GitHub ↗
            </a>
          </Magnet>
        </nav>

        {/* HERO */}
        <section style={{ position: "relative", marginBottom: 96, paddingBottom: 72 }}>
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            <ParticleCanvas />
          </div>
          <div style={{ position: "relative" }}>
            <p style={{
              fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase",
              color: "var(--accent)", marginBottom: 26,
              display: "flex", alignItems: "center", gap: 10,
              animation: "fadeUp 0.5s ease 0.1s both",
            }}>
              <span style={{ display: "block", width: 18, height: 1, background: "var(--accent)" }} />
              Syntaxical · Sydney, AU
            </p>

            <h1 style={{
              fontFamily: "'Instrument Serif', serif", fontWeight: 400,
              fontSize: "clamp(44px, 9vw, 70px)", lineHeight: 1.02,
              letterSpacing: "-0.025em", marginBottom: 24,
            }}>
              <BlurText text="I write scripts" delay={0.15} /><br />
              <BlurText text="that" delay={0.3} />{" "}
              <BlurText text="do things." delay={0.42} style={{ fontStyle: "italic", color: "var(--accent)" }} />
            </h1>

            <p style={{
              fontSize: 13, lineHeight: 1.85, color: "var(--muted)",
              maxWidth: 360, marginBottom: 42,
              animation: "fadeUp 0.6s ease 0.65s both",
            }}>
              Luau dev making Roblox tools, Python automation, and whatever else sounds fun.
              25 repos and counting.
            </p>

            <ClickSpark>
              <Magnet strength={0.18}>
                <a href="https://barnical.github.io" target="_blank" rel="noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 10,
                    fontSize: 11, letterSpacing: "0.11em", textTransform: "uppercase",
                    color: "var(--bg)", background: "var(--accent)",
                    padding: "13px 22px", borderRadius: 2,
                    fontWeight: 500,
                    transition: "opacity 0.2s",
                    animation: "fadeUp 0.6s ease 0.85s both",
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  Visit Site →
                </a>
              </Magnet>
            </ClickSpark>
          </div>
        </section>

        {/* PROJECTS HEADER */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)", whiteSpace: "nowrap" }}>
            Projects
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--line)", transformOrigin: "left", animation: "lineGrow 0.9s ease 0.4s both" }} />
        </div>

        {/* PROJECT ROWS */}
        <div style={{ marginBottom: 80 }}>
          {projects.map((p, i) => (
            <ClickSpark key={p.num}>
              <a href={p.url} target="_blank" rel="noreferrer" style={{ display: "block" }}>
                <div
                  className="project-row"
                  onMouseEnter={() => { setHovered(i); setScramble(s => ({ ...s, [i]: true })); }}
                  onMouseLeave={() => { setHovered(null); setScramble(s => ({ ...s, [i]: false })); }}
                  style={{
                    display: "grid", gridTemplateColumns: "26px 1fr auto",
                    alignItems: "start", gap: 18, padding: "24px 0",
                    borderTop: "1px solid var(--line)",
                    borderBottom: i === projects.length - 1 ? "1px solid var(--line)" : "none",
                    opacity: hovered !== null && hovered !== i ? 0.22 : 1,
                    cursor: "pointer",
                  }}
                >
                  <span className="row-num" style={{ fontSize: 10, color: "var(--muted)", paddingTop: 3, transition: "color 0.15s" }}>
                    {p.num}
                  </span>
                  <div>
                    <div style={{
                      fontFamily: "'Instrument Serif', serif", fontWeight: 400, fontSize: 24,
                      letterSpacing: "-0.01em", marginBottom: 5,
                      color: hovered === i ? "var(--accent)" : "var(--fg)",
                      transition: "color 0.15s",
                    }}>
                      <ScrambleText text={p.title} trigger={scramble[i]} />
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>{p.desc}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, paddingTop: 3 }}>
                    <span style={{
                      fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase",
                      color: "var(--accent)", border: "1px solid rgba(139,233,149,0.2)",
                      padding: "3px 8px", borderRadius: 1, whiteSpace: "nowrap",
                    }}>{p.tag}</span>
                    <span style={{ fontSize: 10, color: "var(--muted)" }}>{p.year}</span>
                  </div>
                </div>
              </a>
            </ClickSpark>
          ))}
        </div>

        {/* SKILLS */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)", whiteSpace: "nowrap" }}>
            Stack
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 80 }}>
          {skills.map((s, i) => (
            <SkillBar key={s.name} skill={s} delay={i * 0.12} />
          ))}
        </div>

        {/* FOOTER */}
        <footer style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          fontSize: 11, color: "var(--muted)",
          borderTop: "1px solid var(--line)", paddingTop: 28,
        }}>
          <span>© 2026 Johnny W</span>
          <a href="https://github.com/xxpwnxxx420lord" target="_blank" rel="noreferrer"
            style={{ color: "var(--accent)", transition: "opacity 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.65"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            xxpwnxxx420lord ↗
          </a>
        </footer>
      </div>
    </>
  );
}

// ─── SKILL BAR ───
function SkillBar({ skill, delay }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 11 }}>
        <span style={{ letterSpacing: "0.08em" }}>{skill.name}</span>
        <span style={{ color: "var(--muted)" }}>{skill.level}%</span>
      </div>
      <div style={{ height: 2, background: "var(--line)", borderRadius: 1, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          background: "var(--accent)",
          borderRadius: 1,
          width: visible ? `${skill.level}%` : "0%",
          transition: `width 0.9s cubic-bezier(.23,1,.32,1) ${delay}s`,
        }} />
      </div>
    </div>
  );
}
