// app/api/redirect/route.ts - Next.js App Router (Reverted to simple format)
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const placeid = searchParams.get('placeid');
  const gameid = searchParams.get('gameid');

  if (!placeid) {
    return new NextResponse('Missing placeid parameter. gameid is optional. Use: /api/redirect?placeid=123456789', {
      status: 400,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  // Reverted: Simple roblox://placeid= format (your original example)
  const robloxUrl = `roblox://placeid=${placeid}${gameid ? `&gameInstanceId=${gameid}` : ''}`;
  
  return NextResponse.redirect(robloxUrl, 302);
}
