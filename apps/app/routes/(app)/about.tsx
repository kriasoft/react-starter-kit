/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { SearchBar } from "@/components/SearchBar";
import { MovieCard } from "@/components/MovieCard";
import { GenreTag } from "@/components/GenreTag";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { sampleMovies, genres } from "@/lib/sample-data";

export const Route = createFileRoute("/(app)/about")({
  component: SearchPage,
});

function SearchPage() {
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const recentSearches = ["The Matrix", "Inception", "Marvel"];
  const trendingSearches = ["Spider-Man", "Avatar", "Top Gun"];

  const handleSearch = (value: string) => {
    setSearchValue(value);
    
    if (value.trim()) {
      // Filter movies based on search term
      const filtered = sampleMovies.filter(movie =>
        movie.title.toLowerCase().includes(value.toLowerCase()) ||
        movie.genres.some(genre => genre.toLowerCase().includes(value.toLowerCase()))
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  const handleMovieClick = (movie: any) => {
    console.log("Navigate to movie details:", movie.title);
    // TODO: Navigate to movie details page
  };

  const handleSearchChip = (searchTerm: string) => {
    handleSearch(searchTerm);
  };

  return (
    <div className="min-h-screen p-4">
      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          value={searchValue}
          onChange={handleSearch}
          onClear={() => handleSearch("")}
        />
      </div>

      {/* Search Results */}
      {searchValue && results.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Search Results ({results.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.map((movie, idx) => (
              <MovieCard
                key={`${movie.title}-${idx}`}
                movie={movie}
                onClick={() => handleMovieClick(movie)}
              />
            ))}
          </div>
        </section>
      )}

      {/* No Results */}
      {searchValue && results.length === 0 && (
        <section className="text-center py-12">
          <p className="text-muted-foreground text-lg">No movies found for "{searchValue}"</p>
          <p className="text-muted-foreground text-sm mt-2">Try searching for a different movie, actor, or genre</p>
        </section>
      )}

      {/* Default State - No Search */}
      {!searchValue && (
        <>
          {/* Recent Searches */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Recent Searches</h3>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => handleSearchChip(search)}
                  className="px-3 py-2 bg-muted text-muted-foreground rounded-full text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </section>

          {/* Trending Searches */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Trending Searches</h3>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => handleSearchChip(search)}
                  className="px-3 py-2 bg-accent text-accent-foreground rounded-full text-sm hover:bg-accent/90 transition-colors"
                >
                  🔥 {search}
                </button>
              ))}
            </div>
          </section>

          {/* Browse by Genre */}
          <section>
            <h3 className="text-lg font-semibold mb-3">Browse by Genre</h3>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <GenreTag
                  key={genre}
                  genre={genre}
                  onClick={() => handleSearchChip(genre)}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
