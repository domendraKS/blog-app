import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.currentUser = action.payload;
    },
    signInFail: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    signOut: (state) => {
      state.currentUser = null;
      state.error = null;
      state.loading = null;
    },
    userUpdateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    userUpdateSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.error = null;
      state.loading = false;
    },
    userUpdateFail: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    userDeleteStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    userDeleteSuccess: (state) => {
      state.loading = false;
      state.error = null;
      state.currentUser = null;
    },
    userDeleteFail: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFail,
  signOut,
  userUpdateStart,
  userUpdateSuccess,
  userUpdateFail,
  userDeleteFail,
  userDeleteStart,
  userDeleteSuccess,
} = userSlice.actions;

export default userSlice.reducer;
