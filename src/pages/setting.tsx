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

  // console.log(user);

  return (
    <KonstaLayouts>
      <Head>
        <title>Setting</title>
      </Head>
      <Page>
        <Navbar title="Setting" />
        <WithNavbar>
          <BlockTitle>Profile</BlockTitle>
          {user && (
            <List strongIos outlineIos>
              <ListItem
                header="Nama Lengkap"
                title={user.data.identity.fullname}
              />
              {user.data.teacher! ? (
                <ListItem header="NIY" title={user.data.identity.niy} />
              ) : (
                <ListItem header="NIS" title={user.data.identity.nipd} />
              )}
            </List>
          )}
          <BlockTitle>Roles</BlockTitle>
          <List strong>
            {/* list item with title of ketarunaan and osis ketarunaan */}
            <ListItem
              title="Ketarunaan"
              link
              onClick={() => router.push("/roles/ketarunaan")}
            />
            <ListItem
              title="OSIS Ketarunaan"
              link
              onClick={() => router.push("/roles/osis-ketarunaan")}
            />
          </List>
          <List inset strong>
            <ListButton className="k-color-brand-red" onClick={logout}>
              Keluar
            </ListButton>
          </List>
        </WithNavbar>
      </Page>
    </KonstaLayouts>
  );
}
