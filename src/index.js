import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "react-resizable/css/styles.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { WebSocketProvider } from "./context/websoket.context";
import Layout from "./layout/Layout";
import { AuthProvider } from "./context/auth.context";
import { SeatProvider } from "./context/seat.context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <WebSocketProvider>
    <AuthProvider>
      <SeatProvider>
        <App />
      </SeatProvider>
    </AuthProvider>
  </WebSocketProvider>
);

reportWebVitals();
