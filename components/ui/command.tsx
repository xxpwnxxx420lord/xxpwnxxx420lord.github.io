"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { createPortal } from "react-dom";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Base Command ─────────────────────────────────────────────────────────────

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn("flex h-full w-full flex-col overflow-hidden bg-popover text-foreground", className)}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

// ─── CommandDialog — own portal, no Dialog dep ───────────────────────────────

interface CommandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

function CommandDialog({ open, onOpenChange, children }: CommandDialogProps) {
  const [mounted, setMounted] = React.useState(false);
  const [animState, setAnimState] = React.useState<"in" | "out" | "hidden">("hidden");
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => { setMounted(true); }, []);

  // Animate on open/close
  React.useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (open) {
      setAnimState("in");
    } else {
      setAnimState("out");
      timeoutRef.current = setTimeout(() => setAnimState("hidden"), 150);
    }
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [open]);

  // Escape to close
  React.useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); onOpenChange(false); }
    };
    window.addEventListener("keydown", fn, true); // capture phase
    return () => window.removeEventListener("keydown", fn, true);
  }, [open, onOpenChange]);

  if (!mounted || animState === "hidden") return null;

  return createPortal(
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm",
          animState === "in" ? "animate-fade-in" : "animate-fade-out"
        )}
        onClick={() => onOpenChange(false)}
        aria-hidden
      />

      {/* Panel — centered, slides down slightly on open */}
      <div
        role="dialog"
        aria-modal
        className={cn(
          "fixed z-[101] left-1/2 top-[22vh] w-full max-w-xl px-4",
          "-translate-x-1/2",
          animState === "in" ? "animate-cmd-in" : "animate-cmd-out"
        )}
      >
        <div className="rounded-2xl border border-border bg-popover shadow-2xl overflow-hidden">
          <Command
            shouldFilter={false}
            className={cn(
              "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5",
              "[&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px]",
              "[&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest",
              "[&_[cmdk-group-heading]]:text-muted-foreground/40"
            )}
          >
            {children}
          </Command>
        </div>
      </div>
    </>,
    document.body
  );
}

// ─── CommandInput ─────────────────────────────────────────────────────────────

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center gap-3 border-b border-border px-4 py-3">
    <Search className="h-4 w-4 shrink-0 text-muted-foreground/40" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex flex-1 bg-transparent font-mono text-sm text-foreground outline-none",
        "placeholder:text-muted-foreground/25",
        className
      )}
      {...props}
    />
  </div>
));
CommandInput.displayName = CommandPrimitive.Input.displayName;

// ─── CommandList ─────────────────────────────────────────────────────────────

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[340px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
));
CommandList.displayName = CommandPrimitive.List.displayName;

// ─── CommandEmpty ─────────────────────────────────────────────────────────────

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-10 text-center font-mono text-xs text-muted-foreground/30"
    {...props}
  />
));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

// ─── CommandGroup ─────────────────────────────────────────────────────────────

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn("overflow-hidden p-1", className)}
    {...props}
  />
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;

// ─── CommandSeparator ────────────────────────────────────────────────────────

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("h-px bg-border mx-1 my-1", className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

// ─── CommandItem ─────────────────────────────────────────────────────────────

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center gap-3 rounded-lg px-3 py-2.5 text-sm outline-none transition-colors",
      "aria-selected:bg-accent/60 aria-selected:text-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
      className
    )}
    {...props}
  />
));
CommandItem.displayName = CommandPrimitive.Item.displayName;

// ─── CommandShortcut ─────────────────────────────────────────────────────────

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn("ml-auto font-mono text-[10px] text-muted-foreground/30", className)}
    {...props}
  />
);
CommandShortcut.displayName = "CommandShortcut";

export {
  Command, CommandDialog, CommandInput, CommandList,
  CommandEmpty, CommandGroup, CommandItem, CommandSeparator, CommandShortcut,
};
