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
      isEdited: null,
    },
  ],
  isLoaded: false,
  error: null,
  reload: false,
};

export const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setEntries: (state, action) => {
      state.entries = action.payload;
    },
    removeEntry: (state, action) => {
      state.entries = state.entries.filter(
        (entry) => entry.noteId !== action.payload
      );
    },
    setIsLoaded: (state, action) => {
      state.isLoaded = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setReload: (state, action) => {
      state.reload = !state.reload;
    },
    setExpanded: (state, action) => {
      state.entries[action.payload].isExpanded =
        !state.entries[action.payload].isExpanded;
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
    setIsEdited : (state, action) => {
      state.entries[action.payload].isEdited = !state.entries[action.payload].isEdited;
      
    },
  },
});

export const {
  setEntries,
  removeEntry,
  setIsLoaded,
  setError,
  setReload,
  setExpanded,
  expandAll,
  collapseAll,
  setIsEdited,
} = feedSlice.actions;

export default feedSlice.reducer;
