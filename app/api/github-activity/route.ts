import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.github.com/users/xxpwnxxx420lord/events/public?per_page=20",
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "syntaxical-portfolio",
        },
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) throw new Error("GitHub API error");
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
