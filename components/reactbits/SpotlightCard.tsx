"use client";

import { useRef, useState, ReactNode, MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
  borderColor?: string;
}

export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(167, 139, 250, 0.15)",
  borderColor = "rgba(167, 139, 250, 0.3)",
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPosition({ x, y });
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300",
        "hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-lg",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderColor: isHovered ? borderColor : undefined,
      }}
    >
      {/* Spotlight effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Multi-spotlight version for larger areas
interface MultiSpotlightProps {
  children: ReactNode;
  className?: string;
}

export function MultiSpotlight({ children, className = "" }: MultiSpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [spots, setSpots] = useState<{ x: number; y: number; id: number }[]>([]);
  const spotIdRef = useRef(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newSpot = { x, y, id: spotIdRef.current++ };
    setSpots((prev) => [...prev.slice(-2), newSpot]);
  };

  const handleMouseLeave = () => {
    setSpots([]);
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {spots.map((spot) => (
        <div
          key={spot.id}
          className="pointer-events-none absolute"
          style={{
            left: spot.x,
            top: spot.y,
            width: 300,
            height: 300,
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(167, 139, 250, 0.08) 0%, transparent 70%)",
            animation: "spotlight-fade 1.5s ease-out forwards",
          }}
        />
      ))}
      <style jsx>{`
        @keyframes spotlight-fade {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.5); }
        }
      `}</style>
      {children}
    </div>
  );
}
