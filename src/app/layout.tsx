import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AttendeeStatusProvider } from "@/contexts/AttendeeStatusContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MeetGenius - Enterprise AI Networking Platform",
  description: "Advanced AI-powered matching system that analyzes professional profiles to create meaningful connections at enterprise events. Intelligent networking for the modern professional.",
  keywords: "AI networking, professional matching, enterprise events, intelligent connections, business networking",
  authors: [{ name: "MeetGenius" }],
  viewport: "width=device-width, initial-scale=1",
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
        <AttendeeStatusProvider>
          {children}
        </AttendeeStatusProvider>
      </body>
    </html>
  );
}
