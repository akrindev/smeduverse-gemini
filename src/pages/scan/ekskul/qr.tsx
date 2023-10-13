import { useRouter } from "next/router";
import KonstaLayouts from "@/components/konsta-layouts";
import Head from "next/head";
import { Navbar, NavbarBackLink, Page } from "konsta/react";
import WithNavbar from "@/components/with-navbar";

const Ekskul: React.FC = () => {
  const { query, push } = useRouter();

  const { id: ekskulId } = query;

  if (!ekskulId) {
    push("/scan/ekskul");
  }

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
};

export default Ekskul;
