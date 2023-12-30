import React from "react";
import styles from "./Layout.module.scss";
import MovieCard from "./Movie";
import listSvg from "../../assets/icons/list.svg";
import gridSvg from "../../assets/icons/grid.svg";

export default function Layout() {
  return (
    <div className={styles.content__wrapper}>
      <div className={styles.view__controls}>
        <div className="view__sorter">
          <ul>Сортировать по: Рейтингу</ul>
        </div>
        <div className={styles.view__switcher}>
          <button type="button" className={styles.swithcher__btn}>
            <img src={listSvg} alt="list" />
          </button>
          <button
            type="button"
            className={`${styles.swithcher__btn} ${styles.active}`}
          >
            <img src={gridSvg} alt="grid" />
          </button>
        </div>
      </div>

      <div className={`${styles.grid_view} ${styles.active}`}>
        <MovieCard grid={true} />
        <MovieCard grid={true} />
        <MovieCard grid={true} />
        <MovieCard grid={true} />
        <MovieCard grid={true} />
        <MovieCard grid={true} />
        <MovieCard grid={true} />
        <MovieCard grid={true} />
        <MovieCard grid={true} />
        <MovieCard grid={true} />
        <MovieCard grid={true} />
        <MovieCard grid={true} />
        <MovieCard grid={true} />
        <MovieCard grid={true} />
      </div>
      <div className={`${styles.list_view}`}></div>
    </div>
  );
}
