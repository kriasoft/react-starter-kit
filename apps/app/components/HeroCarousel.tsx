
import React from "react";

export function HeroCarousel({ movies }: { movies: Array<{ poster: string; title: string; tagline: string }> }) {
  // TODO: Add carousel logic with touch gestures
  return (
    <section className="w-full overflow-hidden relative">
      <div className="flex">
        {movies.map((movie, idx) => (
          <div key={idx} className="min-w-full relative">
            <div className="relative h-64 md:h-80 lg:h-96">
              <img 
                src={movie.poster} 
                alt={movie.title} 
                className="w-full h-full object-cover"
                loading={idx === 0 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </div>
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 line-clamp-2">{movie.title}</h2>
              <p className="text-sm md:text-base text-white/90 mb-4 line-clamp-2">{movie.tagline}</p>
              <button className="touch-target px-6 py-3 bg-accent text-accent-foreground rounded-md font-semibold hover:bg-accent/90 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination dots */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        {movies.map((_, idx) => (
          <div 
            key={idx} 
            className={`w-2 h-2 rounded-full transition-colors ${idx === 0 ? 'bg-accent' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </section>
  );
}
