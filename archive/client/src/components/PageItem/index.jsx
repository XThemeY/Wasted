import React, { useState } from "react";
import styles from "./Layout.module.scss";
import ListView from "./Movie/ViewTemplate/ListView";
import GridView from "./Movie/ViewTemplate/GridView";
import ViewSwitcher from "../Controls/ViewSwitcher";

export default function Layout() {
  const [isList, setIsList] = useState(true);
  const movieCard = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  ];
  const isListChange = (isList) => {
    setIsList(isList);
  };

  return (
    <div className={styles.wrapper}>
      <ViewSwitcher onChange={isListChange} isList={isList} />
      <div className={`${styles.list_view} ${isList ? styles.active : ""}`}>
        {isList
          ? movieCard.map(({}, index) => {
              return <ListView key={index} isList={isList} />;
            })
          : ""}
      </div>
      <div className={`${styles.grid_view} ${!isList ? styles.active : ""}`}>
        {!isList
          ? movieCard.map(({}, index) => {
              return <GridView key={index} isList={isList} />;
            })
          : ""}
      </div>
    </div>
  );
}
