import { NextRequest, NextResponse } from "next/server";
import { readdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.toLowerCase().trim() || "";
  if (!q || q.length < 2) return NextResponse.json([]);

  const dir = join(process.cwd(), "messages");
  if (!existsSync(dir)) return NextResponse.json([]);

  const slugs = readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const results = slugs.flatMap((slug) => {
    const base = join(dir, slug);
    const title = existsSync(join(base, "title.txt"))
      ? readFileSync(join(base, "title.txt"), "utf-8").trim()
      : slug;
    const topic = existsSync(join(base, "topic.txt"))
      ? readFileSync(join(base, "topic.txt"), "utf-8").trim()
      : "misc";
    const description = existsSync(join(base, "description.md"))
      ? readFileSync(join(base, "description.md"), "utf-8")
      : "";

    const haystack = `${title} ${topic} ${description}`.toLowerCase();
    if (!haystack.includes(q)) return [];

    // Find a good snippet around the match
    const descLower = description.toLowerCase();
    const idx = descLower.indexOf(q);
    const raw = idx >= 0
      ? description.slice(Math.max(0, idx - 50), idx + 100)
      : description.slice(0, 120);
    const snippet = raw.replace(/[#*`_>\[\]]/g, "").replace(/\s+/g, " ").trim();

    return [{ slug, title, topic, snippet }];
  });

  return NextResponse.json(results.slice(0, 8));
}
