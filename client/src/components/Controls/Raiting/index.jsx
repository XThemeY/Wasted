import React, { useState } from "react";
import styles from "./Raiting.module.scss";
import Poop from "../../../assets/icons/raiting/poop.svg";
import Pokerface from "../../../assets/icons/raiting/pokerface.svg";
import Beer from "../../../assets/icons/raiting/beer.svg";
import Good from "../../../assets/icons/raiting/good.svg";
import Favorite from "../../../assets/icons/raiting/favorite.svg";

export default function Raiting() {
  const [rating, setRating] = useState(0);

  function raitingSet(n) {
    setRating(n);
  }

  return (
    <section className={styles.block}>
      <button
        onClick={() => raitingSet(1)}
        className={`${styles.option} ${rating === 1 ? styles.active : ""}`}
      >
        <img src={Poop} alt="Poop" title="Дерьмо" className={styles.img} />
      </button>
      <button
        onClick={() => raitingSet(2)}
        className={`${styles.option} ${rating === 2 ? styles.active : ""}`}
      >
        <img
          src={Pokerface}
          alt="Pokerface"
          title="Зря потратил время"
          className={styles.img}
        />
      </button>
      <button
        onClick={() => raitingSet(3)}
        className={`${styles.option} ${rating === 3 ? styles.active : ""}`}
      >
        <img
          src={Beer}
          alt="Beer"
          title="Под пивко пойдёт"
          className={styles.img}
        />
      </button>
      <button
        onClick={() => raitingSet(4)}
        className={`${styles.option} ${rating === 4 ? styles.active : ""}`}
      >
        <img src={Good} alt="Good" title="Годнота" className={styles.img} />
      </button>
      <button
        onClick={() => raitingSet(5)}
        className={`${styles.option} ${rating === 5 ? styles.active : ""}`}
      >
        <img
          src={Favorite}
          alt="Favorite"
          title="Запало в душу"
          className={styles.img}
        />
      </button>
    </section>
  );
}
