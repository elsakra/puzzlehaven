import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ServiceWorkerRegistration from "@/components/layout/ServiceWorkerRegistration";
import { GA_MEASUREMENT_ID } from "@/lib/gtag";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const siteName = "Online Jigsaws";
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
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteName,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
};

const ADSENSE_PUBLISHER_ID = "ca-pub-5593486984619998";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Theme color for browser chrome */}
        <meta name="theme-color" content="#f59e0b" />
        {/* Google Analytics 4 */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `,
          }}
        />
        {/* Google AdSense — publisher ID hardcoded (public value, required for verification) */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-white text-stone-900`}>
        <ServiceWorkerRegistration />
        <Header />
        <main className="min-h-[80vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
