/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { HeroCarousel } from "@/components/HeroCarousel";
import { MovieRow } from "@/components/MovieRow";
import { GenreTag } from "@/components/GenreTag";
import { createFileRoute } from "@tanstack/react-router";
import { heroMovies, movieSections, genres } from "@/lib/sample-data";

export const Route = createFileRoute("/(app)/")({
  component: DiscoverPage,
});

function DiscoverPage() {
  const handleMovieClick = (movie: any) => {
    console.log("Navigate to movie details:", movie.title);
    // TODO: Navigate to movie details page
  };

  const handleGenreClick = (genre: string) => {
    console.log("Navigate to genre page:", genre);
    // TODO: Navigate to genre listing page
  };

  const handleViewAll = (section: string) => {
    console.log("View all for section:", section);
    // TODO: Navigate to section listing page
  };

  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <HeroCarousel movies={heroMovies} />

      {/* Content Sections */}
      <div className="space-y-8 pb-8">
        {/* Personalized Picks - only show if user is logged in */}
        <MovieRow
          title="Your Personalized Picks"
          movies={movieSections.personalized}
          onMovieClick={handleMovieClick}
          onViewAll={() => handleViewAll("personalized")}
        />

        {/* Top Box Office */}
        <MovieRow
          title="Top Box Office"
          movies={movieSections.topBoxOffice}
          onMovieClick={handleMovieClick}
          onViewAll={() => handleViewAll("box-office")}
        />

        {/* Coming Soon */}
        <MovieRow
          title="Coming Soon"
          movies={movieSections.comingSoon}
          onMovieClick={handleMovieClick}
          onViewAll={() => handleViewAll("coming-soon")}
        />

        {/* Browse by Genre */}
        <section className="py-6">
          <div className="px-4 mb-4">
            <h2 className="text-xl font-bold text-foreground">Browse by Genre</h2>
          </div>
          <div className="px-4 flex flex-wrap">
            {genres.map((genre) => (
              <GenreTag
                key={genre}
                genre={genre}
                onClick={() => handleGenreClick(genre)}
              />
            ))}
          </div>
        </section>

        {/* Trending Now */}
        <MovieRow
          title="Trending Now"
          movies={movieSections.trending}
          onMovieClick={handleMovieClick}
          onViewAll={() => handleViewAll("trending")}
        />
      </div>
    </div>
  );
}
