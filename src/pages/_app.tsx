import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

export const roboto = Inter({
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={roboto.className}>
      <Component {...pageProps} />
    </main>
  );
}
