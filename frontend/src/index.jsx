import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import App from "./App";
import "./styles/index.css";

const el = document.getElementById("root");

const root = ReactDOM.createRoot(el);

root.render(
	<Router>
		<ToastContainer />
		<App />
	</Router>
);
