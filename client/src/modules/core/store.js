import { configureStore } from "@reduxjs/toolkit";
import feedReducer from "../common/slices/feedSlice";
import editorReducer from "../common/slices/editorSlice";
import themeReducer from "../common/slices/themeSlice";
import sharedReducer from "../common/slices/sharedSlice";

export const store = configureStore({
  reducer: {
    feed: feedReducer,
    editor: editorReducer,
    theme: themeReducer,
    shared: sharedReducer,
  },
});
