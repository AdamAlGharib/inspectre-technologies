import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const title = "Inspectre Technologies — We find the signal, then build it.";
const description =
  "An independent technology studio building ambitious software, ventures, and experiments.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto")?.split(",")[0];
  const protocol = forwardedProtocol ?? (host.startsWith("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);
  const image = new URL("/og.png", metadataBase).toString();

  return {
    metadataBase,
    title,
    description,
    openGraph: {
      type: "website",
      siteName: "Inspectre Technologies",
      url: metadataBase,
      title,
      description,
      images: [{ url: image, width: 1731, height: 909, alt: "Inspectre Technologies — We find the signal. Then we build it." }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // the home page sets data-inspectre-theme on <html> before hydration (see app/page.tsx)
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
