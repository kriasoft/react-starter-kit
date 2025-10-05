
import React from "react";

export function HamburgerMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <nav className="fixed inset-0 bg-black/60 z-50 flex justify-end">
      <div className="w-72 max-w-[80vw] bg-background h-full shadow-xl p-6 flex flex-col gap-2 border-l border-border">
        <button 
          className="self-end touch-target p-2 rounded-md hover:bg-muted transition-colors" 
          aria-label="Close menu" 
          onClick={onClose}
        >
          <span className="text-2xl leading-none">×</span>
        </button>
        <div className="mt-4 space-y-1">
          <a href="/" className="nav-link">
            <span>🎬</span>
            <span>Discover</span>
          </a>
          <a href="/about" className="nav-link">
            <span>🔍</span>
            <span>Search</span>
          </a>
          <a href="/settings" className="nav-link">
            <span>📺</span>
            <span>Watchlist</span>
          </a>
          <a href="/users" className="nav-link">
            <span>👤</span>
            <span>My Profile</span>
          </a>
          <div className="border-t border-border my-4"></div>
          <a href="/analytics" className="nav-link">
            <span>📊</span>
            <span>Analytics</span>
          </a>
          <a href="/reports" className="nav-link">
            <span>📋</span>
            <span>Reports</span>
          </a>
          <a href="/dashboard" className="nav-link">
            <span>🏠</span>
            <span>Dashboard</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
