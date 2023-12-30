import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Movie.module.scss";

import Raiting from "../../Controls/Raiting";
import CheckWatch from "../../Controls/CheckWatch";

export default function MovieCard(props) {
  return (
    <div className={styles.card}>
      <div className={styles.poster}>
        <Link to="1">
          <img src="https://placehold.co/600x900" alt="poster" />
        </Link>
      </div>
      <div className={`${styles.overlay} `}>
        <div className={styles.content}>
          <div className={styles.title__block}>
            <Link to=":id" className={styles.title}>
              Голодные игры: Баллада о змеях и певчих птицах
            </Link>

            <span className={styles.original_title}>
              The Hunger Games: The Ballad of Songbirds & Snakes
            </span>
          </div>
          <div className={styles.info__block}>
            <div className={`${styles.category}`}>
              Год выхода:
              <span>
                <Link to="../year/2023">2023</Link>
              </span>
            </div>
            <div className={styles.category}>
              Страна:
              <ul>
                <li key={"gb"}>
                  <Link to="../country/gb">Великобритания{","}</Link>
                </li>
                <li key={"us"}>
                  <Link to="../country/us">США</Link>
                </li>
              </ul>
            </div>
            <div className={`${styles.category}`}>
              Жанр:
              <ul>
                <li key={"drama"}>
                  <Link to="../genre/drama">драма</Link>
                </li>
                <li key={"action"}>
                  <Link to="../genre/action">{", "}боевик</Link>
                </li>
                <li key={"criminal"}>
                  <Link to="../genre/criminal">{", "}криминал</Link>
                </li>
                <li key={"thriller"}>
                  <Link to="../genre/thriller">триллер</Link>
                </li>
              </ul>
            </div>
            <div className={styles.runtime_kinopoisk}>
              Рейтинг Kinopoisk: <span>8.9</span>
            </div>
            <div className={styles.raiting_imdb}>
              Рейтинг IMDB: <span>8.9</span>
            </div>
            <div className={styles.runtime}>
              Длительность: <span>100 мин.</span>
            </div>
          </div>
          <CheckWatch />
          <Raiting />
        </div>
      </div>
    </div>
  );
}
