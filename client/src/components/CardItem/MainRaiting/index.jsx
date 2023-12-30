import React from "react";
import styles from "./MainRaiting.module.scss";
import Poop from "../../../assets/icons/raiting/poop.svg";
import Pokerface from "../../../assets/icons/raiting/pokerface.svg";
import Beer from "../../../assets/icons/raiting/beer.svg";
import Good from "../../../assets/icons/raiting/good.svg";
import Favorite from "../../../assets/icons/raiting/favorite.svg";

const viewCounts = [1, 1, 1, 33, 7500];

export default function MainRaiting(props) {
  function renderSwitch(param) {
    const maxViews = Math.max(...param);
    console.log(maxViews);
    switch (true) {
      case maxViews >= 8000:
        return <img src={Favorite} alt="Favorite" title="Запало в душу" />;
      case maxViews >= 6000 && maxViews <= 7999:
        return <img src={Good} alt="Good" title="Годнота" />;
      case maxViews >= 4000 && maxViews <= 5999:
        return <img src={Beer} alt="Beer" title="Под пивко пойдет" />;
      case maxViews >= 2000 && maxViews <= 3999:
        return (
          <img src={Pokerface} alt="Pokerface" title="{Зря потратил время}" />
        );
      case maxViews <= 1999:
        return <img src={Poop} alt="Poop" title="Дерьмо" />;
      default:
        return "1111";
    }
  }

  return (
    <div
      className={`${styles.main_raiting}`}
      data-content={Math.max(...viewCounts)}
    >
      {renderSwitch(viewCounts)}
    </div>
  );
}
