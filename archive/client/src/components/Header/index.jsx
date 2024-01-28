import { React } from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.scss";
import Profile from "../Profile";
import Navigation from "./Navigation";
import LogoImg from "../../assets/logo.png";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.header__container}`}>
        <div className={styles.logo}>
          <Link to="/" className={""}>
            <img src={LogoImg} alt="Logo" />
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
