import { createSlice } from '@reduxjs/toolkit';

// Retrieve values from local storage for persistence
const token = localStorage.getItem('token') || null;
const userJson = localStorage.getItem('user');
const user = userJson ? JSON.parse(userJson) : null;
const userId = user ? user._id : null;

const initialState = {
    mode: "dark",
    userId: userId,
    user: user,
    token: token
};

export const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.userId = action.payload.user._id;
            
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
            state.userId = null;
            
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }
});

export const { setMode, setLogin, setLogout } = globalSlice.actions;
export default globalSlice.reducer;