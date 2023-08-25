import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Roboto } from "next/font/google";

export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={roboto.className}>
      <Component {...pageProps} />
    </main>
  );
}
