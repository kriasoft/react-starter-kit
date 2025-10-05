/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { WatchlistItem } from "@/components/WatchlistItem";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { sampleMovies } from "@/lib/sample-data";

export const Route = createFileRoute("/(app)/settings")({
  component: WatchlistPage,
});

function WatchlistPage() {
  // Sample watchlist data with watched status
  const [watchlistMovies, setWatchlistMovies] = useState([
    { ...sampleMovies[0], watched: false, addedDate: "2024-01-15" },
    { ...sampleMovies[1], watched: true, addedDate: "2024-01-10" },
    { ...sampleMovies[2], watched: false, addedDate: "2024-01-08" },
    { ...sampleMovies[3], watched: false, addedDate: "2024-01-05" },
  ]);

  const [filter, setFilter] = useState<"all" | "watched" | "unwatched">("all");
  const [sortBy, setSortBy] = useState<"title" | "addedDate" | "releaseDate">("addedDate");

  const handleRemove = (movieToRemove: any) => {
    setWatchlistMovies(prev => 
      prev.filter(movie => movie.title !== movieToRemove.title)
    );
  };

  const handleToggleWatched = (movieToToggle: any) => {
    setWatchlistMovies(prev =>
      prev.map(movie =>
        movie.title === movieToToggle.title
          ? { ...movie, watched: !movie.watched }
          : movie
      )
    );
  };

  // Filter movies based on selected filter
  const filteredMovies = watchlistMovies.filter(movie => {
    if (filter === "watched") return movie.watched;
    if (filter === "unwatched") return !movie.watched;
    return true;
  });

  // Sort movies based on selected sort option
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "releaseDate":
        return b.year - a.year;
      case "addedDate":
      default:
        return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
    }
  });

  const watchedCount = watchlistMovies.filter(m => m.watched).length;
  const totalCount = watchlistMovies.length;

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">My Watchlist</h1>
        <p className="text-muted-foreground">
          {totalCount} movies • {watchedCount} watched • {totalCount - watchedCount} to watch
        </p>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Filter Tabs */}
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {[
            { key: "all", label: "All" },
            { key: "unwatched", label: "To Watch" },
            { key: "watched", label: "Watched" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-ring outline-none"
        >
          <option value="addedDate">Sort by: Date Added</option>
          <option value="title">Sort by: Title</option>
          <option value="releaseDate">Sort by: Release Date</option>
        </select>
      </div>

      {/* Watchlist Items */}
      {sortedMovies.length > 0 ? (
        <div className="space-y-2">
          {sortedMovies.map((movie) => (
            <WatchlistItem
              key={movie.title}
              movie={{
                ...movie,
                genre: movie.genres?.[0] || "Unknown",
              }}
              onRemove={() => handleRemove(movie)}
              onToggleWatched={() => handleToggleWatched(movie)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-lg font-semibold mb-2">
            {filter === "all" 
              ? "Your watchlist is empty" 
              : filter === "watched"
              ? "No watched movies"
              : "No movies to watch"
            }
          </h3>
          <p className="text-muted-foreground mb-4">
            {filter === "all"
              ? "Start adding movies you want to watch!"
              : filter === "watched"
              ? "Mark some movies as watched to see them here."
              : "All your movies are watched! Add more to your watchlist."
            }
          </p>
          <button
            onClick={() => {
              console.log("Navigate to discover page");
              // TODO: Navigate to discover page
            }}
            className="touch-target px-6 py-3 bg-accent text-accent-foreground rounded-md font-semibold hover:bg-accent/90 transition-colors"
          >
            Discover Movies
          </button>
        </div>
      )}
    </div>
  );
}
