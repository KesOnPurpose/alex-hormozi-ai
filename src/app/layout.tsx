import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavigationHeader from "@/components/layout/NavigationHeader";
import { FeatureFlagProvider } from "@/contexts/FeatureFlagContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alex Hormozi AI - Business Coaching Orchestra",
  description: "Get Alex Hormozi-style business coaching with AI-powered analysis using insights from 1,260+ business consultations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FeatureFlagProvider>
          <NavigationHeader />
          {children}
        </FeatureFlagProvider>
      </body>
    </html>
  );
}
