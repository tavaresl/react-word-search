import './base.scss'
import {FC, useEffect} from "react";
import {AppProps} from "next/app";
import {wrapper} from "@/store/store";
import {Provider} from "react-redux";
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import RootLayout from "@/pages/layout";

config.autoAddCss = false;

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
