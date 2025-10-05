
import React from "react";

export function WatchlistItem({ movie, onRemove, onToggleWatched }: { movie: any; onRemove: () => void; onToggleWatched: () => void }) {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-border bg-card">
      <img 
        src={movie.poster} 
        alt={movie.title} 
        className="w-16 h-24 object-cover movie-poster flex-shrink-0"
        loading="lazy"
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-foreground line-clamp-1">{movie.title}</h4>
        <span className="text-sm text-muted-foreground">{movie.year} | {movie.genre}</span>
      </div>
      <div className="flex flex-col gap-2 ml-auto">
        <button 
          className={`touch-target px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            movie.watched 
              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
              : 'bg-accent text-accent-foreground hover:bg-accent/90'
          }`}
          onClick={onToggleWatched}
        >
          {movie.watched ? "✓ Watched" : "Mark as Watched"}
        </button>
        <button 
          className="touch-target px-3 py-2 bg-destructive text-destructive-foreground rounded-md text-sm font-medium hover:bg-destructive/90 transition-colors"
          onClick={onRemove}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
