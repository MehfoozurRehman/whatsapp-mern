import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "../axios";

export default function Auth({ setUserName }) {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  function handleSubmit(e) {
    e.preventDefault();
    setUserName(email);
    localStorage.setItem("user", email);
    history.push("/dashboard");
    // axios("/v1/checkIfUsersExist", {
    //   email: email,
    //   password: password,
    // });
  }
  console.log(email);
  return (
    <form className="messanger__sign__form" onSubmit={handleSubmit}>
      {/* <input type="text" placeholder="User Name" /> */}

      <div className="messanger__sign__form__heading">Lets get started</div>
      <input
        type="text"
        placeholder="User Name"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        required
      />
      {/* <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        /> */}
      <button type="submit">Login</button>
    </form>
  );
}
