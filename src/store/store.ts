import {configureStore, ThunkAction, Action, Store} from "@reduxjs/toolkit";
import configSlice from "./configSlice";
import gameSlice from "./gameSlice";

import {createWrapper} from "next-redux-wrapper";

const makeStore = () => configureStore({
  reducer: {
    [configSlice.name]: configSlice.reducer,
    [gameSlice.name]: gameSlice.reducer,
  },
  devTools: true,
});

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>;

export const wrapper = createWrapper<AppStore>(makeStore);
