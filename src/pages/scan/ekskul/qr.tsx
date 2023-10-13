import { useRouter } from "next/router";
import KonstaLayouts from "@/components/konsta-layouts";
import Head from "next/head";
import { Navbar, NavbarBackLink, Page } from "konsta/react";
import WithNavbar from "@/components/with-navbar";
import { useEffect } from "react";

export default function EkskulPage() {
  const router = useRouter();

  const { id: ekskulId } = router.query;

  useEffect(() => {
    if (!ekskulId) {
      router.push("/scan/ekskul");
    }
  }, [router, ekskulId]);

  return (
    <KonstaLayouts>
      <Head>
        <title>Scan Ekskul</title>
      </Head>
      <Page>
        <WithNavbar>
          <Navbar
            title='Scan Ekskul'
            left={<NavbarBackLink text='Back' onClick={() => history.back()} />}
          />
          ekskulId: {ekskulId}
        </WithNavbar>
      </Page>
    </KonstaLayouts>
  );
}
