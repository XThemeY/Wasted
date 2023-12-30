import React, { useState } from "react";
import styles from "./Controls.module.scss";

import Favorite from "../../assets/icons/favoriteControl.svg";
import Planning from "../../assets/icons/planningControl.svg";
import tvControl from "../../assets/icons/tvControl.svg";

export default function Controls() {
  const [status, setStatus] = useState(0);
  const [planed, setPlaned] = useState(true);
  const [viewCount, setViewCount] = useState(0);
  const [favorite, setFavorite] = useState(false);

  function statusSet(n) {
    setStatus(n);
  }

  function addView() {
    setViewCount(viewCount + 1);
  }

  function addFavorite() {
    setFavorite(!favorite);
  }

  function planedSet(state = !planed) {
    setPlaned(state);
  }

  return (
    <section className={styles.block}>
      <button
        onClick={() => {
          addFavorite();
        }}
        className={`${styles.status_option} ${
          favorite ? styles.active__favorites : ""
        }`}
        title="Добавить в избранное"
      >
        <img className={styles.tv} src={Favorite} alt="" srcset="" />
        {/* {favorite ? "В избранном" : "В избранное"} */}
      </button>
      <button
        onClick={() => {
          statusSet(2);
          planedSet();
        }}
        className={`${styles.status_option} ${
          (status === 2) & planed ? styles.active__on_hold : ""
        }`}
        title="Буду смотреть"
      >
        <img className={styles.tv} src={Planning} alt="" srcset="" />
        {/* Буду смотреть */}
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
        <img className={styles.tv} src={tvControl} alt="" srcset="" />
        {/* Посмотрел {viewCount} раз(а) */}
      </button>
    </section>
  );
}
