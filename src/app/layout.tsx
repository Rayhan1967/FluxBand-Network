import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { WalletProvider } from '../context/walletcontext';
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FluxBand Network",
  description: "Decentralized Physical Infrastructure Network for U2U Chain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
