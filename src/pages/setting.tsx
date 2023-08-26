import KonstaLayouts from "@/components/konsta-layouts";
import WithNavbar from "@/components/with-navbar";
import { Block, Navbar, Page } from "konsta/react";

export default function Setting() {
  return (
    <KonstaLayouts>
      <Page>
        <Navbar title='Setting' />
        <WithNavbar>
          <Block strong>Setting Page</Block>
        </WithNavbar>
      </Page>
    </KonstaLayouts>
  );
}
