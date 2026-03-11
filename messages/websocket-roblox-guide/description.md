# Discord ↔ Roblox via WebSockets

A quick breakdown of how the Discord ↔ Roblox controller works and how you can set it up yourself.

## Architecture

```
Discord Bot (Python) <──> WebSocket Server <──> Roblox HttpService polling
```

Roblox can't hold persistent WebSocket connections from the server side, so we poll from Roblox and push from Discord.

## Server (Python)

The WebSocket server queues messages sent from Discord and serves them when Roblox polls:

```python
import asyncio
import websockets
import json

queue = []

async def handler(ws):
    async for message in ws:
        data = json.loads(message)
        if data["source"] == "discord":
            queue.append(data)
        elif data["source"] == "roblox":
            if queue:
                await ws.send(json.dumps(queue.pop(0)))
            else:
                await ws.send(json.dumps({"action": "none"}))

asyncio.run(websockets.serve(handler, "0.0.0.0", 8765))
```

## Roblox Side (LuaU)

```lua
local HttpService = game:GetService("HttpService")

while task.wait(1) do
    local ok, res = pcall(function()
        return HttpService:GetAsync("http://yourserver:8765/poll")
    end)
    if ok then
        local data = HttpService:JSONDecode(res)
        if data.action == "kick" then
            game.Players:FindFirstChild(data.target):Kick(data.reason)
        end
    end
end
```

## Discord Bot

Send commands from a Discord slash command that pushes to the WebSocket server. Full source on [GitHub](https://github.com/random-projects-coz-bored-and-ye/Websocket-Discord-bot).
