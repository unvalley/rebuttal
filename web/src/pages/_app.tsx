import '../styles/globals.css'
import type { AppProps } from 'next/app'
import type { NextPage } from 'next'
import type { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import { SWRConfig } from 'swr'
import { fetcher } from '../lib/fetcher'
import { trpc } from '../lib/trpc'
import { createTRPCClient } from '@trpc/client'

type NextPageWithAuthAndLayout = NextPage & {
  auth?: boolean
  getLayout?: (page: React.ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithAuthAndLayout
}

const client = createTRPCClient({ url: 'http://localhost:3000/api/trpc' })

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)
  const layout = getLayout(<Component {...pageProps} />)

  return (
    <trpc.TRPCProvider client={client}>
      <SWRConfig value={{ revalidateIfStale: false, fetcher }}>
        <ThemeProvider>{layout}</ThemeProvider>
      </SWRConfig>
    </trpc.TRPCProvider>
  )
}

export default MyApp
