import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getChats = createAsyncThunk('getChats', async() => {
    const responce = await fetch(`${import.meta.env.VITE_BASE_URL}/chat/`, {
        method: 'GET',
        credentials: 'include',
        headers: {
                'Content-Type': 'application/json'
        }
    })
    const data = await responce.json();
    return data.data;
})

const initialState = {
    chats: [],
    loading: false,
    error: false,
    isChatPage: false
}

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers:{
        // getChats: (state, action) => {
        //     state.chats.push(action.payload);
        // }
        toggleChatPage: (state, action) => {
            state.isChatPage = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getChats.pending, (state, action) => {
            console.log("Fetching Chats....");
            state.loading = true;
        })
        builder.addCase(getChats.fulfilled, (state, action) => {
            state.chats = action.payload;
            state.loading = false;
            state.error = false;
        })
        builder.addCase(getChats.rejected, (state, action) => {
            console.error("Error fetching chats",)
            state.loading = false;
            state.error = true;
        })
    }
})

export const {toggleChatPage} = chatSlice.actions;

export default chatSlice.reducer;