"use client";

import { useEffect, useState, useCallback } from "react";

interface TextScrambleProps {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
  trigger?: boolean;
}

const chars = "!<>-_\\/[]{}—=+*^?#________";

export function TextScramble({
  text,
  className = "",
  duration = 2000,
  delay = 0,
  trigger = true,
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);
  const [hasAnimated, setHasAnimated] = useState(false);

  const scramble = useCallback(() => {
    if (hasAnimated) return;

    const length = text.length;
    const frameRate = 1000 / 30;
    const totalFrames = Math.floor(duration / frameRate);
    let frame = 0;

    const queue = text.split("").map(() => ({
      from: chars[Math.floor(Math.random() * chars.length)],
      to: "",
      start: Math.floor(Math.random() * totalFrames * 0.5),
      end: Math.floor(Math.random() * totalFrames * 0.5) + Math.floor(totalFrames * 0.5),
    }));

    const update = () => {
      let output = "";
      let complete = 0;

      for (let i = 0; i < length; i++) {
        const { from, start, end } = queue[i];
        let char = from;

        if (frame >= end) {
          char = text[i];
          complete++;
        } else if (frame >= start) {
          if (Math.random() < 0.28) {
            char = chars[Math.floor(Math.random() * chars.length)];
          } else {
            char = from;
          }
        }

        output += char;
      }

      setDisplayText(output);

      if (complete === length) {
        setHasAnimated(true);
        return;
      }

      frame++;
      setTimeout(update, frameRate);
    };

    setTimeout(update, delay);
  }, [text, duration, delay, hasAnimated]);

  useEffect(() => {
    if (trigger && !hasAnimated) {
      scramble();
    }
  }, [trigger, scramble, hasAnimated]);

  return <span className={className}>{displayText}</span>;
}

// Hook for scramble on hover
export function useTextScramble(text: string) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);

  const scramble = useCallback(() => {
    if (isScrambling) return;
    setIsScrambling(true);

    const length = text.length;
    const duration = 800;
    const frameRate = 1000 / 30;
    const totalFrames = Math.floor(duration / frameRate);
    let frame = 0;

    const queue = text.split("").map(() => ({
      from: chars[Math.floor(Math.random() * chars.length)],
      to: "",
      start: Math.floor(Math.random() * totalFrames * 0.3),
      end: Math.floor(Math.random() * totalFrames * 0.3) + Math.floor(totalFrames * 0.7),
    }));

    const update = () => {
      let output = "";
      let complete = 0;

      for (let i = 0; i < length; i++) {
        const { from, start, end } = queue[i];
        let char = from;

        if (frame >= end) {
          char = text[i];
          complete++;
        } else if (frame >= start) {
          if (Math.random() < 0.28) {
            char = chars[Math.floor(Math.random() * chars.length)];
          } else {
            char = from;
          }
        }

        output += char;
      }

      setDisplayText(output);

      if (complete === length) {
        setIsScrambling(false);
        return;
      }

      frame++;
      setTimeout(update, frameRate);
    };

    update();
  }, [text, isScrambling]);

  const reset = useCallback(() => {
    setDisplayText(text);
    setIsScrambling(false);
  }, [text]);

  return { displayText, scramble, reset };
}
