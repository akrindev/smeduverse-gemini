import KonstaLayouts from "@/components/konsta-layouts";
import WithNavbar from "@/components/with-navbar";
import { useAuth } from "@/hooks/auth";
import { getIdentity } from "@/lib/identity";
import { Roles, assignRole, getRoles } from "@/lib/roles";
import { BlockTitle, Dialog, List, ListButton, ListInput, ListItem, Navbar, NavbarBackLink, Page, Preloader } from "konsta/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function RolePage() {
    const router = useRouter()
    const [roles, setRoles] = useState<Roles[]>([])
    const [identity, setIdentity] = useState<Roles>(null)
    const [identityId, setIdentityId] = useState("")
    // identity loading
    const [identityLoading, setIdentityLoading] = useState(false)
    const [loadingAssignRole, setLoadingAssignRole] = useState(false)

    const [alertOpened, setAlertOpened] = useState(false)
    const [alertTitle, setAlertTitle] = useState("")
    const [alertContent, setAlertContent] = useState("")

    const { user } = useAuth({
        middleware: "auth",
        redirectIfAuthenticated: "/dashboard",
    })

    const { role } = router.query as { role: string | 'ketarunaan' | 'osis-ketarunaan' }

    const onRoleClicked = (item) => {
        if (user && user.data.identity.niy === item.identity.niy) {
            return
        }

        console.log(item)
    }

    const findIdentity = () => {
        setIdentityLoading(true)
        getIdentity(role === 'ketarunaan' ? 'teacher' : 'student', identityId).then((item) => {
            setIdentity(item)
            console.log(item)
        })
            .catch((err) => {
                console.error('eerrroooz', err)

            })
            .finally(() => setIdentityLoading(false))
    }

    const onAssignRole = () => {
        setLoadingAssignRole(true)
        const initRole = role.replace('-', ' ') as 'ketarunaan' | 'osis ketarunaan'
        if (role && identity) {
            assignRole(initRole, identity.id).then(() => {
                // alert that user has been assigned
                setAlertOpened(true)
                setAlertTitle('Berhasil')
                setAlertContent(`Berhasil menambahkan ${identity.identity.fullname}`)
            }).finally(() => {
                getRoles(role).then((item) => setRoles(item))
                setLoadingAssignRole(false)
                setIdentity(null)
                setIdentityId('')
            })
        }
    }

    useEffect(() => {
        console.log('user', user)
        if (role) getRoles(role).then((item) => setRoles(item))
    }, [role])

    // use effect wherever alert open then close it after 3 seconds
    useEffect(() => {
        if (alertOpened) {
            setTimeout(() => {
                setAlertOpened(false)
            }, 3000)
        }
    }, [alertOpened])

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
                        label={role === 'ketarunaan' ? 'NIY' : 'NIS'}
                        type="number"
                        placeholder={`Masukkan ${role === 'ketarunaan' ? 'NIY' : 'NIS'}`}
                        value={identityId}
                        onChange={(e) => setIdentityId(e.target.value)}
                    />
                    <ListButton onClick={findIdentity}>{identityLoading ? (<Preloader />) : 'Cari'}</ListButton>
                </List>

                {/* it will display the information below */}
                {identity && (
                    <List inset strong>
                        <ListItem
                            header='Nama Lengkap'
                            title={identity.identity?.fullname}
                        />
                        <ListItem
                            header={identity.teacher ? 'NIY' : 'NIS'}
                            title={identity.teacher ? identity.identity?.niy : identity.identity?.nipd}
                        />
                        <ListButton onClick={onAssignRole}>
                            {loadingAssignRole ? (<Preloader />) : 'Tambah'}
                        </ListButton>
                    </List>
                )}
                {/* end of information */}

                <BlockTitle>
                    Roles {role.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </BlockTitle>
                <List inset strong>
                    {user && roles.map((item) => (
                        <ListItem
                            key={item.id}
                            title={item.identity.fullname}
                            link={user.data.identity.niy !== item.identity.niy}
                            onClick={() => onRoleClicked(item)}
                        />
                    ))}
                </List>
            </WithNavbar>
        </Page>

        {/* alert dialog */}
        <Dialog
            opened={alertOpened}
            onBackdropClick={() => setAlertOpened(false)}
            title={alertTitle}
            content={alertContent}
        />
    </KonstaLayouts>
}