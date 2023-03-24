import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  editorState: "",
  editingExisting: false,
  editedNoteId: null,
};

export const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    setEditorState: (state, action) => {
      state.editorState = action.payload;
    },
    setEditingExisting: (state, action) => {
      state.editingExisting = action.payload;
    },
    setEditedNoteId: (state, action) => {
      state.editedNoteId = action.payload;
    },
  },
});

export const { setEditorState, setEditingExisting, setEditedNoteId } = editorSlice.actions;

export default editorSlice.reducer;
