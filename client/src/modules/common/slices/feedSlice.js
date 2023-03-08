import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  entries: [
    {
      key: null,
      noteId: null,
      created_at: null,
      title: null,
      content: null,
      isExpanded: false,
    },
  ],
  isLoaded: false,
  error: null,
};

export const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setEntries: (state, action) => {
      state.entries = action.payload;
    },
    setIsLoaded: (state, action) => {
      state.isLoaded = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setExpanded: (state, action ) => {
      state.entries[action.payload].isExpanded = !state.entries[action.payload].isExpanded;
    },
    expandAll: (state) => {
      state.entries.forEach((entry) => {
        entry.isExpanded = true;
      });
    },
    collapseAll: (state) => {
        state.entries.forEach((entry) => {
            entry.isExpanded = false;
        });
        },

  },
});

export const {
  setEntries,
  setIsLoaded,
  setError,
  setExpanded,
  expandAll,
  collapseAll,
} = feedSlice.actions;

export default feedSlice.reducer;
