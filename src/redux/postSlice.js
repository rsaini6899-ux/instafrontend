import {createSlice}  from '@reduxjs/toolkit'

const postSlice = createSlice({
    name: 'posts',
    initialState: {
        posts: [],
        selectedPost : null,
    },
    reducers: {
        setPosts: (state, action) => {
            state.posts =  action.payload
        },
        setSelectedPost: (state, action) => {
            state.selectedPost = action.payload
        },
        clearPosts: (state) => {
         state.posts = []; // Clear the posts array
         state.selectedPost = null; // Reset selectedPost
       },
    }
})

export const {setPosts, setSelectedPost, clearPosts} = postSlice.actions
export default postSlice.reducer