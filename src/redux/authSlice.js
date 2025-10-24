import {createSlice} from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        suggestedUsers : [],
        userProfile : null,
        selectedUser : null
    },
    reducers: {
        setAuthUser:(state, action) => {
            state.user = action.payload
        },
        setSuggestedUsers: (state, action) => {
            state.suggestedUsers = action.payload
        },
        setUserProfile: (state, action) => {
            state.userProfile = action.payload
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload
        },
        clearUser: (state) => {
            state.user = []; // Clear the posts array
            state.suggestedUsers = null; // Reset selectedPost
          },
        
    }
})

export const {setAuthUser, setSuggestedUsers, setUserProfile, setSelectedUser, clearUser} = authSlice.actions
export default authSlice.reducer