# Cmd-XYZ Usage Guide

**Cmd-XYZ** is a modular command framework for LuaU. Drop it in, register your commands, done.

## Installation

Load the module at the top of your script:

```lua
local Cmd = loadstring(game:HttpGet("https://raw.githubusercontent.com/xxpwnxxx420lord/Cmd-XYZ/main/loader.lua"))()
```

## Registering a Command

```lua
Cmd:Register({
    name = "speed",
    alias = {"sp", "walkspeed"},
    args = { "player", "value" },
    callback = function(args)
        args.player.Character.Humanoid.WalkSpeed = tonumber(args.value)
    end
})
```

## Running Commands

Commands are triggered via a prefix (default `;`):

```
;speed @me 50
;speed @all 16
```

## Config

Pass a config table on init:

```lua
local Cmd = require(module)({
    prefix = "!",
    adminOnly = true,
    admins = { 12345678 }
})
```

## Tips

- Use `@me`, `@all`, `@others` as player shortcuts
- Commands are **case-insensitive**
- Stack multiple commands on one line with `&&`

More docs on the [GitHub repo](https://github.com/xxpwnxxx420lord/Cmd-XYZ).
