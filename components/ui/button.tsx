import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-mono text-xs font-medium transition-all disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default: "bg-[#f0ede8] text-[#1a1a1a] hover:bg-white",
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-[#363636] bg-transparent text-muted-foreground hover:border-[#555] hover:text-foreground",
        ghost: "text-muted-foreground hover:text-foreground hover:bg-accent",
        link: "text-primary underline-offset-4 hover:underline",
        discord: "bg-[#5865f2] hover:bg-[#4752c4] text-white",
        purple: "border border-[#4a4a4a] text-muted-foreground hover:border-primary hover:text-primary",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-7 px-3",
        lg: "h-10 px-6",
        icon: "h-7 w-7",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
