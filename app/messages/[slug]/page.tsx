import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface Props {
  params: { slug: string };
}

function getArticle(slug: string) {
  const base = path.join(process.cwd(), "messages", slug);
  if (!fs.existsSync(base)) return null;

  const title = fs.existsSync(path.join(base, "title.txt"))
    ? fs.readFileSync(path.join(base, "title.txt"), "utf-8").trim()
    : slug;
  const topic = fs.existsSync(path.join(base, "topic.txt"))
    ? fs.readFileSync(path.join(base, "topic.txt"), "utf-8").trim()
    : "misc";
  const description = fs.existsSync(path.join(base, "description.md"))
    ? fs.readFileSync(path.join(base, "description.md"), "utf-8")
    : "_No content._";
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
    <div className="min-h-screen bg-[#232323] text-[#f0ede8]">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Link
          href="/messages"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-[#555] hover:text-[#f0ede8] transition-colors mb-10"
        >
          <ArrowLeft size={12} /> all articles
        </Link>

        <div className="mb-8">
          <span
            className="font-mono text-[10px] px-2 py-1 rounded-md border mb-4 inline-block"
            style={{ color, borderColor: color + "44", background: color + "11" }}
          >
            {article.topic}
          </span>
          <h1 className="text-3xl font-light tracking-tight leading-snug mt-3">
            {article.title}
          </h1>
        </div>

        {article.hasImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/messages/${article.slug}/image.png`}
            alt={article.title}
            className="w-full rounded-xl mb-8 border border-[#363636] object-cover max-h-64"
          />
        )}

        <article className="
          prose prose-invert prose-sm max-w-none
          prose-headings:font-light prose-headings:tracking-tight prose-headings:text-[#f0ede8] prose-headings:mb-3 prose-headings:mt-8
          prose-h1:text-2xl prose-h1:border-b prose-h1:border-[#2e2e2e] prose-h1:pb-3
          prose-h2:text-lg prose-h2:text-[#d4d0cc]
          prose-h3:text-base prose-h3:text-[#b0aba4]
          prose-p:text-[#aaa] prose-p:leading-relaxed prose-p:my-4
          prose-a:text-[#a78bfa] prose-a:no-underline hover:prose-a:underline
          prose-strong:text-[#f0ede8] prose-strong:font-semibold
          prose-em:text-[#ccc] prose-em:italic
          prose-code:text-[#e2c882] prose-code:bg-[#1e1e1e] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono prose-code:before:content-none prose-code:after:content-none prose-code:border prose-code:border-[#363636]
          prose-pre:bg-[#1a1a1a] prose-pre:border prose-pre:border-[#363636] prose-pre:rounded-xl prose-pre:text-xs prose-pre:p-5
          prose-pre:code:bg-transparent prose-pre:code:border-0 prose-pre:code:p-0 prose-pre:code:text-[#e2c882]
          prose-ul:text-[#aaa] prose-ul:my-4 prose-li:my-1.5
          prose-ol:text-[#aaa] prose-ol:my-4
          prose-hr:border-[#363636] prose-hr:my-8
          prose-blockquote:border-l-[#a78bfa] prose-blockquote:text-[#888] prose-blockquote:not-italic
          prose-table:text-xs prose-thead:border-[#363636] prose-tr:border-[#2e2e2e]
          prose-th:text-[#888] prose-th:font-mono prose-th:font-normal
          prose-td:text-[#aaa]
          [&_img]:rounded-lg [&_img]:border [&_img]:border-[#363636]
          [&_span]:leading-relaxed
        ">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {article.description}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const messagesDir = path.join(process.cwd(), "messages");
  if (!fs.existsSync(messagesDir)) return [];
  return fs
    .readdirSync(messagesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => ({ slug: d.name }));
}
