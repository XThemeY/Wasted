import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navigation.module.scss";

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? `${styles.nav__item} ${styles.active}` : styles.nav__item
        }
      >
        Главная
      </NavLink>
      <NavLink
        to="/movie"
        className={({ isActive }) =>
          isActive ? `${styles.nav__item} ${styles.active}` : styles.nav__item
        }
      >
        Фильмы
      </NavLink>
      <NavLink
        to="/tvshow"
        className={({ isActive }) =>
          isActive ? `${styles.nav__item} ${styles.active}` : styles.nav__item
        }
      >
        Шоу
      </NavLink>
      <NavLink
        to="/game"
        className={({ isActive }) =>
          isActive ? `${styles.nav__item} ${styles.active}` : styles.nav__item
        }
      >
        Игры
      </NavLink>
    </nav>
  );
}
