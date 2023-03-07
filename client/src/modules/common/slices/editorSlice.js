import { createSlice } from "@reduxjs/toolkit";
import { EditorState, convertToRaw} from "draft-js";

const initialState = {
    currentEditorStateString: null,
};

export const editorSlice = createSlice({
    name: "editor",
    initialState,
    reducers: {
        setCurrentEditorState: (state, action) => {
            state.currentEditorStateString = action.payload;
        },
    },
    
});

export const { setCurrentEditorState } = editorSlice.actions;

export default editorSlice.reducer;