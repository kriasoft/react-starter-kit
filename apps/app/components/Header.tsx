
import React from "react";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground sticky top-0 z-40 shadow-sm">
      <a href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
        <img src="/logo.svg" alt="CineFind Web" className="h-8 w-8" />
        <span className="font-bold text-lg tracking-tight">CineFind Web</span>
      </a>
      <button 
        aria-label="Open menu" 
        onClick={onMenuClick} 
        className="touch-target p-2 rounded-md hover:bg-primary/90 transition-colors"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </header>
  );
}
