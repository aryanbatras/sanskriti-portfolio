import type { Metadata } from "next";
import { DM_Serif_Display } from "next/font/google";
import "./globals.css";

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  variable: "--font-dm-serif-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sanskriti Gupta — AI/ML Researcher",
  description:
    "Research intern at IIT Jammu. Speech intelligibility, deep learning, and the space where language meets code.",
  keywords: [
    "Sanskriti Gupta",
    "AI",
    "Machine Learning",
    "Deep Learning",
    "Speech Processing",
    "IIT Jammu",
    "Research",
  ],
  openGraph: {
    title: "Sanskriti Gupta — AI/ML Researcher",
    description:
      "Research intern @ IIT Jammu | Building speech intelligibility models and deep learning systems",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSerifDisplay.variable}`}>
      <body>{children}</body>
    </html>
  );
}
