import "../styles/globals.css";
import type { AppProps } from "next/app";
import type { NextPage } from "next";
import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { trpc } from "../lib/trpc";

type NextPageWithAuthAndLayout = NextPage & {
  auth?: boolean;
  getLayout?: (page: React.ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithAuthAndLayout;
};

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  const layout = getLayout(<Component {...pageProps} />);

  return <ThemeProvider>{layout}</ThemeProvider>;
};

export default trpc.withTRPC(MyApp);
