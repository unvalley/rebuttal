import '../styles/globals.css'
import type { AppProps } from 'next/app'
import type { NextPage } from 'next'
import type { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'

type NextPageWithAuthAndLayout = NextPage & {
  auth?: boolean
  getLayout?: (page: React.ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithAuthAndLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)
  const layout = getLayout(<Component {...pageProps} />)
  return <ThemeProvider>{layout}</ThemeProvider>
}

export default MyApp
