"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AnimatedGridProps {
  className?: string;
  lineColor?: string;
  dotColor?: string;
  dotSize?: number;
  spacing?: number;
  pulseSpeed?: number;
}

export function AnimatedGrid({
  className = "",
  lineColor = "rgba(167, 139, 250, 0.03)",
  dotColor = "rgba(167, 139, 250, 0.15)",
  dotSize = 2,
  spacing = 40,
  pulseSpeed = 4,
}: AnimatedGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cols = Math.ceil(canvas.width / spacing);
      const rows = Math.ceil(canvas.height / spacing);

      timeRef.current += 0.016;

      // Draw grid lines
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;

      for (let i = 0; i <= cols; i++) {
        const x = i * spacing;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let i = 0; i <= rows; i++) {
        const y = i * spacing;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw animated dots at intersections
      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = i * spacing;
          const y = j * spacing;

          // Create wave effect
          const distanceFromCenter = Math.sqrt(
            Math.pow(x - canvas.width / 2, 2) +
            Math.pow(y - canvas.height / 2, 2)
          );
          const wave = Math.sin(distanceFromCenter * 0.01 - timeRef.current * pulseSpeed);
          const opacity = (wave + 1) / 2 * 0.5 + 0.1;
          const size = dotSize * (0.5 + (wave + 1) / 4);

          ctx.fillStyle = dotColor.replace(")", `, ${opacity})`);
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [lineColor, dotColor, dotSize, spacing, pulseSpeed]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none fixed inset-0 z-0", className)}
    />
  );
}

// Simpler CSS-based animated grid for better performance
interface SimpleGridProps {
  className?: string;
}

export function SimpleAnimatedGrid({ className = "" }: SimpleGridProps) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(167, 139, 250, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(167, 139, 250, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          animation: "grid-move 20s linear infinite",
        }}
      />
      <style>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); }
        }
      `}</style>
    </div>
  );
}
