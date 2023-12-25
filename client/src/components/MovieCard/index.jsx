import { React } from "react";
import { Link } from "react-router-dom";
import styles from "./MovieCard.module.scss";
// import { ReactComponent as ArrowDownIcon } from "../../assets/icons/chevron-down-outline.svg";

function MovieCard() {
  return (
    <div className={styles.card}>
      <div className={styles.card__poster}>
        <Link to="1">
          <img src="https://placehold.co/600x900" alt="poster" />
        </Link>
      </div>
      <div className={styles.content__block}>
        <div className={styles.title__block}>
          <Link to="1" className={styles.card__title}>
            Голодные игры: Баллада о змеях и певчих птицах
          </Link>
          <label className={styles.wasted_rating}>
            <span>8.9</span>
          </label>
          <span className={styles.card__original_title}>
            The Hunger Games: The Ballad of Songbirds & Snakes
          </span>
        </div>
        <div className={styles.info__block}>
          <span className={styles.card__year}>
            <span>2023, </span>
            <span>Великобритания, США. </span>
            <span>Драма, Боевик, Криминал, Триллер</span>
          </span>

          <span className={styles.card__genre}>
            Режиссер: <span>Фрэнк Дарабонт</span>
          </span>
          <span className={styles.card__genre}>
            В ролях: <span>Тим Роббинс, Морган Фриман</span>
          </span>
          <span className={styles.card__runtime}>
            Длительность: <span>100 мин.</span>
          </span>
        </div>

        <div className={styles.card__controls}>
          <div
            className={`${styles.card__watched} ${styles.card__controls_item}`}
          >
            <span>Посмотрел</span>
          </div>
          <div
            className={`${styles.card__favorites} ${styles.card__controls_item}`}
          >
            <span>В избранное</span>
          </div>

          <div
            className={`${styles.card__planning} ${styles.card__controls_item}`}
          >
            <span>Буду смотреть</span>
          </div>
        </div>
      </div>
      <div className={styles.raiting__block}>
        <label className={styles.imdb_rating}>
          <span>8.9</span>
        </label>
        <label className={styles.kinopoisk_rating}>
          <span>8.9</span>
        </label>
      </div>
    </div>
  );
}

export default MovieCard;
