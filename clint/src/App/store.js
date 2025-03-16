import {configureStore} from '@reduxjs/toolkit'
import homeSlice from '../Features/homeSlice'
import anotherUserSlice from '../Features/anotherUsersSlice'
import chatSlice from '../Features/chatSlice'

export const store = configureStore({
    reducer: {
        home: homeSlice,
        anotherUser: anotherUserSlice,
        chat: chatSlice
    }
})