import React from "react";
import ReactDOM from "react-dom/client";
import "./modules/app/index.css";
import App from "./modules/app/components/App.js";
import { store } from "./modules/app/store.js";
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
