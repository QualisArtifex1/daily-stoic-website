import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);

  return {
    metadataBase,
    title: "A Stoic Thought for Today",
    description: "One Stoic quote for every day of the year.",
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title: "A Stoic Thought for Today",
      description: "One Stoic quote for every day of the year.",
      images: [{ url: "/og.png", width: 1536, height: 1024, alt: "A Stoic Thought for Today" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "A Stoic Thought for Today",
      description: "One Stoic quote for every day of the year.",
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
