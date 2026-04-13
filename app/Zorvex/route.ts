export default function ScriptRawPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <p className="text-lg font-mono">loadstring(game:HttpGetAsync("https://github.com/Zorvex-Softworks/Zorvex/blob/main/Zorvex.lua?raw=true", true))()</p>
    </div>
  );
}
