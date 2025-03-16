import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export const getUserDetails = createAsyncThunk('getUserDetails', async (id) => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/${id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
    })

    const data = await response.json();
    // console.log(data.data);
    
    const followersId = data.data.followers.map((follower) => {
        return follower.followers;
    })

    // console.log(followers);
    const followersDetails = await Promise.all(
        followersId.map(async (followerId) => {
            // console.log(followerId);
            const responce = await fetch(`${import.meta.env.VITE_BASE_URL}/user/${followerId}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const data = await responce.json();
            return data.data;
        })
    )    

    // console.log(followersDetails.length);
    let allUsers;
    if(followersDetails.length <= 3){
        const responce = await fetch(`${import.meta.env.VITE_BASE_URL}/user/getallusers`,{
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await responce.json();
        allUsers = data.data;
        // followersDetails.map()
    }
    

    const timeLinePost = await fetch(`${import.meta.env.VITE_BASE_URL}/post/${id}/timelinepost`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
    })

    const timeLinePostInfo = await timeLinePost.json();
    // console.log(timeLinePostInfo);

    return {data, followersDetails, timeLinePostInfo, allUsers};
})


const initialState = {
    isSignup: true,
    user: null,
    followers: [],
    timelinePost: null,
    profilePage: false,
    isLoading: false,
    isError: false,
    initialLoadComplete: false,
    profileCardVisible: true,
    rightSideVisible: true
}

const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        toggleSignup: (state, _) => {
            state.isSignup = !state.isSignup;
        },
        toggleProfilePage: (state, action) => {
            state.profilePage = action.payload;
        },
        // MOBILE VIEW
        toggleProfileCardVisible: (state, action) => {
            state.profileCardVisible = action.payload;
            
        },
        // MOBILE VIEW
        toggleRightSideVisible: (state, action) => {
            state.rightSideVisible = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getUserDetails.pending, (state, action) => {
            console.log("Fetching user details...");
            if (!state.initialLoadComplete) {
                state.isLoading = true;
            }
            state.isError = false;
        })
        builder.addCase(getUserDetails.fulfilled, (state, action) => {
            state.user = action.payload.data.data;
            state.followers = action.payload.followersDetails;
            state.timelinePost = action.payload.timeLinePostInfo.data; 
            if(state.followers.length <= 3){
                const temp = action.payload.allUsers.filter(
                    (user) => !state.followers.some((follower) => follower._id === user._id)
                )
                state.followers = state.followers.concat(temp);
            }
            
            state.isLoading = false;
            state.initialLoadComplete = true;
            state.isError = false;
                  
        })
        builder.addCase(getUserDetails.rejected, (state, action) => {
            console.error("Error fetching user:");
            state.isError = true;
            state.isLoading = false;
            state.initialLoadComplete = true;
        })
    }
})

export const { toggleSignup, toggleProfilePage, toggleProfileCardVisible, toggleRightSideVisible } = homeSlice.actions;

export default homeSlice.reducer;