import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import LightRays from "@/components/LightRays";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const schibstedGrotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted-grotesk",
  display: "swap",
});

const martianMono = Martian_Mono({
  subsets: ["latin"],
  variable: "--font-martian-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Evenza",
  description: "Discover and book events near you",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", schibstedGrotesk.variable, martianMono.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          <LightRays
            raysOrigin="top-center-offset"
            raysColor="#2f7454ff"
            raysSpeed={1}
            lightSpread={0.5}
            rayLength={3}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0}
            distortion={0}
            className="custom-rays"
            pulsating={false}
            fadeDistance={1}
            saturation={1}
          />
        </div>
        <div style={{ position: "relative", zIndex: 1, display: "contents" }}>
          {children}
        </div>
      </body>
    </html>
  );
}
