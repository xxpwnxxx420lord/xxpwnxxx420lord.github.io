import fs from "fs";
import path from "path";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Rss, BookOpen, Code2, Zap, Tag } from "lucide-react";

interface Article {
  slug: string;
  title: string;
  topic: string;
  excerpt: string;
}

function getArticles(): Article[] {
  const dir = path.join(process.cwd(), "messages");
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => {
      const slug = d.name;
      const base = path.join(dir, slug);
      const title = fs.existsSync(path.join(base, "title.txt"))
        ? fs.readFileSync(path.join(base, "title.txt"), "utf-8").trim() : slug;
      const topic = fs.existsSync(path.join(base, "topic.txt"))
        ? fs.readFileSync(path.join(base, "topic.txt"), "utf-8").trim() : "misc";
      // Pull a short excerpt from description.md
      const md = fs.existsSync(path.join(base, "description.md"))
        ? fs.readFileSync(path.join(base, "description.md"), "utf-8") : "";
      const plain = md.replace(/#{1,6}\s/g,"").replace(/[*_`>\[\]]/g,"").replace(/\s+/g," ").trim();
      const excerpt = plain.length > 120 ? plain.slice(0, 120).trimEnd() + "…" : plain;
      return { slug, title, topic, excerpt };
    });
}

const TOPIC_META: Record<string, { color: string; bg: string; border: string; icon: React.ReactNode; label: string }> = {
  devlog:  { color: "#a78bfa", bg: "#a78bfa11", border: "#a78bfa33", icon: <Rss size={10}/>,      label: "devlog"  },
  guide:   { color: "#60a5fa", bg: "#60a5fa11", border: "#60a5fa33", icon: <BookOpen size={10}/>, label: "guide"   },
  misc:    { color: "#888",    bg: "#88888811", border: "#88888833", icon: <Code2 size={10}/>,    label: "misc"    },
  update:  { color: "#fbbf24", bg: "#fbbf2411", border: "#fbbf2433", icon: <Zap size={10}/>,      label: "update"  },
  release: { color: "#4caf7d", bg: "#4caf7d11", border: "#4caf7d33", icon: <Tag size={10}/>,      label: "release" },
};

export default function WritingPage() {
  const articles = getArticles();

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Header */}
      <div className="max-w-2xl mx-auto px-6 pt-16 pb-12">
        <Link href="/" className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground/50 hover:text-foreground transition-colors mb-12">
          <ArrowLeft size={12}/> back
        </Link>

        <div className="mb-2">
          <span className="font-mono text-[10px] text-primary tracking-widest uppercase">writing</span>
        </div>
        <h1 className="text-4xl font-light tracking-tight mb-3">
          guides, devlogs,<br/>and whatever else.
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
          stuff I figured out the hard way. code, architecture, random things worth writing down.
        </p>
      </div>

      {/* Articles */}
      <div className="max-w-2xl mx-auto px-6 pb-24">
        {articles.length === 0 ? (
          <div className="border border-dashed border-border rounded-2xl p-16 text-center">
            <p className="font-mono text-xs text-muted-foreground/30">nothing here yet.</p>
          </div>
        ) : (
          <div className="space-y-px">
            {articles.map((a, i) => {
              const meta = TOPIC_META[a.topic] ?? TOPIC_META.misc;
              return (
                <Link
                  key={a.slug}
                  href={`/messages/${a.slug}`}
                  className="group flex items-start gap-5 py-6 border-b border-border/50 hover:border-border transition-colors duration-200"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {/* Index number */}
                  <span className="font-mono text-xs text-muted-foreground/20 w-5 shrink-0 pt-0.5 select-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="inline-flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 rounded border"
                        style={{ color: meta.color, background: meta.bg, borderColor: meta.border }}
                      >
                        {meta.icon} {meta.label}
                      </span>
                    </div>
                    <h2 className="text-base font-medium text-foreground group-hover:text-primary transition-colors mb-1.5 leading-snug">
                      {a.title}
                    </h2>
                    {a.excerpt && (
                      <p className="text-xs text-muted-foreground/60 leading-relaxed line-clamp-2">
                        {a.excerpt}
                      </p>
                    )}
                  </div>

                  {/* Arrow */}
                  <ArrowUpRight
                    size={15}
                    className="text-muted-foreground/20 group-hover:text-primary transition-colors shrink-0 mt-1"
                  />
                </Link>
              );
            })}
          </div>
        )}

        {/* How to add */}
        <div className="mt-16 p-5 bg-card border border-dashed border-border/60 rounded-xl">
          <p className="font-mono text-[10px] text-muted-foreground/40 uppercase tracking-wider mb-3">adding a post</p>
          <p className="text-xs text-muted-foreground/50 leading-relaxed">
            Drop a folder in{" "}
            <code className="text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono">/messages/your-slug/</code>
            {" "}with{" "}
            <code className="text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono">title.txt</code>,{" "}
            <code className="text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono">topic.txt</code>,{" "}
            <code className="text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono">description.md</code>, and optionally{" "}
            <code className="text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono">image.png</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
