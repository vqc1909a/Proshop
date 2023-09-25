import {createSlice} from "@reduxjs/toolkit";

const errorSlice = createSlice({
    name: "error",
    initialState: {
        message: ""
    },
    reducers: {
        saveMessage: (state, action) => {
            state.message = action.payload;
        }
    }
})

export const {saveMessage} = errorSlice.actions;

export default errorSlice.reducer;