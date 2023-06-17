import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
      <title>Ihsan Backtesting Tool</title>
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1"/>
        <meta property="og:type" content="website" />
        <meta name="og:site_name" content="Ihsan Backtesting"/>
        <meta property="og:title" content="Test your trading strategies before going into battle." />
        <meta
          name="description"
          property="og:description"
          content="ihsan home is where you can find your dream home or shop"
        />
        <meta property="og:type" content="video.movie" />
        <meta
          property="og:url"
          content="https://ihsan-backtesting.vercel.app/"
        />
        <meta
          name="image"
          property="og:image"
          content="https://firebasestorage.googleapis.com/v0/b/ihsan-home.appspot.com/o/IhsanHome.png?alt=media&token=6bbf4ab6-5ac4-4646-b346-05eb1915dc9f"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}