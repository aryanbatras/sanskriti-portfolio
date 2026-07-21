import type { Metadata } from "next";
import { Playfair_Display, Newsreader, Fragment_Mono, Caveat, Fraunces, Press_Start_2P } from "next/font/google";
import "./globals.css";
import ClientRoot from "@/components/ClientRoot";
import NavigationDock from "@/components/NavigationDock";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const newsreader = Newsreader({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const fragmentMono = Fragment_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-handwritten",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display-alt",
  display: "swap",
});

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
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
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${newsreader.variable} ${fragmentMono.variable} ${caveat.variable} ${fraunces.variable} ${pressStart2P.variable}`}
    >
      <body>
        <ClientRoot>{children}</ClientRoot>
        <NavigationDock />
      </body>
    </html>
  );
}
