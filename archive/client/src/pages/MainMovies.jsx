import React, { useEffect } from "react";
import Layout from "../components/PageItem/";
import AsideBlock from "../components/AsideBlock";
import axios from "axios";

export default function MainMovies() {
  useEffect(() => {
    async function fetchData() {
      const response = await axios.get("http://localhost:5000/movie/");
      console.log(response.data);
    }
    fetchData();
  });
  return (
    <main className="wrapper">
      <div className="container movies__container">
        <AsideBlock />
        <Layout />
      </div>
    </main>
  );
}
