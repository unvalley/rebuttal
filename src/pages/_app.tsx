import "../styles/globals.css";
import type { AppProps } from "next/app";
import type { NextPage } from "next";
import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { trpc } from "../lib/trpc";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

type NextPageWithAuthAndLayout = NextPage & {
  auth?: boolean;
  getLayout?: (page: React.ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithAuthAndLayout;
} & { pageProps: { session?: Session } & AppProps["pageProps"] };

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  const layout = getLayout(<Component {...pageProps} />);

  return (
    <ThemeProvider>
      <SessionProvider>{layout}</SessionProvider>
    </ThemeProvider>
  );
};

export default trpc.withTRPC(MyApp);
