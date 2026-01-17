// app/api/paragraph/route.ts
export function GET() {
  return new Response("This is a single paragraph from a TS file", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}
