import {Head, Html, Main, NextScript} from "next/document";

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </Head>
      <body suppressHydrationWarning={true}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}