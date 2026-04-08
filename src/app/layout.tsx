import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shubhang Dixit | Mobile Developer",
  description: "Building apps for Humans — Flutter, Kotlin, Swift developer from Mathura. Exploring mobile, AI, and emerging tech.",
  keywords: ["Flutter", "Kotlin", "Swift", "Mobile Developer", "Android", "iOS", "Shubhang Dixit"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-[#050510] text-[#E2E8F0] antialiased">
        {children}
      </body>
    </html>
  );
}
