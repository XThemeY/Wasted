import React from "react";
import { Link } from "react-router-dom";
import styles from "./Profile.module.scss";

export default function Profile() {
  return (
    <div className={styles.profile}>
      <Link to="/auth/login" className={styles.login__btn}>
        Войти
      </Link>
    </div>
  );
}
