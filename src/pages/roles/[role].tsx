import KonstaLayouts from "@/components/konsta-layouts";
import WithNavbar from "@/components/with-navbar";
import { Block, BlockTitle, List, ListButton, ListInput, ListItem, Navbar, NavbarBackLink, Page, Searchbar } from "konsta/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

export default function RolePage() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("");

    const { role } = router.query as { role: string }

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleClear = () => {
        setSearchQuery("");
    };

    const handleDisable = () => {
        console.log("Searchbar disabled");
    };

    return <KonstaLayouts>
        <Head>
            <title>Role Management</title>
        </Head>
        <Page>
            <WithNavbar>
                <Navbar
                    title='Role'
                    left={<NavbarBackLink text='Back' onClick={() => history.back()} />}
                // subnavbar={
                //     <Searchbar
                //         onInput={handleSearch}
                //         value={searchQuery}
                //         onClear={handleClear}
                //         disableButton
                //         disableButtonText="Cancel"
                //         onDisable={handleDisable}
                //     />
                // }
                />
                <BlockTitle>Tambah Tim</BlockTitle>
                <List strong>
                    <ListInput
                        label="NIY"
                        type="number"
                        placeholder="Masukkan NIY"
                    />
                    <ListButton>Cari</ListButton>
                </List>

                {/* it will display the information below */}
                <List inset strong>
                </List>
                {/* end of information */}

                <BlockTitle>
                    Roles {role}
                </BlockTitle>
            </WithNavbar>
        </Page>
    </KonstaLayouts>
}