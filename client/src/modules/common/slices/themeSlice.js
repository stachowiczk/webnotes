import { createSlice } from "@reduxjs/toolkit";

const LOCAL_STORAGE_THEME_KEY = "theme";
const initialState = {
  theme: localStorage.getItem(LOCAL_STORAGE_THEME_KEY),
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem(LOCAL_STORAGE_THEME_KEY, state.theme);
    },
  },
});

export const { toggleTheme, loadTheme } = themeSlice.actions;

export default themeSlice.reducer;
