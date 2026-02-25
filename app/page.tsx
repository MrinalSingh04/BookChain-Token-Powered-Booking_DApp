"use client";

import { useState } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import Navbar from "@/components/Navbar";
import ConnectScreen from "@/components/ConnectScreen";
import DashboardStats from "@/components/DashboardStats";
import ServicesSection from "@/components/ServicesSection";
import MyBookingsSection from "@/components/MyBookingsSection";
import AdminPanel from "@/components/AdminPanel";
import TabNav from "@/components/TabNav";
import TxToast from "@/components/TxToast";

export default function Home() {
  const { account, isOwner, myBookings } = useWeb3();
  const [activeTab, setActiveTab] = useState("services");

  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ position: "relative", zIndex: 1 }}>
        {!account ? (
          <ConnectScreen />
        ) : (
          <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
            {/* Stats */}
            <DashboardStats />

            {/* Tab navigation */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <TabNav
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isOwner={isOwner}
                bookingCount={myBookings.filter(b => !b.cancelled).length}
              />
            </div>

            {/* Tab content */}
            <div>
              {activeTab === "services" && <ServicesSection />}
              {activeTab === "bookings" && <MyBookingsSection />}
              {activeTab === "admin" && isOwner && <AdminPanel />}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      {account && (
        <footer className="border-t mt-20" style={{ borderColor: "var(--border)" }}>
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Book<span style={{ color: "var(--acid)" }}>Chain</span></span>
              <span className="text-xs px-2 py-0.5 rounded-full font-mono" style={{ background: "rgba(200,255,0,0.08)", color: "var(--acid)", border: "1px solid rgba(200,255,0,0.2)" }}>Sepolia</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="https://sepolia.etherscan.io/address/0xc98E63aFB782C96eb24af410c3c63091Db663a73" target="_blank" rel="noopener noreferrer" className="text-xs transition-colors hover:text-acid" style={{ color: "var(--text-muted)", fontFamily: "inherit" }}>
                Token Contract ↗
              </a>
              <a href="https://sepolia.etherscan.io/address/0xeAaDD7C8200FcC208eA126FF945F6D03a59378A0" target="_blank" rel="noopener noreferrer" className="text-xs transition-colors hover:text-acid" style={{ color: "var(--text-muted)" }}>
                Booking Contract ↗
              </a>
            </div>
          </div>
        </footer>
      )}

      <TxToast />
    </>
  );
}
