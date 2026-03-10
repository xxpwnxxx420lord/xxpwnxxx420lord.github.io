import type { Metadata } from "next";
import { HeroUIProvider } from "@heroui/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Johnny's space",
  description: "Main page is a portfolio, I'll add stuff other stuff later ig",
  openGraph: {
    images: ["https://images-ext-1.discordapp.net/external/SrxfW4yeu0AI5EKiBc0q6LvAb2tgTBfhAajEC3CQzNI/https/media.tenor.com/qbtP-__kJC0AAAPo/hypnosis-dog.mp4"], // relative to public folder
  },
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
      </head>
      <body className="bg-[#232323] text-[#f0ede8] font-sans antialiased">
        <HeroUIProvider>
          {children}
        </HeroUIProvider>
      </body>
    </html>
  );
}
