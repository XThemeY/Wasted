import React, { useState } from "react";
import styles from "./CheckWatch.module.scss";
import EyeClosed from "../../../assets/icons/eyeClosed.svg";
import EyeOpen from "../../../assets/icons/eye.svg";

export default function CheckWatch() {
  const [check, setCheck] = useState(false);

  function checked() {
    setCheck(!check);
  }

  return (
    <div className={styles.watch_Status}>
      <button
        onClick={() => {
          checked();
        }}
        className={!check ? styles.active : ""}
        type="button"
        title="Не смотрел"
      >
        <img src={EyeClosed} alt="Not Watch" />
      </button>
      <button
        onClick={() => {
          checked();
        }}
        className={check ? styles.active : ""}
        type="button"
        title="Посмотрел"
      >
        <img src={EyeOpen} alt="Watched" />
      </button>
    </div>
  );
}
