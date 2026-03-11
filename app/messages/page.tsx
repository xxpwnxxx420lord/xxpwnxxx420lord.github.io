import fs from "fs";
import path from "path";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BookOpen, Code2, Rss } from "lucide-react";

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
};

export default function MessagesPage() {
  const articles = getArticles();

  return (
    <div className="min-h-screen bg-[#232323] text-[#f0ede8]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-[#555] hover:text-[#f0ede8] transition-colors mb-8"
          >
            <ArrowLeft size={12} /> back
          </Link>
          <h1 className="text-4xl font-light tracking-tight mb-2">writing</h1>
          <p className="text-[#666] text-sm">guides, devlogs, and whatever else.</p>
        </div>

        {articles.length === 0 ? (
          <div className="border border-[#363636] rounded-xl p-10 text-center">
            <p className="font-mono text-xs text-[#444]">no articles yet.</p>
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
                  className="group flex items-center justify-between p-5 bg-[#2a2a2a] border border-[#363636] rounded-xl hover:border-[#4a4a4a] transition-all duration-200"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span
                      className="flex items-center gap-1 font-mono text-[10px] px-2 py-1 rounded-md border shrink-0"
                      style={{ color, borderColor: color + "44", background: color + "11" }}
                    >
                      {icon}
                      {a.topic}
                    </span>
                    <span className="text-sm text-[#f0ede8] truncate group-hover:text-white transition-colors">
                      {a.title}
                    </span>
                  </div>
                  <ArrowUpRight
                    size={14}
                    className="text-[#444] group-hover:text-[#a78bfa] transition-colors shrink-0 ml-4"
                  />
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-12 border border-dashed border-[#333] rounded-xl p-6">
          <p className="font-mono text-xs text-[#444] mb-2">adding an article</p>
          <p className="text-xs text-[#555] leading-relaxed">
            Create a folder in <code className="text-[#666] bg-[#2c2c2c] px-1 py-0.5 rounded">/messages/your-slug/</code> with four files:
            {" "}<code className="text-[#666] bg-[#2c2c2c] px-1 py-0.5 rounded">title.txt</code>,
            {" "}<code className="text-[#666] bg-[#2c2c2c] px-1 py-0.5 rounded">topic.txt</code>,
            {" "}<code className="text-[#666] bg-[#2c2c2c] px-1 py-0.5 rounded">description.md</code>,
            {" "}<code className="text-[#666] bg-[#2c2c2c] px-1 py-0.5 rounded">image.png</code> (optional).
          </p>
        </div>
      </div>
    </div>
  );
}
