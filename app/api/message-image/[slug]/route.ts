import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const imgPath = path.join(process.cwd(), "messages", params.slug, "image.png");
  if (!fs.existsSync(imgPath)) {
    return new NextResponse(null, { status: 404 });
  }
  const buf = fs.readFileSync(imgPath);
  return new NextResponse(buf, {
    headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" },
  });
}
