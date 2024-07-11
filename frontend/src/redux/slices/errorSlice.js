import {createSlice} from "@reduxjs/toolkit";

const errorSlice = createSlice({
    name: "error",
    initialState: {
        message: ""
    },
    reducers: {
        clearMessage: (state) => {
            state.message = "";
        },
        saveMessage: (state, action) => {
            state.message = action.payload;
        }
    }
})

export const {saveMessage, clearMessage} = errorSlice.actions;

export default errorSlice.reducer;