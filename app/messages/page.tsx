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
      </div>
    </div>
  );
}
