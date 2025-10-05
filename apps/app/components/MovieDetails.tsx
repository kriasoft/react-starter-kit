
import React from "react";

export function MovieDetails({ movie }: { movie: any }) {
  // TODO: Add trailer, cast, reviews, related movies
  return (
    <section className="pb-8">
      <div className="flex flex-col lg:flex-row gap-8 p-4 lg:p-6">
        <div className="flex-shrink-0">
          <img 
            src={movie.poster} 
            alt={movie.title} 
            className="w-full max-w-sm lg:w-80 h-auto object-cover movie-poster mx-auto lg:mx-0"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">{movie.title}</h1>
          <div className="text-sm text-muted-foreground mb-4 flex flex-wrap gap-2">
            <span>{movie.year}</span>
            <span>•</span>
            <span>{movie.genres?.join(", ")}</span>
            <span>•</span>
            <span>{movie.runtime} min</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="text-yellow-500">★</span>
              {movie.rating}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-3 mb-6">
            <button className="touch-target px-6 py-3 bg-accent text-accent-foreground rounded-md font-semibold hover:bg-accent/90 transition-colors">
              Add to Watchlist
            </button>
            <button className="touch-target px-6 py-3 bg-secondary text-secondary-foreground rounded-md font-semibold hover:bg-secondary/90 transition-colors">
              Where to Watch
            </button>
            <button className="touch-target px-6 py-3 bg-muted text-muted-foreground rounded-md font-semibold hover:bg-muted/90 transition-colors">
              Share
            </button>
          </div>
          
          <div className="prose prose-sm max-w-none">
            <h3 className="text-lg font-semibold mb-2">Synopsis</h3>
            <p className="text-foreground leading-relaxed">{movie.synopsis}</p>
          </div>
          
          {/* TODO: Add trailer embed, cast & crew, reviews, related movies */}
        </div>
      </div>
    </section>
  );
}
