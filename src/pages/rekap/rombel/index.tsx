import KonstaLayouts from "@/components/konsta-layouts";
import WithNavbar from "@/components/with-navbar";
import { api } from "@/hooks/auth";
import {
  BlockTitle,
  List,
  ListItem,
  Navbar,
  NavbarBackLink,
  Page,
  Preloader,
} from "konsta/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function RekapRombelPage() {
  const [rombels, setRombels] = useState([]);
  //   loading
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setLoading(true);

    api
      .get("/orbit/api/rombel/list")
      .then((response) => setRombels(response.data))
      //   catch
      .catch((error) => console.error(error))
      //   finally
      .finally(() => setLoading(false));
  }, []);

  //   console.log("rendered", rombels);

  return (
    <KonstaLayouts>
      <Page>
        <WithNavbar>
          <Navbar
            title="Pilih Rombel"
            left={<NavbarBackLink text="Back" onClick={() => history.back()} />}
          />
          {loading ? (
            <div className="my-3 flex items-center justify-center">
              <Preloader />
            </div>
          ) : (
            <>
              <BlockTitle>Pilih Kelas</BlockTitle>
              <List strong>
                {rombels.map((rombel) => (
                  <ListItem
                    link
                    key={rombel.id}
                    title={rombel.nama}
                    subtitle={rombel.wali_kelas.fullname}
                    onClick={() => router.push(`/rekap/rombel/${rombel.id}`)}
                  />
                ))}
              </List>
            </>
          )}
        </WithNavbar>
      </Page>
    </KonstaLayouts>
  );
}
