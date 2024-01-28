import React from "react";
import { Form } from "react-router-dom";
import { ReactComponent as ArrowDownIcon } from "../../../assets/icons/chevron-down-outline.svg";
import styles from "./Login.module.scss";

export default function Login() {
  return (
    <div>
      <form action="">
        <input type="email" name="Email" id="" />
        <input type="password" name="Password" id="" />
      </form>
    </div>
  );
}
