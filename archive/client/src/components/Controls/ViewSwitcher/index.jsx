import React from "react";
import styles from "./ViewSwitcher.module.scss";
import listSvg from "../../../assets/icons/list.svg";
import gridSvg from "../../../assets/icons/grid.svg";

export default function ViewSwitcher({ onChange, isList }) {
  const handleChange = () => {
    isList = !isList;
    onChange(isList);
  };

  return (
    <div className={styles.controls}>
      <div className="view__sorter">
        <ul>Сортировать по: Рейтингу</ul>
      </div>
      <div className={styles.switcher}>
        <button
          onClick={() => handleChange()}
          type="button"
          disabled={isList}
          className={`${styles.swithcher__btn} ${isList ? styles.active : ""}`}
        >
          <img src={listSvg} alt="list" />
        </button>
        <button
          onClick={() => handleChange()}
          type="button"
          disabled={!isList}
          className={`${styles.swithcher__btn} ${!isList ? styles.active : ""}`}
        >
          <img src={gridSvg} alt="grid" />
        </button>
      </div>
    </div>
  );
}
