import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Rss, BookOpen, Code2, Zap, Tag } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface Props { params: { slug: string } }

function getArticle(slug: string) {
  const base = path.join(process.cwd(), "messages", slug);
  if (!fs.existsSync(base)) return null;
  const title = fs.existsSync(path.join(base,"title.txt")) ? fs.readFileSync(path.join(base,"title.txt"),"utf-8").trim() : slug;
  const topic = fs.existsSync(path.join(base,"topic.txt")) ? fs.readFileSync(path.join(base,"topic.txt"),"utf-8").trim() : "misc";
  const description = fs.existsSync(path.join(base,"description.md")) ? fs.readFileSync(path.join(base,"description.md"),"utf-8") : "_No content._";
  const hasImage = fs.existsSync(path.join(base,"image.png"));
  return { title, topic, description, hasImage, slug };
}

const TOPIC_META: Record<string, { color: string; bg: string; border: string; icon: React.ReactNode }> = {
  devlog:  { color:"#a78bfa", bg:"#a78bfa11", border:"#a78bfa33", icon:<Rss size={10}/> },
  guide:   { color:"#60a5fa", bg:"#60a5fa11", border:"#60a5fa33", icon:<BookOpen size={10}/> },
  misc:    { color:"#888",    bg:"#88888811", border:"#88888833", icon:<Code2 size={10}/> },
  update:  { color:"#fbbf24", bg:"#fbbf2411", border:"#fbbf2433", icon:<Zap size={10}/> },
  release: { color:"#4caf7d", bg:"#4caf7d11", border:"#4caf7d33", icon:<Tag size={10}/> },
};

export default function ArticlePage({ params }: Props) {
  const article = getArticle(params.slug);
  if (!article) notFound();
  const meta = TOPIC_META[article.topic] ?? TOPIC_META.misc;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-6 pt-16 pb-24">

        {/* Back */}
        <Link href="/messages" className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground/50 hover:text-foreground transition-colors mb-12">
          <ArrowLeft size={12}/> all writing
        </Link>

        {/* Header */}
        <div className="mb-10">
          <span
            className="inline-flex items-center gap-1.5 font-mono text-[10px] px-2 py-1 rounded-md border mb-5"
            style={{ color: meta.color, background: meta.bg, borderColor: meta.border }}
          >
            {meta.icon} {article.topic}
          </span>
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight leading-tight text-foreground">
            {article.title}
          </h1>
        </div>

        {/* Hero image */}
        {article.hasImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api/message-image/${article.slug}`}
            alt={article.title}
            className="w-full rounded-2xl mb-10 border border-border object-cover max-h-72"
          />
        )}

        {/* Divider */}
        <div className="h-px bg-border mb-10"/>

        {/* Article body */}
        <article className="
          prose max-w-none

          /* Base */
          prose-p:text-[#9e9995] prose-p:leading-[1.85] prose-p:my-5 prose-p:text-[0.9rem]

          /* Headings */
          prose-headings:font-light prose-headings:tracking-tight prose-headings:text-foreground
          prose-h1:text-2xl prose-h1:mt-12 prose-h1:mb-4 prose-h1:pb-3 prose-h1:border-b prose-h1:border-border
          prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-[#d0ccc8]
          prose-h3:text-base prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-[#b0aba4] prose-h3:font-normal

          /* Links */
          prose-a:text-primary prose-a:no-underline prose-a:font-normal
          hover:prose-a:underline hover:prose-a:underline-offset-2

          /* Strong / em */
          prose-strong:text-foreground prose-strong:font-semibold
          prose-em:text-[#ccc8c4] prose-em:not-italic

          /* Inline code */
          prose-code:before:content-none prose-code:after:content-none
          prose-code:text-[#e2c882] prose-code:bg-[#1a1a1a]
          prose-code:border prose-code:border-[#2e2e2e]
          prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.8em] prose-code:font-mono

          /* Code blocks */
          prose-pre:bg-[#141414] prose-pre:border prose-pre:border-[#2a2a2a]
          prose-pre:rounded-xl prose-pre:p-5 prose-pre:my-6
          prose-pre:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]
          prose-pre:overflow-x-auto
          [&_pre_code]:bg-transparent [&_pre_code]:border-0 [&_pre_code]:p-0
          [&_pre_code]:text-[#c4b5fd] [&_pre_code]:text-[0.82rem]

          /* Lists */
          prose-ul:my-5 prose-ul:pl-0 prose-ol:my-5 prose-ol:pl-0
          prose-li:text-[#9e9995] prose-li:my-2 prose-li:leading-relaxed prose-li:text-[0.9rem]
          prose-li:marker:text-primary/50

          /* Blockquote */
          prose-blockquote:border-l-2 prose-blockquote:border-primary/40
          prose-blockquote:bg-[#1c1c1c] prose-blockquote:rounded-r-lg
          prose-blockquote:px-5 prose-blockquote:py-3 prose-blockquote:my-6
          prose-blockquote:not-italic prose-blockquote:text-muted-foreground

          /* HR */
          prose-hr:border-border prose-hr:my-10

          /* Table */
          prose-table:text-sm
          prose-thead:border-b prose-thead:border-border
          prose-th:text-muted-foreground prose-th:font-mono prose-th:font-normal prose-th:text-[10px] prose-th:uppercase prose-th:tracking-wider prose-th:py-2 prose-th:px-3
          prose-td:text-[#9e9995] prose-td:py-2 prose-td:px-3
          prose-tr:border-b prose-tr:border-border/50

          /* Images */
          [&_img]:rounded-xl [&_img]:border [&_img]:border-border [&_img]:my-6
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {article.description}
          </ReactMarkdown>
        </article>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border/50">
          <Link href="/messages" className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground/40 hover:text-foreground transition-colors">
            <ArrowLeft size={12}/> back to writing
          </Link>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), "messages");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).filter(d=>d.isDirectory()).map(d=>({ slug: d.name }));
}
