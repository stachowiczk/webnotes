import { createSlice } from "@reduxjs/toolkit";

const LOCAL_STORAGE_THEME_KEY = "theme";
const LOCAL_STORAGE_SHOW_EDITOR = "showEditor";


function isMobile() {
  if (window.innerWidth > 900) {
    return false;
  } else {
    return true;
  }
}
const initialState = {
  theme: localStorage.getItem(LOCAL_STORAGE_THEME_KEY),
  mobile: isMobile(),
  showEditor: false,
  
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem(LOCAL_STORAGE_THEME_KEY, state.theme);
    },
    toggleShowEditor: (state) => {
      state.showEditor = !state.showEditor;
      localStorage.setItem(LOCAL_STORAGE_SHOW_EDITOR, state.showEditor);
    }
  },
});

export const { toggleTheme, toggleShowEditor } = themeSlice.actions;

export default themeSlice.reducer;
