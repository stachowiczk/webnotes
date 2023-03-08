import { configureStore } from "@reduxjs/toolkit";
import feedReducer from "../common/slices/feedSlice";

export const store = configureStore({
  reducer: {
    feed: feedReducer,
  },
});
