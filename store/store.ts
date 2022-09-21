import { configureStore } from "@reduxjs/toolkit";
import UiSlice from "./ui-slice";

const store = configureStore({
  reducer: { ui: UiSlice.reducer },
});

export const { setProfileOpen, setNotificationOpen, setFormOpen } =
  UiSlice.actions;

export type RoofState = ReturnType<typeof store.getState>;

export default store;
