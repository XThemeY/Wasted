import { React } from "react";
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import Movie from "./components/CardItem/Movie";
import MainMovies from "./pages/MainMovies.jsx";
import MainGames from "./pages/MainGames.jsx";
import MainShows from "./pages/MainShows.jsx";
import MainPage from "./pages/MainPage.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import Login from "./components/Profile/Login";
import Registration from "./pages/ErrorPage.jsx";
import Colors from "./components/Colors.jsx";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/registration" element={<Registration />} />
        <Route path="movie" element={<MainMovies />} />
        <Route path="movie/:id" element={<Movie />} />
        <Route path="tvshow" element={<MainShows />} />
        <Route path="tvshow/:id" element={"tvshow ID"} />
        <Route path="game" element={<MainGames />} />
        <Route path="game/:id" element={"game ID"} />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <Colors />
    </>
  );
}

export default App;
