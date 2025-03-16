import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    anotherUserId: null,
    anotherUserProfile: false,
    isAnotherUserPage: false
}

const anotherUserSlice = createSlice({
    name: 'anotherUser',
    initialState,
    reducers: {
        setAnotherUserId: (state, action) => {
            state.anotherUserId = action.payload;
        },
        toggleAnotherUserProfile: (state, action) => {
            state.anotherUserProfile = action.payload;
        },
        toggleAnotherUserPage: (state, action) => {
            state.isAnotherUserPage = action.payload;
        }
    }
})

export const {setAnotherUserId, toggleAnotherUserProfile, toggleAnotherUserPage} = anotherUserSlice.actions

export default anotherUserSlice.reducer;