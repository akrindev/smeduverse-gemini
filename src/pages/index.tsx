import LoginForm from "@/components/auth/login-form";
import KonstaLayouts from "@/components/konsta-layouts";
import { Page, Navbar, Block } from "konsta/react";
import Head from "next/head";

export default function Index() {
  return (
    <KonstaLayouts>
      <Head>
        <title>Smeduverse Gemini</title>
      </Head>
      <Page>
        <Navbar title={`Smeduverse Gemini`} />

        <LoginForm />
      </Page>
    </KonstaLayouts>
  );
}
