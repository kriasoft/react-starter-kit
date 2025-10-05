import React from "react";
import { MovieCard } from "./MovieCard";

interface Movie {
  poster: string;
  title: string;
  year: number;
  tagline?: string;
}

export function MovieRow({ 
  title, 
  movies, 
  onMovieClick, 
  onViewAll 
}: { 
  title: string; 
  movies: Movie[]; 
  onMovieClick?: (movie: Movie) => void;
  onViewAll?: () => void;
}) {
  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="text-accent hover:text-accent/80 text-sm font-medium transition-colors"
          >
            View All →
          </button>
        )}
      </div>
      <div className="scroll-container px-4">
        {movies.map((movie, idx) => (
          <MovieCard 
            key={`${movie.title}-${idx}`} 
            movie={movie} 
            onClick={() => onMovieClick?.(movie)} 
          />
        ))}
      </div>
    </section>
  );
}