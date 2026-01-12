"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface HoverLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function HoverLink({ href, children, className = "" }: HoverLinkProps) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Link
        href={href}
        className={`group inline-block ${className}`}
      >
        <span className="underline underline-offset-4 decoration-white/30 group-hover:decoration-white/60 transition-colors">
          {children}
        </span>
      </Link>
    </motion.div>
  );
}
