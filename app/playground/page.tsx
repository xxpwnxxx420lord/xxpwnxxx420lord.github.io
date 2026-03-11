"use client";

import dynamic from "next/dynamic";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Play, RotateCcw, Terminal, Code2, Globe, Loader2 } from "lucide-react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

type Lang = "javascript" | "html" | "python";

const DEFAULTS: Record<Lang, string> = {
  javascript: `// JavaScript — console.log outputs below
const greet = (name) => \`hey \${name}!\`;
console.log(greet("syntaxical"));

const nums = [1, 2, 3, 4, 5];
console.log("squares:", nums.map(x => x ** 2));

// Async works too
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

# basic stuff
nums = [1, 2, 3, 4, 5]
squares = [x**2 for x in nums]
print("squares:", squares)

# fibonacci
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
  javascript: <Terminal size={13} />,
  html: <Globe size={13} />,
  python: <Code2 size={13} />,
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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const listenerRef = useRef<((e: MessageEvent) => void) | null>(null);

  // Listen for messages from JS iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e.data?.type) return;
      if (e.data.type === "log") setOutput((o) => [...o, { type: "log", text: e.data.text }]);
      if (e.data.type === "error") setOutput((o) => [...o, { type: "error", text: e.data.text }]);
    };
    listenerRef.current = handler;
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const push = (type: OutputLine["type"], text: string) =>
    setOutput((o) => [...o, { type, text }]);

  const loadPyodide = useCallback(async (): Promise<PyodideInterface> => {
    if (window._pyodide) return window._pyodide;
    setPyStatus("loading");
    push("info", "loading pyodide (~8mb, one-time)...");
    await new Promise<void>((resolve, reject) => {
      const existing = document.querySelector('script[data-pyodide]');
      if (existing) { resolve(); return; }
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
      const _orig = { log: console.log, error: console.error, warn: console.warn };
      const _fmt = (...a) => a.map(x => typeof x === 'object' ? JSON.stringify(x, null, 2) : String(x)).join(' ');
      console.log = (...a) => { parent.postMessage({type:'log',text:_fmt(...a)},'*'); };
      console.error = (...a) => { parent.postMessage({type:'error',text:_fmt(...a)},'*'); };
      console.warn = (...a) => { parent.postMessage({type:'log',text:'[warn] '+_fmt(...a)},'*'); };
      window.onerror = (msg,src,l,c,e) => { parent.postMessage({type:'error',text:e?.stack||msg},'*'); return true; };
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
      py.runPython(`
import sys, io
_buf = io.StringIO()
sys.stdout = _buf
sys.stderr = _buf
`);
      try {
        await py.runPythonAsync(src);
        const out = py.runPython("_buf.getvalue()") as string;
        if (out.trim()) out.trim().split("\n").forEach((l) => push("log", l));
        else push("info", "(no output)");
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        push("error", msg);
      } finally {
        py.runPython("sys.stdout = sys.__stdout__; sys.stderr = sys.__stderr__");
      }
    } catch (e: unknown) {
      push("error", (e instanceof Error ? e.message : String(e)));
    }
  }, [loadPyodide]);

  const run = useCallback(async () => {
    setRunning(true);
    const src = code[lang];
    if (lang !== "html") setOutput([]);
    else setOutput([]);

    if (lang === "javascript") { runJS(src); setTimeout(() => setRunning(false), 600); }
    else if (lang === "html") { runHTML(src); setRunning(false); }
    else { await runPython(src); setRunning(false); }
  }, [lang, code, runJS, runHTML, runPython]);

  // Ctrl/Cmd+Enter to run
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); run(); }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [run]);

  const isHTML = lang === "html";

  return (
    <div className="min-h-screen bg-[#181818] text-[#f0ede8] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 h-12 border-b border-[#2a2a2a] shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-1.5 font-mono text-xs text-[#555] hover:text-[#f0ede8] transition-colors">
            <ArrowLeft size={12} /> back
          </Link>
          <div className="w-px h-4 bg-[#2a2a2a]" />
          <span className="font-mono text-xs text-[#a78bfa]">playground</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Language tabs */}
          {(["javascript", "html", "python"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded font-mono text-xs transition-all cursor-pointer ${
                lang === l
                  ? "bg-[#a78bfa]/20 text-[#a78bfa] border border-[#a78bfa]/40"
                  : "text-[#555] hover:text-[#888] border border-transparent"
              }`}
            >
              {LANG_ICONS[l]} {LANG_LABELS[l]}
              {l === "python" && pyStatus === "loading" && <Loader2 size={11} className="animate-spin" />}
              {l === "python" && pyStatus === "ready" && <span className="w-1.5 h-1.5 rounded-full bg-[#4caf7d]" />}
            </button>
          ))}
          <div className="w-px h-4 bg-[#2a2a2a]" />
          <button
            onClick={() => setCode((c) => ({ ...c, [lang]: DEFAULTS[lang] }))}
            className="flex items-center gap-1.5 px-3 py-1 rounded font-mono text-xs text-[#555] hover:text-[#888] transition-colors cursor-pointer"
            title="Reset to default"
          >
            <RotateCcw size={11} />
          </button>
          <button
            onClick={run}
            disabled={running}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-[#a78bfa] text-[#1a1a1a] font-mono text-xs font-semibold hover:bg-[#c4b5fd] transition-colors cursor-pointer disabled:opacity-50"
          >
            {running ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
            run
            <span className="text-[#1a1a1a]/50 ml-1">⌘↵</span>
          </button>
        </div>
      </header>

      {/* Editor + Output */}
      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 48px)" }}>
        {/* Editor */}
        <div className="flex-1 overflow-hidden border-r border-[#2a2a2a]">
          <MonacoEditor
            height="100%"
            language={MONACO_LANG[lang]}
            value={code[lang]}
            onChange={(v) => setCode((c) => ({ ...c, [lang]: v || "" }))}
            theme="vs-dark"
            options={{
              fontSize: 14,
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

        {/* Output / Preview */}
        <div className="w-[420px] flex flex-col bg-[#141414] shrink-0">
          <div className="flex items-center gap-2 px-4 h-9 border-b border-[#2a2a2a] shrink-0">
            <span className="font-mono text-[10px] text-[#444] uppercase tracking-widest">
              {isHTML ? "preview" : "output"}
            </span>
            {!isHTML && output.length > 0 && (
              <button
                onClick={() => setOutput([])}
                className="ml-auto font-mono text-[10px] text-[#444] hover:text-[#888] transition-colors cursor-pointer"
              >
                clear
              </button>
            )}
          </div>

          {/* HTML preview iframe */}
          {isHTML && (
            <iframe
              ref={iframeRef}
              className="flex-1 border-0 bg-white"
              sandbox="allow-scripts allow-same-origin"
              title="preview"
            />
          )}

          {/* JS/Python console */}
          {!isHTML && (
            <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1">
              {/* Hidden iframe for JS execution */}
              <iframe
                ref={iframeRef}
                className="hidden"
                sandbox="allow-scripts"
                title="js-runner"
              />
              {output.length === 0 && (
                <p className="text-[#333]">hit run (⌘↵) to execute</p>
              )}
              {output.map((line, i) => (
                <div
                  key={i}
                  className={`leading-relaxed whitespace-pre-wrap break-all ${
                    line.type === "error"
                      ? "text-red-400"
                      : line.type === "info"
                      ? "text-[#555]"
                      : "text-[#c4b5fd]"
                  }`}
                >
                  {line.type === "error" && <span className="text-red-500 mr-1">✕</span>}
                  {line.type === "info" && <span className="text-[#444] mr-1">›</span>}
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
