"use client";

import dynamic from "next/dynamic";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Play, RotateCcw, Terminal, Code2, Globe, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

type Lang = "javascript" | "html" | "python";

const DEFAULTS: Record<Lang, string> = {
  javascript: `// JavaScript — console.log outputs below
const greet = (name) => \`hey \${name}!\`;
console.log(greet("syntaxical"));

const nums = [1, 2, 3, 4, 5];
console.log("squares:", nums.map(x => x ** 2));

setTimeout(() => console.log("...delayed log"), 500);`,

  html: `<!DOCTYPE html>
<html>
<head>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', sans-serif;
      background: #1a1a1a;
      color: #f0ede8;
      padding: 2rem;
    }
    h1 { color: #a78bfa; margin-bottom: 1rem; }
    .card {
      background: #2a2a2a;
      border: 1px solid #363636;
      border-radius: 12px;
      padding: 1.5rem;
      margin-top: 1rem;
    }
    button {
      background: #a78bfa;
      color: #1a1a1a;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
      margin-top: 1rem;
    }
    button:hover { background: #c4b5fd; }
  </style>
</head>
<body>
  <h1>HTML + CSS Playground</h1>
  <p>Edit the code and hit Run ↑</p>
  <div class="card">
    <p>Cards, buttons, whatever you want.</p>
    <button onclick="this.textContent = 'clicked!'">click me</button>
  </div>
</body>
</html>`,

  python: `# Python — powered by Pyodide (first run loads ~8MB)
print("hey from python!")

nums = [1, 2, 3, 4, 5]
squares = [x**2 for x in nums]
print("squares:", squares)

def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

for i in range(8):
    print(f"fib({i}) = {fib(i)}")`,
};

const LANG_LABELS: Record<Lang, string> = {
  javascript: "JavaScript",
  html: "HTML + CSS",
  python: "Python",
};

const LANG_ICONS: Record<Lang, React.ReactNode> = {
  javascript: <Terminal size={12} />,
  html: <Globe size={12} />,
  python: <Code2 size={12} />,
};

const MONACO_LANG: Record<Lang, string> = {
  javascript: "javascript",
  html: "html",
  python: "python",
};

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideInterface>;
    _pyodide?: PyodideInterface;
  }
}
interface PyodideInterface {
  runPython: (code: string) => unknown;
  runPythonAsync: (code: string) => Promise<unknown>;
}

type OutputLine = { type: "log" | "error" | "info"; text: string };

