import React from "react";
import { Link } from "react-router-dom";
import styles from "./Comment.module.scss";
import smileIcon from "../../../assets/icons/smile.svg";

export default function Comments() {
  return (
    <section className={styles.section__comment}>
      <div className={styles.comment__user}>
        <div className={styles.comment__avatar}>
          <img src="https://placehold.co/100x100/orange/png" alt="Avatar" />
        </div>
        <div className={styles.user__wrapper}>
          <Link to="#" className={styles.comment__userlink}>
            XTheme
          </Link>
          <div className={styles.comment__createdAt}>
            10.12.2023 20:30,{" "}
            <Link to="#" className={styles.comment__link}>
              #
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.comment__body}>
        Мотивация вполне соответствует реалиям, в угон самолета ради любви,
        справедливости и прочего никто не поверит, наш мир устроен так. Жаль что
        в сериале обыграли только деньги, а не власть и влияние разных стран
        друг на друга, но и там бы все вылиось в деньги или эквиваленты.
      </div>

      <div className={styles.comment__reply}>
        <button className={styles.reply_btn} type="button">
          Ответить
        </button>
        <button className={styles.smile_btn} type="button">
          <img src={smileIcon} alt="Smile" />
        </button>
        <button className={styles.options_btn} type="button">
          ...
        </button>
        <ul>
          <li>
            <button type="button">
              <img src={require("../../../assets/emoji/+1.png")} alt="" />
            </button>
          </li>
          <li>
            <button type="button">
              <img src={require("../../../assets/emoji/fire.png")} alt="" />
            </button>
          </li>
          <li>
            <button type="button">
              <img src={require("../../../assets/emoji/heart.png")} alt="" />
            </button>
          </li>
          <li>
            <button type="button">
              <img src={require("../../../assets/emoji/muscle.png")} alt="" />
            </button>
          </li>
          <li>
            <button type="button">
              <img src={require("../../../assets/emoji/joy.png")} alt="" />
            </button>
          </li>
          <li>
            <button type="button">
              <img
                src={require("../../../assets/emoji/heart_eyes.png")}
                alt=""
              />
            </button>
          </li>
          <li>
            <button type="button">
              <img
                src={require("../../../assets/emoji/broken_heart.png")}
                alt=""
              />
            </button>
          </li>
          <li>
            <button type="button">
              <img
                src={require("../../../assets/emoji/clown_face.png")}
                alt=""
              />
            </button>
          </li>
          <li>
            <button type="button">
              <img
                src={require("../../../assets/emoji/dizzy_face.png")}
                alt=""
              />
            </button>
          </li>
          <li>
            <button type="button">
              <img
                src={require("../../../assets/emoji/face_with_symbols_on_mouth.png")}
                alt=""
              />
            </button>
            <span>123233</span>
          </li>
          <li>
            <button type="button">
              <img src={require("../../../assets/emoji/grin.png")} alt="" />
            </button>
            <span>1233</span>
          </li>
          <li>
            <button type="button">
              <img
                src={require("../../../assets/emoji/neutral_face.png")}
                alt=""
              />
            </button>
            <span>1</span>
          </li>
          <li>
            <button type="button">
              <img
                src={require("../../../assets/emoji/face_vomiting.png")}
                alt=""
              />
            </button>
            <span>12</span>
          </li>
        </ul>
      </div>
      <div className={styles.section__replies}></div>
    </section>
  );
}
