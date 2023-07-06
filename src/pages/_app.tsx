import './base.scss'
import {FC, useEffect} from "react";
import {AppProps} from "next/app";
import {wrapper} from "@/store/store";
import {Provider} from "react-redux";
import RootLayout from "@/pages/layout";
import configSlice, {ConfigState} from "@/store/configSlice";
import gameStateSlice, {GameState, GameStates} from "@/store/gameSlice";

const MyApp: FC<AppProps> = ({Component, ...rest}) => {
  const {store, props} = wrapper.useWrappedStore(rest);

  return (
    <Provider store={store}>
      <RootLayout>
        <Component {...props.pageProps} />
      </RootLayout>
    </Provider>
  );
};

export default MyApp;
