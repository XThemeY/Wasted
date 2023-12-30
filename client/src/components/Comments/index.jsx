import React from "react";
import styles from "./Comments.module.scss";
import addImageIcon from "../../assets/icons/images-outline.svg";
import Comment from "./Comment";

export default function Comments() {
  return (
    <section className={styles.discussion}>
      <div className={styles.section__title}>N комментариев</div>
      <form className={styles.form} action="#" method="post">
        <textarea
          className={styles.form__input}
          placeholder="Оставить комментарий..."
          type="text"
          name="comment"
          id=""
        />
        <div className={styles.form__controls}>
          <button className={styles.form__btn} type="submit" value="Submit">
            Отправить
          </button>
          <button className={styles.form__addImage_btn} type="button">
            <img src={addImageIcon} alt="addImage" />
          </button>
        </div>
      </form>
      <section className={styles.section__comments}>
        <Comment />
        <Comment />
        <Comment />
      </section>
    </section>
  );
}
