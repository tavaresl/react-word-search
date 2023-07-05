import {createSlice } from "@reduxjs/toolkit";
import {AppState} from "@/store/store";

export interface ConfigState {
  useDarkMode: boolean;
}

const initialState: ConfigState = {
  useDarkMode: false,
};

export const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setConfig(state, action) {
      state.useDarkMode = action.payload;
    },
  },
});

export const { setConfig } = configSlice.actions;
export const selectConfig = (state: AppState) => state.config.useDarkMode;
export default configSlice.reducer;