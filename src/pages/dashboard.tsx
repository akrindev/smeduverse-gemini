// Importing necessary libraries and components
import KonstaLayouts from "@/components/konsta-layouts";
import { Page, Navbar } from "konsta/react";
import { api, useAuth } from "@/hooks/auth";
import Head from "next/head";
import WithNavbar from "@/components/with-navbar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// Main function for the Dashboard page
export default function DashboardPage() {
  const [listEkskul, setListEkskul] = useState([]);

  const { user } = useAuth({
    middleware: "auth",
    redirectIfAuthenticated: "/login",
  });

  console.log("the user: ", user);

  const router = useRouter();

  useEffect(() => {
    const fetchEkskul = async () => {
      const response = await api.get("/api/ekskul/available");
      setListEkskul(response.data);

      console.log(response.data);
    };

    fetchEkskul();
  }, []);

  if (!user) return <>Loading . . .</>;

  return (
    <KonstaLayouts>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Page>
        <WithNavbar>
          <Navbar title='Dashboard' />
          <div className='p-5 grid grid-cols-1 gap-3'>
            {!user.data.external_staff && (
              <div
                className='col-span-1 hover:scale-105 cursor-pointer duration-400'
                onClick={() => router.push("/scan/apel")}>
                <div className='bg-white rounded-lg shadow-lg p-6'>
                  <h2 className='text-lg font-medium text-gray-900'>
                    Presensi Apel
                  </h2>
                  <p className='mt-2 text-sm text-gray-500'>
                    Ketuk untuk mengelola catatan kehadiran apel siswa.
                  </p>
                </div>
              </div>
            )}
            {listEkskul.length > 0 && (
              <div
                className='col-span-1 hover:scale-105 cursor-pointer duration-400'
                onClick={() => router.push("/scan/ekskul")}>
                <div className='bg-white rounded-lg shadow-lg p-6'>
                  <h2 className='text-lg font-medium text-gray-900'>
                    Presensi Ekskul
                  </h2>
                  <p className='mt-2 text-sm text-gray-500'>
                    Ketuk untuk mengelola kehadiran kegiatan ekstrakurikuler.
                  </p>
                </div>
              </div>
            )}
          </div>
        </WithNavbar>
      </Page>
    </KonstaLayouts>
  );
}
