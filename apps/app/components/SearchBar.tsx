
import React from "react";

export function SearchBar({ value, onChange, onClear }: { value: string; onChange: (v: string) => void; onClear: () => void }) {
  return (
    <div className="flex items-center w-full bg-input border border-border rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-ring transition-all">
      <svg className="w-5 h-5 text-muted-foreground mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search for movies, actors, or genres..."
        className="flex-1 bg-transparent outline-none text-foreground placeholder-muted-foreground text-base"
      />
      {value && (
        <button 
          aria-label="Clear search" 
          onClick={onClear} 
          className="touch-target p-1 ml-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
