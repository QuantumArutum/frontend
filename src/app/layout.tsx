import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import EnhancedQuantumParticles from "../components/EnhancedQuantumParticles";
import ClientProviders from "../components/ClientProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quantaureum - Quantum Blockchain Ecosystem",
  description: "Quantaureum is a next-generation quantum-safe blockchain platform providing a complete decentralized application ecosystem",
  icons: {
    icon: "/logos/quantum-aurum-icon-animated.svg",
    shortcut: "/logos/quantum-aurum-icon-animated.svg",
    apple: "/logos/quantum-aurum-icon-animated.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <EnhancedQuantumParticles />
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
