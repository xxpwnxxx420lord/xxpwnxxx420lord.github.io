import fs from "fs";
import path from "path";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BookOpen, Code2, Rss, Zap, Tag } from "lucide-react";

interface Article {
  slug: string;
  title: string;
  topic: string;
  hasImage: boolean;
}

function getArticles(): Article[] {
  const messagesDir = path.join(process.cwd(), "messages");
  if (!fs.existsSync(messagesDir)) return [];
  return fs
    .readdirSync(messagesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const slug = d.name;
      const base = path.join(messagesDir, slug);
      const title = fs.existsSync(path.join(base, "title.txt"))
        ? fs.readFileSync(path.join(base, "title.txt"), "utf-8").trim()
        : slug;
      const topic = fs.existsSync(path.join(base, "topic.txt"))
        ? fs.readFileSync(path.join(base, "topic.txt"), "utf-8").trim()
        : "misc";
      const hasImage = fs.existsSync(path.join(base, "image.png"));
      return { slug, title, topic, hasImage };
    });
}

const TOPIC_COLORS: Record<string, string> = {
  devlog: "#a78bfa",
  guide: "#60a5fa",
  misc: "#888",
  update: "#fbbf24",
  release: "#4caf7d",
};

const TOPIC_ICONS: Record<string, React.ReactNode> = {
  devlog: <Rss size={11} />,
  guide: <BookOpen size={11} />,
  misc: <Code2 size={11} />,
  update: <Zap size={11} />,
  release: <Tag size={11} />,
};

export default function MessagesPage() {
  const articles = getArticles();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground/50 hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={12} /> back
          </Link>
          <h1 className="text-4xl font-light tracking-tight mb-2">writing</h1>
          <p className="text-muted-foreground text-sm">guides, devlogs, and whatever else.</p>
        </div>

        {articles.length === 0 ? (
          <div className="border border-border rounded-xl p-10 text-center">
            <p className="font-mono text-xs text-muted-foreground/40">no articles yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {articles.map((a) => {
              const color = TOPIC_COLORS[a.topic] || "#888";
              const icon = TOPIC_ICONS[a.topic] || <Code2 size={11} />;
              return (
                <Link
                  key={a.slug}
                  href={`/messages/${a.slug}`}
                  className="group flex items-center justify-between p-5 bg-card border border-border rounded-xl hover:border-muted/60 transition-all duration-200"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span
                      className="flex items-center gap-1 font-mono text-[10px] px-2 py-1 rounded-md border shrink-0"
                      style={{ color, borderColor: color + "44", background: color + "11" }}
                    >
                      {icon}
                      {a.topic}
                    </span>
                    <span className="text-sm text-foreground truncate group-hover:text-primary transition-colors">
                      {a.title}
                    </span>
                  </div>
                  <ArrowUpRight size={14} className="text-muted-foreground/30 group-hover:text-primary transition-colors shrink-0 ml-4" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
