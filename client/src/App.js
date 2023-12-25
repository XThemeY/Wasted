import React from "react";
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import Movie from "./components/Movie";
import Colors from "./components/Colors.jsx";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={""}>
          {/* <Route index element={<Home />} /> */}
          <Route path="movie" element={<Movie />}>
            <Route path="movie/:id" element={"MOVIE ID"} />
          </Route>
          <Route path="tvshow" element={"tvshow"} />
          <Route path="game" element={"game"} />

          <Route path="*" element={"Такой страницы нет"} />
        </Route>
      </Routes>
      <Colors />
    </>
  );
}

export default App;
