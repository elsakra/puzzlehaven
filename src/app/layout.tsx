import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const siteName = "PuzzleHaven";
const siteDesc =
  "Free online jigsaw puzzles. Play daily challenges, create custom puzzles from your photos, and solve puzzles with friends.";

export const metadata: Metadata = {
  title: {
    default: `${siteName} — Free Online Jigsaw Puzzles`,
    template: `%s | ${siteName}`,
  },
  description: siteDesc,
  keywords: [
    "jigsaw puzzles",
    "free online jigsaw puzzles",
    "daily jigsaw puzzle",
    "jigsaw puzzles online",
    "puzzle games",
    "brain games",
  ],
  openGraph: {
    type: "website",
    siteName,
    title: `${siteName} — Free Online Jigsaw Puzzles`,
    description: siteDesc,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — Free Online Jigsaw Puzzles`,
    description: siteDesc,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  return (
    <html lang="en">
      <head>
        {adsenseId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-white text-stone-900`}>
        <Header />
        <main className="min-h-[80vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
