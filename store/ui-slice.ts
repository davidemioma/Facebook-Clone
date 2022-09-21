import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RoofState } from "./store";

const UiSlice = createSlice({
  name: "ui",
  initialState: {
    profileOpen: false,
    notificationOpen: false,
    formOpen: false,
  },
  reducers: {
    setProfileOpen(state, action: PayloadAction<boolean>) {
      state.notificationOpen = false;

      state.profileOpen = action.payload;
    },

    setNotificationOpen(state, action: PayloadAction<boolean>) {
      state.profileOpen = false;

      state.notificationOpen = action.payload;
    },

    setFormOpen(state, action: PayloadAction<boolean>) {
      state.profileOpen = false;

      state.notificationOpen = false;

      state.formOpen = action.payload;
    },
  },
});

export const profileSelector = (state: RoofState) => state.ui.profileOpen;

export const notificationSelector = (state: RoofState) =>
  state.ui.notificationOpen;

export const formSelector = (state: RoofState) => state.ui.formOpen;

export default UiSlice;
