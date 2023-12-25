import { React, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.scss";
import { ReactComponent as ArrowDownIcon } from "../../assets/icons/chevron-down-outline.svg";

function Header() {
  const [activeIndex, setActiveIndex] = useState(0);
  console.log(activeIndex);
  const onClickNav = (index) => {
    setActiveIndex(index);
  };
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
            <li
              onClick={() => onClickNav(0)}
              className={`${styles.nav__item} ${
                activeIndex === 0 ? styles.active : ""
              }`}
              key={""}
            >
              <Link to="/">Главная</Link>
            </li>
            <li
              onClick={() => onClickNav(1)}
              className={`${styles.nav__item} ${
                activeIndex === 1 ? styles.active : ""
              }`}
              key={""}
            >
              <Link to="/movie">Фильмы</Link>
            </li>
            <li
              onClick={() => onClickNav(2)}
              className={`${styles.nav__item} ${
                activeIndex === 2 ? styles.active : ""
              }`}
              key={""}
            >
              <Link to="/tvshow">Шоу</Link>
            </li>
            <li
              onClick={() => onClickNav(3)}
              className={`${styles.nav__item} ${
                activeIndex === 3 ? styles.active : ""
              }`}
              key={""}
            >
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
        <div
          onClick={() => onClickNav(4)}
          className={`${styles.profile} ${
            activeIndex === 4 ? styles.active : ""
          }`}
        >
          <div className={styles.avatar}>
            <Link to="/profile">
              <img
                src="https://placehold.co/100x100/orange/png"
                alt="Avatar"
                srcSet={""}
              />
            </Link>
          </div>
          <Link to="/profile">
            <ArrowDownIcon
              className="icon--arrow-down"
              fill={"none"}
              stroke={"black"}
              width={"20px"}
            />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
