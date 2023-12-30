import { useParams } from "react-router-dom";
import { React } from "react";
import { Link } from "react-router-dom";
import styles from "./MovieCard.module.scss";
import Favorite from "../../../assets/icons/raiting/favorite.svg";
import Controls from "../../Controls";
import Comments from "../../Comments";
import Raiting from "../../Controls/Raiting";

export default function Movie() {
  const { id } = useParams();
  return (
    <div className={`container movie__container`}>
      <section className={styles.movie}>
        <div className={styles.movie__poster}>
          <Link to="#">
            <img
              src="https://nichosee.com/posters/tt15257160.jpg"
              alt="poster"
            />
          </Link>
        </div>
        <div className={styles.content__block}>
          <div className={`${styles.wasted_raiting}`} data-content={"11000"}>
            <img src={Favorite} alt="Favorite" title="Запало в душу" />
          </div>
          <div className={styles.title__block}>
            <h2 className={styles.movie__title}>
              Голодные игры: Баллада о змеях и певчих птицах
            </h2>
            <span className={styles.movie__original_title}>
              The Hunger Games: The Ballad of Songbirds & Snakes
            </span>
          </div>

          <div className={styles.info__block}>
            <div className={`${styles.category}`}>
              <span className={styles.category__name}>Дата выхода:</span>
              <span className={styles.category__content}>
                <Link to="../year/2023">2023</Link>
              </span>
            </div>
            <div className={`${styles.category}`}>
              <span className={styles.category__name}>Страна:</span>
              <ul className={styles.movie__country_list}>
                <li key={"gb"}>
                  <Link to="../country/gb">Великобритания</Link>
                </li>
                <li key={"us"}>
                  <Link to="../country/us">{", "}США</Link>
                </li>
              </ul>
            </div>
            <div className={`${styles.category}`}>
              <span className={styles.category__name}>Жанр:</span>
              <ul className={styles.movie__genre_list}>
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
                  <Link to="../genre/thriller">{", "}триллер</Link>
                </li>
              </ul>
            </div>

            <div className={`${styles.category}`}>
              <span className={styles.category__name}>Режиссер:</span>
              <ul className={styles.movie__director_list}>
                <li key={"id"}>
                  <Link to="../people/:id">Фрэнк Дарабонт</Link>
                </li>
              </ul>
            </div>
            <div className={`${styles.category}`}>
              <span className={styles.category__name}>В ролях:</span>
              <ul className={styles.movie__actor_list}>
                <li key={"id"}>
                  <Link to="../people/:id">Тим Роббинс</Link>
                </li>
                <li key={"id"}>
                  <Link to="../people/:id">{", "}Морган Фриман</Link>
                </li>
              </ul>
            </div>
            <div className={`${styles.category}`}>
              <span className={styles.category__name}>Длительность:</span>
              <span>100 мин.</span>
            </div>

            <div className={`${styles.category} ${styles.imdb_rating}`}>
              <span className={styles.category__name}>IMDB:</span>
              <span className={styles.category__content} data-content={"15423"}>
                <Link to="https://imdb/tt1">8.9</Link>
              </span>
            </div>
            <div className={`${styles.category} ${styles.kinopoisk_rating}`}>
              <span className={styles.category__name}>Kinopoisk:</span>
              <span className={styles.category__content} data-content={"11000"}>
                <Link to="https://kinopoisk.ru/1">10</Link>
              </span>
            </div>
            <div
              className={`${styles.category} ${styles.rottenTomatoes_rating}`}
            >
              <span className={styles.category__name}>RottenTomatoes:</span>
              <span className={styles.category__content}>
                <Link to="https://www.rottentomatoes.com/">
                  Audience 73%/Critics 83%
                </Link>
              </span>
            </div>
            <div className={`${styles.category}`}>
              <span className={styles.category__name}>Посмотрело:</span>
              <span className={styles.category__content} data-content={"11000"}>
                1234
              </span>
            </div>
            <div className={`${styles.category}`}>
              <span className={styles.category__name}>Описание:</span>
              <article>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione
                numquam praesentium repudiandae laudantium incidunt mollitia
                iusto. Dolore eius architecto ad vero fuga debitis suscipit?
                Nulla maxime voluptatem nesciunt delectus doloremque? Aspernatur
                expedita, natus illo voluptates debitis aut. Laboriosam
                inventore possimus odit iste? Illum ipsum iste totam sapiente
                aliquam sunt illo corrupti rerum, quibusdam accusamus nesciunt?
                Saepe obcaecati pariatur nostrum itaque! Ducimus, architecto
                illum. Sequi ipsum, a voluptate quas maiores sed esse? Quae
                reiciendis in, at iusto quia cum quam dolorem eos eveniet a?
                Beatae, exercitationem omnis sapiente facere optio eaque.
              </article>
            </div>
            <div className={`${styles.category}`}>
              <span className={styles.category__name}>Теги:</span>
              <ul className={styles.movie__tag_list}>
                <li key={"id"}>
                  <Link to="../tag/:id">супергерои{", "}</Link>
                </li>
                <li key={"id"}>
                  <Link to="../tag/:id">ограбление</Link>
                </li>
                <li key={"id"}>
                  <Link to="../tag/:id">{", "}путешествия во времени</Link>
                </li>
                <li key={"id"}>
                  <Link to="../tag/:id">{", "}комиксы</Link>
                </li>
                <li key={"id"}>
                  <Link to="../tag/:id">{", "}Marvel</Link>
                </li>
                <li key={"id"}>
                  <Link to="../tag/:id">{", "}добрый</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Controls />
        <div className={styles.raiting}>
          <Raiting />
        </div>
      </section>
      <Comments />
    </div>
  );
}
