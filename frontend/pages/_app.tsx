<<<<<<< HEAD
import '../styles/globals.css';

import Navbar from '../components/Navbar';

function MyApp({ Component, pageProps }) {
  return (
    <>
        <Navbar />
        <Component {...pageProps} />
    </>
  );
}

export default MyApp
=======
import { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
>>>>>>> 3f86fdbd227955b84f3b1d22fd0199f59f3f1431
