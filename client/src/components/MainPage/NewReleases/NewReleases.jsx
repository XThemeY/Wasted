import React, { useState, useEffect } from "react";

export default function NewReleases() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Здесь вы можете получить данные, например, через API
    setMovies([
      { title: "Новый Фильм 1", year: 2023 },
      { title: "Новый Фильм 2", year: 2023 },
    ]);
  }, []);

  return (
    <div>
      <h2>Новинки</h2>
      <ul>
        {movies.map((movie, index) => (
          <li key={index}>
            <strong>{movie.title}</strong> - {movie.year}
          </li>
        ))}
      </ul>
    </div>
  );
}
