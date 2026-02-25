"use client";

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  adminOnly?: boolean;
}

interface TabNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOwner: boolean;
  bookingCount?: number;
}

export default function TabNav({ activeTab, setActiveTab, isOwner, bookingCount }: TabNavProps) {
  const tabs: Tab[] = [
    {
      id: "services",
      label: "Services",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
        </svg>
      ),
    },
    {
      id: "bookings",
      label: "My Bookings",
      badge: bookingCount,
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
        </svg>
      ),
    },
    {
      id: "admin",
      label: "Admin",
      adminOnly: true,
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
    },
  ];

  const visibleTabs = tabs.filter(t => !t.adminOnly || isOwner);

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl w-fit" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
      {visibleTabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{
            background: activeTab === tab.id ? "rgba(200,255,0,0.1)" : "transparent",
            color: activeTab === tab.id ? "var(--acid)" : "var(--text-muted)",
            border: activeTab === tab.id ? "1px solid rgba(200,255,0,0.2)" : "1px solid transparent",
            fontFamily: "'Syne', sans-serif",
          }}
        >
          {tab.icon}
          {tab.label}
          {tab.badge !== undefined && tab.badge > 0 && (
            <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold" style={{ background: "var(--acid)", color: "#0a0d14" }}>
              {tab.badge > 9 ? "9+" : tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
