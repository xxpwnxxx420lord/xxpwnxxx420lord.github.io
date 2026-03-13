import type { Metadata } from "next";
import { HeroUIProvider } from "@heroui/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Johnny's Space",
  description: "Johnny's (syntaxical's) personal portfolio with a playground also check out the rock subdomain 😉",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/x-icon" href="./image_32x32.png" />
      </head>
      <body className="bg-[#232323] text-[#f0ede8] font-sans antialiased">
        <HeroUIProvider>
          {children}
        </HeroUIProvider>
      </body>
    </html>
  );
}
