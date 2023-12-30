import React from "react";
import Layout from "../components/PageItem/";
import AsideBlock from "../components/AsideBlock";

export default function MainMovies() {
  return (
    <main className="wrapper">
      <div className="container movies__container">
        <AsideBlock />
        <Layout />
      </div>
    </main>
  );
}
