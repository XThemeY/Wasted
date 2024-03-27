import React from "react";
import styles from "./BugReport.module.scss";

export default function BugReport() {
  return (
    <button type="button" className={styles.bug_Report}>
      Сообщить об ошибке
    </button>
  );
}
