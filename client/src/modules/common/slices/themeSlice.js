import { createSlice } from "@reduxjs/toolkit";

const LOCAL_STORAGE_THEME_KEY = "theme";
const LOCAL_STORAGE_SHOW_EDITOR = "hideEditor";

const getPreferredTheme = () => {
  const storedTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
  if (storedTheme) return storedTheme;
  const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  return darkModeMediaQuery.matches ? "dark" : "light";
};

const initialState = {
  theme: getPreferredTheme(),
  mobile: (window.innerWidth < 960),
  showEditor: true || localStorage.getItem(LOCAL_STORAGE_SHOW_EDITOR),
  leftWidth: window.innerWidth/4,
};


export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem(LOCAL_STORAGE_THEME_KEY, state.theme);
    },
    toggleShowEditor: (state, action) => {
      if (action.payload !== undefined) {
        state.showEditor = action.payload;
        localStorage.setItem(LOCAL_STORAGE_SHOW_EDITOR, state.showEditor);
      } else
      state.showEditor = !state.showEditor;
      localStorage.setItem(LOCAL_STORAGE_SHOW_EDITOR, state.showEditor);
    },
    setLeftWidth: (state, action) => {
      state.leftWidth = action.payload;
    },
    setIsMobile: (state) => {
      state.mobile = (window.innerWidth < 960)
    },

  },
});

export const { toggleTheme, toggleShowEditor, setLeftWidth, setIsMobile } =
  themeSlice.actions;

export default themeSlice.reducer;