export default function Playground() {
  const [lang, setLang] = useState<Lang>("javascript");
  const [code, setCode] = useState<Record<Lang, string>>(DEFAULTS);
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [running, setRunning] = useState(false);
  const [pyStatus, setPyStatus] = useState<"idle" | "loading" | "ready">("idle");
  const [scrolled, setScrolled] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e.data?.type) return;
      if (e.data.type === "log") setOutput(o => [...o, { type: "log", text: e.data.text }]);
      if (e.data.type === "error") setOutput(o => [...o, { type: "error", text: e.data.text }]);
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const push = (type: OutputLine["type"], text: string) => setOutput(o => [...o, { type, text }]);

  const loadPyodide = useCallback(async (): Promise<PyodideInterface> => {
    if (window._pyodide) return window._pyodide;
    setPyStatus("loading");
    push("info", "loading pyodide (~8mb, one-time)...");
    await new Promise<void>((resolve, reject) => {
      if (document.querySelector('script[data-pyodide]')) { resolve(); return; }
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js";
      s.setAttribute("data-pyodide", "true");
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("failed to load pyodide"));
      document.head.appendChild(s);
    });
    const py = await window.loadPyodide!({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/" });
    window._pyodide = py;
    setPyStatus("ready");
    push("info", "pyodide ready.");
    return py;
  }, []);

  const runJS = useCallback((src: string) => {
    const iframe = iframeRef.current!;
    const html = `<!DOCTYPE html><html><body><script>
      const _fmt = (...a) => a.map(x => typeof x === 'object' ? JSON.stringify(x, null, 2) : String(x)).join(' ');
      console.log = (...a) => { parent.postMessage({type:'log',text:_fmt(...a)},'*'); };
      console.error = (...a) => { parent.postMessage({type:'error',text:_fmt(...a)},'*'); };
      console.warn = (...a) => { parent.postMessage({type:'log',text:'[warn] '+_fmt(...a)},'*'); };
      window.onerror = (msg,_s,_l,_c,e) => { parent.postMessage({type:'error',text:e?.stack||msg},'*'); return true; };
      try { ${src} } catch(e) { parent.postMessage({type:'error',text:e.stack||e.message},'*'); }
    <\/script></body></html>`;
    iframe.srcdoc = html;
  }, []);

  const runHTML = useCallback((src: string) => {
    const iframe = iframeRef.current!;
    iframe.srcdoc = src;
    push("info", "rendered in preview →");
  }, []);

  const runPython = useCallback(async (src: string) => {
    try {
      const py = await loadPyodide();
      py.runPython(`import sys, io\n_buf = io.StringIO()\nsys.stdout = _buf\nsys.stderr = _buf`);
      try {
        await py.runPythonAsync(src);
        const out = py.runPython("_buf.getvalue()") as string;
        if (out.trim()) out.trim().split("\n").forEach(l => push("log", l));
        else push("info", "(no output)");
      } catch (e: unknown) {
        push("error", e instanceof Error ? e.message : String(e));
      } finally {
        py.runPython("sys.stdout = sys.__stdout__; sys.stderr = sys.__stderr__");
      }
    } catch (e: unknown) {
      push("error", e instanceof Error ? e.message : String(e));
    }
  }, [loadPyodide]);

  const run = useCallback(async () => {
    setRunning(true);
    setOutput([]);
    const src = code[lang];
    if (lang === "javascript") { runJS(src); setTimeout(() => setRunning(false), 600); }
    else if (lang === "html") { runHTML(src); setRunning(false); }
    else { await runPython(src); setRunning(false); }
  }, [lang, code, runJS, runHTML, runPython]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); run(); } };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [run]);

  const isHTML = lang === "html";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">

      {/* ── Nav — matches main page ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${scrolled ? "bg-background/95 backdrop-blur-xl border-b border-border" : "border-b border-border"}`}>
        <div className="max-w-5xl mx-auto px-5 h-12 flex items-center gap-4">
          <div className="flex items-center gap-4 shrink-0">
            <Link href="/" className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground/50 hover:text-foreground transition-colors">
              <ArrowLeft size={12} /> back
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1.5">
              <Terminal size={13} className="text-primary" />
              <span className="font-mono text-xs text-muted-foreground">playground</span>
            </div>
          </div>

          {/* Lang tabs */}
          <div className="flex items-center gap-1 flex-1">
            {(["javascript", "html", "python"] as Lang[]).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-[11px] transition-all cursor-pointer ${
                  lang === l
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "text-muted-foreground/50 hover:text-muted-foreground border border-transparent"
                }`}
              >
                {LANG_ICONS[l]} {LANG_LABELS[l]}
                {l === "python" && pyStatus === "loading" && <Loader2 size={10} className="animate-spin" />}
                {l === "python" && pyStatus === "ready" && <span className="w-1.5 h-1.5 rounded-full bg-green-500" />}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setCode(c => ({ ...c, [lang]: DEFAULTS[lang] }))}
              className="p-1.5 text-muted-foreground/40 hover:text-muted-foreground transition-colors cursor-pointer rounded"
              title="Reset"
            >
              <RotateCcw size={13} />
            </button>
            <Button size="sm" onClick={run} disabled={running}>
              {running ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
              run
              <span className="text-[10px] opacity-40 ml-1">⌘↵</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Editor + Output ── */}
      <div className="flex flex-1 overflow-hidden pt-12" style={{ height: "100vh" }}>
        {/* Editor */}
        <div className="flex-1 overflow-hidden border-r border-border">
          <MonacoEditor
            height="100%"
            language={MONACO_LANG[lang]}
            value={code[lang]}
            onChange={v => setCode(c => ({ ...c, [lang]: v || "" }))}
            theme="vs-dark"
            options={{
              fontSize: 13,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: "on",
              renderLineHighlight: "line",
              padding: { top: 16, bottom: 16 },
              wordWrap: "on",
              tabSize: 2,
              automaticLayout: true,
              cursorBlinking: "smooth",
              smoothScrolling: true,
            }}
          />
        </div>

        {/* Output / Preview panel */}
        <div className="w-[400px] flex flex-col bg-[#141414] shrink-0">
          <div className="flex items-center gap-2 px-4 h-9 border-b border-border shrink-0">
            <span className="font-mono text-[10px] text-muted-foreground/30 uppercase tracking-widest">
              {isHTML ? "preview" : "output"}
            </span>
            {!isHTML && output.length > 0 && (
              <button onClick={() => setOutput([])} className="ml-auto font-mono text-[10px] text-muted-foreground/30 hover:text-muted-foreground transition-colors cursor-pointer">
                clear
              </button>
            )}
          </div>

          {isHTML && (
            <iframe ref={iframeRef} className="flex-1 border-0 bg-white" sandbox="allow-scripts allow-same-origin" title="preview" />
          )}

          {!isHTML && (
            <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1">
              <iframe ref={iframeRef} className="hidden" sandbox="allow-scripts" title="js-runner" />
              {output.length === 0 && <p className="text-muted-foreground/20">hit run (⌘↵) to execute</p>}
              {output.map((line, i) => (
                <div key={i} className={`leading-relaxed whitespace-pre-wrap break-all ${
                  line.type === "error" ? "text-red-400" : line.type === "info" ? "text-muted-foreground/30" : "text-[#c4b5fd]"
                }`}>
                  {line.type === "error" && <span className="text-red-500 mr-1">✕</span>}
                  {line.type === "info" && <span className="text-muted-foreground/20 mr-1">›</span>}
                  {line.text}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
