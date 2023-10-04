import KonstaLayouts from "@/components/konsta-layouts";
import WithNavbar from "@/components/with-navbar";
import { useAuth } from "@/hooks/auth";
import {
  Block,
  BlockTitle,
  List,
  ListButton,
  ListItem,
  Navbar,
  Page,
} from "konsta/react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Setting() {
  const { user, logout } = useAuth({
    middleware: "auth",
    redirectIfAuthenticated: "/home",
  });

  const router = useRouter();

  if (!user) return <>Loading . . .</>;

  return (
    <KonstaLayouts>
      <Head>
        <title>Setting</title>
      </Head>
      <Page>
        <Navbar title='Setting' />
        <WithNavbar>
          <BlockTitle>Profile</BlockTitle>
          {user && (
            <List strongIos outlineIos>
              <ListItem
                header='Nama Lengkap'
                title={user.data.identity.fullname}
              />
              {user.data.teacher! && (
                <ListItem header='NIY' title={user.data.identity.niy} />
              )}

              {user.data.student! && (
                <ListItem header='NIS' title={user.data.identity.nipd} />
              )}

              {user.data.external_staff! && (
                <ListItem header='NIK' title={user.data.identity.nik} />
              )}
            </List>
          )}

          {!user.data.external_staff && (
            <>
              <BlockTitle>Roles</BlockTitle>
              <List strong>
                {/* list item with title of ketarunaan and osis ketarunaan */}
                <ListItem
                  title='Ketarunaan'
                  link
                  onClick={() => router.push("/roles/ketarunaan")}
                />
                <ListItem
                  title='OSIS Ketarunaan'
                  link
                  onClick={() => router.push("/roles/osis-ketarunaan")}
                />
              </List>
            </>
          )}
          <List inset strong>
            <ListButton className='k-color-brand-red' onClick={logout}>
              Keluar
            </ListButton>
          </List>
        </WithNavbar>
      </Page>
    </KonstaLayouts>
  );
}
