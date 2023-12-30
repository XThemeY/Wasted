import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as ArrowDownIcon } from "../../../assets/icons/chevron-down-outline.svg";
import styles from "./Login.module.scss";

export default function Login() {
  return (
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
  );
}
