import '../styles/globals.css'
import type { AppProps } from 'next/app'
import type { NextPage } from 'next'
import type { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import { SWRConfig } from 'swr'
import { fetcher } from '../lib/fetcher'

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
  return (
    <SWRConfig value={{ revalidateIfStale: false, fetcher }}>
      <ThemeProvider>{layout}</ThemeProvider>
    </SWRConfig>
  )
}

export default MyApp
