import React, { useState } from "react";
import axios from "../axios";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  function handleSubmit(e) {
    e.preventDefault();
    axios("/v1/checkIfUsersExist", {
      email: email,
    });
  }
  return (
    <>
      <form className="messanger__sign__form">
        {/* <input type="text" placeholder="User Name" /> */}

        <div className="messanger__sign__form__heading">Login to whatsapp</div>
        <input
          type="email"
          placeholder="User Name"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button type="button" onClick={handleSubmit}>
          Login
        </button>
      </form>
    </>
  );
}
