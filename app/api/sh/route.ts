// app/api/paragraph/route.ts
export function GET() {
  return new Response("asdasdasd", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}
