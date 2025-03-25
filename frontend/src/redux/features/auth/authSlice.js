import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));

      // Explicitly store the token
      if (action.payload?.token) {
        localStorage.setItem("userToken", action.payload.token);
        console.log("Token stored:", action.payload.token);
      }

      const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days
      localStorage.setItem("expirationTime", expirationTime);
    },
    logout: (state) => {
      state.userInfo = null;
      // Clear all localStorage items
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken");
      localStorage.removeItem("expirationTime");
      // Also clear any cookies by setting their expiration to the past
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;