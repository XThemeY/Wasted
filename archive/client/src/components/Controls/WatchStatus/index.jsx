import React, { useState } from "react";
import styles from "./WatchControls.module.scss";

import Favorite from "../../../assets/icons/favoriteControl.svg";
import Planning from "../../../assets/icons/planningControl.svg";
import tvControl from "../../../assets/icons/tvControl.svg";

export default function Controls() {
  const [status, setStatus] = useState(0);
  const [planed, setPlaned] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [favorite, setFavorite] = useState(false);

  function statusSet(n) {
    setStatus(n);
  }

  function addView() {
    viewCount >= 100 ? setViewCount(viewCount) : setViewCount(viewCount + 1);
  }

  function addFavorite() {
    setFavorite(!favorite);
  }

  function planedSet(state) {
    setPlaned(state);
  }

  return (
    <section className={styles.block}>
      <button
        onClick={() => {
          addFavorite();
          planedSet(false);
        }}
        className={`${styles.status_option} ${
          favorite ? styles.active__favorites : ""
        }`}
        title="Добавить в избранное"
      >
        <img
          className={`${styles.icon} ${styles.favorite}`}
          src={Favorite}
          alt="Избранное"
        />
      </button>
      <button
        onClick={() => {
          statusSet(2);
          planedSet(!planed);
        }}
        className={`${styles.status_option}  ${
          (status === 2) & planed ? styles.active__on_hold : ""
        }`}
        title="Буду смотреть"
      >
        <img
          className={`${styles.icon} ${styles.on_hold}`}
          src={Planning}
          alt="В планах"
        />
      </button>
      <button
        onClick={() => {
          statusSet(3);
          addView();
          planedSet(false);
        }}
        className={`${styles.status_option} ${
          status === 3 ? styles.active__watched : ""
        }`}
        title="Добавить в просмотренные"
      >
        <img
          className={`${styles.icon} ${styles.watched}`}
          src={tvControl}
          alt="Посмотрел"
        />

        <span
          title={viewCount >= 100 ? "Достигнут максимум просмотров" : ""}
          className={styles.counter}
        >
          {viewCount}
        </span>
      </button>
    </section>
  );
}
