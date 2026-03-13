import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface Props { params: { slug: string } }

function getArticle(slug: string) {
  const base = path.join(process.cwd(), "messages", slug);
  if (!fs.existsSync(base)) return null;
  const title = fs.existsSync(path.join(base, "title.txt")) ? fs.readFileSync(path.join(base, "title.txt"), "utf-8").trim() : slug;
  const topic = fs.existsSync(path.join(base, "topic.txt")) ? fs.readFileSync(path.join(base, "topic.txt"), "utf-8").trim() : "misc";
  const description = fs.existsSync(path.join(base, "description.md")) ? fs.readFileSync(path.join(base, "description.md"), "utf-8") : "_No content._";
  const hasImage = fs.existsSync(path.join(base, "image.png"));
  return { title, topic, description, hasImage, slug };
}

const TOPIC_COLORS: Record<string, string> = {
  devlog: "#a78bfa",
  guide: "#60a5fa",
  misc: "#888",
  update: "#fbbf24",
  release: "#4caf7d",
};

export default function ArticlePage({ params }: Props) {
  const article = getArticle(params.slug);
  if (!article) notFound();
  const color = TOPIC_COLORS[article.topic] || "#888";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Link href="/messages" className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground/50 hover:text-foreground transition-colors mb-10">
          <ArrowLeft size={12} /> all articles
        </Link>

        <div className="mb-8">
          <span
            className="font-mono text-[10px] px-2 py-1 rounded-md border mb-4 inline-flex items-center gap-1"
            style={{ color, borderColor: color + "44", background: color + "11" }}
          >
            {article.topic}
          </span>
          <h1 className="text-3xl font-light tracking-tight leading-snug mt-3">{article.title}</h1>
        </div>

        {article.hasImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api/message-image/${article.slug}`}
            alt={article.title}
            className="w-full rounded-xl mb-8 border border-border object-cover max-h-64"
          />
        )}

        <article className="
          prose max-w-none
          prose-p:text-[#9e9995] prose-p:leading-[1.85] prose-p:my-5 prose-p:text-[0.9rem]
          prose-headings:font-light prose-headings:tracking-tight prose-headings:text-foreground
          prose-h1:text-2xl prose-h1:mt-12 prose-h1:mb-4 prose-h1:pb-3 prose-h1:border-b prose-h1:border-border
          prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-[#d0ccc8]
          prose-h3:text-base prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-[#b0aba4] prose-h3:font-normal
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-strong:text-foreground prose-strong:font-semibold
          prose-em:text-[#ccc8c4]
          prose-code:before:content-none prose-code:after:content-none
          prose-code:text-[#e2c882] prose-code:bg-[#1a1a1a] prose-code:border prose-code:border-[#2e2e2e]
          prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.8em] prose-code:font-mono
          prose-pre:bg-[#141414] prose-pre:border prose-pre:border-[#2a2a2a] prose-pre:rounded-xl prose-pre:p-5 prose-pre:my-6
          [&_pre_code]:bg-transparent [&_pre_code]:border-0 [&_pre_code]:p-0 [&_pre_code]:text-[#c4b5fd] [&_pre_code]:text-[0.82rem]
          prose-ul:my-5 prose-ol:my-5
          prose-li:text-[#9e9995] prose-li:my-2 prose-li:leading-relaxed prose-li:text-[0.9rem]
          prose-li:marker:text-primary/50
          prose-blockquote:border-l-2 prose-blockquote:border-primary/40 prose-blockquote:bg-[#1c1c1c]
          prose-blockquote:rounded-r-lg prose-blockquote:px-5 prose-blockquote:py-3 prose-blockquote:my-6
          prose-blockquote:not-italic prose-blockquote:text-muted-foreground
          prose-hr:border-border prose-hr:my-10
          prose-table:text-sm prose-thead:border-b prose-thead:border-border
          prose-th:text-muted-foreground prose-th:font-mono prose-th:font-normal prose-th:text-[10px] prose-th:uppercase prose-th:tracking-wider prose-th:py-2 prose-th:px-3
          prose-td:text-[#9e9995] prose-td:py-2 prose-td:px-3 prose-tr:border-b prose-tr:border-border/50
          [&_img]:rounded-xl [&_img]:border [&_img]:border-border [&_img]:my-6
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {article.description}
          </ReactMarkdown>
        </article>

        <div className="mt-16 pt-8 border-t border-border/40">
          <Link href="/messages" className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground/40 hover:text-foreground transition-colors">
            <ArrowLeft size={12} /> back to writing
          </Link>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), "messages");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => ({ slug: d.name }));
}
