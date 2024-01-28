import React from "react";
import { Link } from "react-router-dom";
import styles from "./Profile.module.scss";

export default function Profile() {
  return (
    <div className={styles.profile}>
      <Link to="/auth/login" className={styles.login__btn}>
        Войти
      </Link>
      <div className={styles.profile}>
        {/*<div className={styles.avatar}>
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
        </Link> */}
      </div>
    </div>
  );
}
