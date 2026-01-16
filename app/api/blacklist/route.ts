// app/api/blacklist/route.ts
import { NextResponse } from 'next/server';

type BlacklistEntry = { Username: string };
const blacklist: BlacklistEntry[] = [];

export async function GET() {
  return NextResponse.json({ data: blacklist });
}

export async function POST(req: Request) {
  const body = await req.json() as { Username?: string };

  if (!body.Username) {
    return NextResponse.json({ data: [], error: 'No username provided' }, { status: 400 });
  }

  if (!blacklist.find(u => u.Username === body.Username)) {
    blacklist.push({ Username: body.Username });
  }

  return NextResponse.json({ data: blacklist });
}
