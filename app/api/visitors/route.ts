import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const FILE = join(process.cwd(), "data", "visitors.json");

function ensureFile() {
  const dir = join(process.cwd(), "data");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  if (!existsSync(FILE)) writeFileSync(FILE, JSON.stringify({ count: 0 }));
}

export async function GET() {
  try {
    ensureFile();
    const data = JSON.parse(readFileSync(FILE, "utf-8"));
    data.count = (data.count || 0) + 1;
    writeFileSync(FILE, JSON.stringify(data));
    return NextResponse.json({ count: data.count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
