import React, { useEffect, useState } from "react";
import "./App.scss";
import Auth from "./Components/Auth";
import Messanger from "./Screens/Messsanger";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import axios from "./axios";

function Loading() {
  return (
    <div style={{ color: "#ffffff" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        // xmlns:xlink="http://www.w3.org/1999/xlink"
        style={{
          margin: "auto",
          background: "none",
          display: "block",
          shapeRendering: "auto",
        }}
        width={200}
        height={200}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
      >
        <circle
          cx="50"
          cy="50"
          r="26"
          strokeWidth="7"
          stroke="#056162"
          strokeDasharray="40.840704496667314 40.840704496667314"
          fill="none"
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            repeatCount="indefinite"
            dur="2.272727272727273s"
            keyTimes="0;1"
            values="0 50 50;360 50 50"
          ></animateTransform>
        </circle>
      </svg>
    </div>
  );
}

function App() {
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("ali");

  useEffect(() => {
    axios.get("/v1/findAllRooms").then((res) => {
      setLoading(false);
      setRooms(res.data);
    });
    axios.get("/v1/findAllMessages").then((res) => {
      setMessages(res.data);
    });
  }, []);

  return (
    <Router>
      <Switch>
        {/* <Route path="/">
          <Auth />
        </Route> */}
        <Route path="/">
          {loading ? (
            <Loading />
          ) : (
            <Messanger
              messages={messages}
              rooms={rooms}
              axios={axios}
              userName={userName}
            />
          )}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
