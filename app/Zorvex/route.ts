export async function GET() {
  const script = `loadstring(game:HttpGetAsync("https://github.com/Zorvex-Softworks/Zorvex/blob/main/Zorvex.lua?raw=true", true))()`;

  return new Response(script, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
