import React from "react";
import ReactDOM from "react-dom/client";
import "./modules/core/index.css";
import App from "./modules/core/components/App.js";
import { store } from "./modules/core/store.js";
import { Provider } from "react-redux";
import { Quill } from "react-quill";
const Fonts = Quill.import("formats/font");
Fonts.whitelist = [
  "Roboto",
  "Lato",
  "Lora",
  "Inconsolata",
];
Quill.register(Fonts, true);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
