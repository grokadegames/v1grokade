import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "GROKADE - AI Gaming Vibe Hub",
  description: "Discover games built with AI tools like Grok using our vibegame index. Play games, attract players, run competitions, post gigs, and hire game devs.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-grok-dark text-white`}
      >
        {children}
      </body>
    </html>
  );
}
