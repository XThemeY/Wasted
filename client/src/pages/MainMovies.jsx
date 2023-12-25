import React from "react";
import MovieCard from "../components/MovieCard";

function MainMovies() {
  return (
    <main className="movies">
      <div className="container movies__container">
        <MovieCard />
        <MovieCard />
        <MovieCard />
        <MovieCard />
        <MovieCard />
        <MovieCard />
        <MovieCard />
        <MovieCard />
        <MovieCard />
        <MovieCard />
      </div>
    </main>
  );
}

export default MainMovies;
