# Dominion Devlog #1

So I started working on **Dominion** — a universal script aimed at FPS and TPS games on Roblox. The goal is simple: one script that works across a huge range of games without needing to patch it every update.

## Why?

Most scripts are game-specific. They break the moment the developer pushes an update, or they rely on internal remotes that get renamed constantly. I wanted something more resilient.

## Architecture

The core idea is a **detection layer** that fingerprints the game and routes to the right module:

```lua
local detector = Dominion.Detect()
if detector.gameType == "FPS" then
    Dominion.Load("fps_core")
elseif detector.gameType == "TPS" then
    Dominion.Load("tps_core")
end
```

Each core module handles:

- **Aimbot** — prediction-based, accounts for ping
- **ESP** — box, skeleton, distance
- **Misc** — speed, noclip, fly

## Current Status

Still WIP. The detection layer works on about 80% of tested games. The aimbot prediction needs more work — currently it undershoots at high ping.

## Next Steps

- Improve prediction algorithm
- Add a config UI (probably reusing the Framework)
- Test on more games

More updates soon.
