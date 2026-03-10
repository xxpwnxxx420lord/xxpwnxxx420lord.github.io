import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { owner: string; repo: string } }
) {
  try {
    const { owner, repo } = params;
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=10`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "syntaxical-portfolio",
        },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) throw new Error("GitHub API error");
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
