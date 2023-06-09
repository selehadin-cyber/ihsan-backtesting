import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import LineChart from '../components/LineChart'
import { Navbar } from '../components/Navbar'
import { useDarkMode } from '../hooks/userDarkMode'

const Home: NextPage = () => {
    const [isDark, setIsDark] = useDarkMode();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2 bg-white dark:bg-black ">
      <Head>
        <title>Ihsan Backtesting Tool</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      <main className="flex w-full flex-1 flex-col items-center justify-center px-3.5 sm:px-20 text-center">
        {/* To-do create a minimalist navbar */}
        <LineChart /> 
      </main>

      {/* <footer className="flex h-24 w-full items-center justify-center border-t">
        <a
          className="flex items-center justify-center gap-2"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
        </a>
      </footer> */}
    </div>
  )
}

export default Home
