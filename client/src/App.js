import { React } from "react";
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import Movie from "./components/Movie";
import MainMovies from "./pages/MainMovies.jsx";
import MainGames from "./pages/MainGames.jsx";
import MainShows from "./pages/MainShows.jsx";
import MainPage from "./pages/MainPage.jsx";
import Colors from "./components/Colors.jsx";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route index element={<MainPage />} />
        <Route path="/movie" element={<MainMovies />} />
        <Route path="movie/:id" element={<Movie />} />
        <Route path="tvshow" element={<MainShows />} />
        <Route path="tvshow/:id" element={"tvshow ID"} />
        <Route path="game" element={<MainGames />} />
        <Route path="game/:id" element={"game ID"} />
        <Route path="*" element={"Такой страницы нет"} />
      </Routes>
      <Colors />
    </>
  );
}

export default App;
