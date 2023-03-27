import { useEffect } from "react";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: localStorage.getItem("THEME"),
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("THEME", state.theme);
      document.body.classList.toggle("dark");
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
