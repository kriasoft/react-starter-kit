
import React from "react";

export function MovieCard({ movie, onClick }: { movie: { poster: string; title: string; year: number; tagline?: string }; onClick?: () => void }) {
  return (
    <div className="w-36 flex-shrink-0 cursor-pointer group" onClick={onClick}>
      <img 
        src={movie.poster} 
        alt={movie.title} 
        className="w-36 h-52 object-cover movie-poster"
        loading="lazy"
      />
      <div className="mt-3 px-1">
        <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-accent transition-colors">
          {movie.title}
        </h3>
        <span className="text-xs text-muted-foreground">{movie.year}</span>
        {movie.tagline && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{movie.tagline}</p>
        )}
      </div>
    </div>
  );
}
