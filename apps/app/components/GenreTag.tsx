
import React from "react";

export function GenreTag({ genre, onClick }: { genre: string; onClick?: () => void }) {
  return (
    <button 
      className="touch-target px-4 py-2 bg-muted text-muted-foreground rounded-full text-sm font-medium mr-2 mb-2 hover:bg-accent hover:text-accent-foreground transition-colors border border-border"
      onClick={onClick}
    >
      {genre}
    </button>
  );
}
