import KonstaLayouts from "@/components/konsta-layouts";
import WithNavbar from "@/components/with-navbar";
import { api } from "@/hooks/auth";
import { Navbar, NavbarBackLink, Page } from "konsta/react";
import Head from "next/head";
import { useEffect, useState } from "react";

export default function ScanEkskul() {
  // state for list ekskul if available on user
  const [listEkskul, setListEkskul] = useState<
    Array<{
      id: number;
      name: string;
      description: string;
      coachable_id: string;
      created_at: string;
      updated_at: string;
      deleted_at: string;
    }>
  >([]);

  useEffect(() => {
    const fetchEkskul = async () => {
      const response = await api.get("/api/ekskul/available");
      setListEkskul(response.data);

      console.log(response.data);
    };

    fetchEkskul();
  }, []);

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
        </WithNavbar>
      </Page>
    </KonstaLayouts>
  );
}
