import React from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.scss";
import { ReactComponent as ArrowDownIcon } from "../../assets/icons/chevron-down-outline.svg";

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/" className={""}>
            <img src="./assets/logo.png" alt="Logo" />
          </Link>
        </div>
        <nav className={""}>
          <ul className={styles.nav}>
            <li className={`${styles.nav__item} ${styles.active}`} key={""}>
              <Link to="/">Главная</Link>
            </li>
            <li className={styles.nav__item} key={""}>
              <Link to="/movie">Фильмы</Link>
            </li>
            <li className={styles.nav__item} key={""}>
              <Link to="/tvshow">Шоу</Link>
            </li>
            <li className={styles.nav__item} key={""}>
              <Link to="/game">Игры</Link>
            </li>
          </ul>
        </nav>
        <form className={styles.searchForm} action="#">
          <label htmlFor="search">
            <input
              type="search"
              name="search"
              id="search"
              placeholder="Поиск"
              className={styles.search}
            />
          </label>
        </form>
        <div className={styles.profile}>
          <div className={styles.avatar}>
            <Link to="/profile">
              <img
                src="https://placehold.co/100x100/orange/png"
                alt="Avatar"
                srcSet={""}
              />
            </Link>
          </div>{" "}
          <Link to="/profile">
            <ArrowDownIcon
              className="icon--arrow-down"
              fill={"none"}
              stroke={"black"}
              width={"20px"}
            />{" "}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
