import { React } from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.scss";
import Profile from "../Profile";
import Navigation from "./Navigation";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.header__container}`}>
        <div className={styles.logo}>
          <Link to="/" className={""}>
            <img
              src="https://psv4.userapi.com/c909218/u10028980/docs/d37/a6d6c5635d76/logo.png"
              alt="Logo"
            />
          </Link>
        </div>
        <Navigation />
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
        <Profile />
      </div>
    </header>
  );
}
