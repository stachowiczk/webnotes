import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sharedNotes: [
    {
      key: null,
      noteId: null,
      created_at: null,
      title: null,
      content: null,
      isExpanded: false,
      isEdited: null,
      can_edit: null,
      shared_by: null,
      status: null,
      share_id: null,
    },
  ],
  isLoaded: false,
  error: null,
  reload: false,
};

export const sharedSlice = createSlice({
  name: "shared",
  initialState,
  reducers: {
    setSharedNotes: (state, action) => {
      state.sharedNotes = action.payload;
    },
    removeSharedNote: (state, action) => {
      state.sharedNotes = state.sharedNotes.filter(
        (note) => note.noteId !== action.payload
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
      state.sharedNotes[action.payload].isExpanded =
        !state.sharedNotes[action.payload].isExpanded;
    },
    expandAll: (state) => {
      state.sharedNotes.forEach((note) => {
        note.isExpanded = true;
      });
    },
    collapseAll: (state) => {
      state.sharedNotes.forEach((note) => {
        note.isExpanded = false;
      });
    },
    setIsEdited: (state, action) => {
      state.sharedNotes[action.payload].isEdited =
        !state.sharedNotes[action.payload].isEdited;
    },
  },
});

export const {
  setSharedNotes,
  removeSharedNote,
  setIsLoaded,
  setError,
  setReload,
  setExpanded,
  expandAll,
  collapseAll,
  setIsEdited,
} = sharedSlice.actions;

export default sharedSlice.reducer;
