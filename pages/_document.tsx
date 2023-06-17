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
          content="https://github.com/selehadin-cyber/ihsan-backtesting/blob/main/public/Ihsan%20Backtesting%20Tool.png?raw=true"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}