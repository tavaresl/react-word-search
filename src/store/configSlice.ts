import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppState} from "@/store/store";

export interface ConfigState {
  oldPlayer: boolean;
  useDarkMode: boolean;
}

const initialState: ConfigState = {
  oldPlayer: false,
  useDarkMode: true,
};
const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    restore(state) {
      const rawConfig = localStorage.getItem('APP_CONFIG');

      if (rawConfig === null) {
        return;
      }

      const config = JSON.parse(rawConfig) as ConfigState;

      state.useDarkMode = config.useDarkMode;
      state.oldPlayer = config.oldPlayer;
    },
    setDarkMode(state, action: PayloadAction<boolean>) {
      state.useDarkMode = action.payload;
      localStorage.setItem('APP_CONFIG', JSON.stringify(state));
    },
    markAsOldPlayer(state) {
      state.oldPlayer = true;
      localStorage.setItem('APP_CONFIG', JSON.stringify(state));
    },
  },
});

export default configSlice;