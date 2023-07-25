import type { AppProps } from 'next/app'
import { Poppins } from 'next/font/google'
import '@/styles/globals.css'
import Header from '@/components/Header'

const poppins = Poppins({
  subsets:['latin'],
  weight: ['400', '500', '700', '900'],
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={poppins.className}>
      <Header />
      <Component {...pageProps} />
    </div>
    )
}
