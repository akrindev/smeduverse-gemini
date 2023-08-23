import LoginForm from "@/components/auth/login-form";
import KonstaLayouts from "@/components/konsta-layouts";
import { Page, Navbar, Block } from "konsta/react";

export default function Index() {
  return (
    <KonstaLayouts>
      <Page>
        <Navbar title={`Smeduverse Assembly`} />

        <LoginForm />
      </Page>
    </KonstaLayouts>
  );
}
