import type { Metadata } from "next";
import "./globals.css";
import { Web3Provider } from "@/contexts/Web3Context";

export const metadata: Metadata = {
  title: "BookChain — Token-Powered Booking",
  description: "Decentralized booking system powered by smart contracts on Sepolia",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
