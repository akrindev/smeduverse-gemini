import { IconFileChart, IconHome, IconSettings } from "@tabler/icons-react";
import { Tabbar, TabbarLink } from "konsta/react";
import { useRouter } from "next/router";
import { PropsWithChildren, useState } from "react";

export default function WithNavbar({ children }: PropsWithChildren) {
  // active
  const [activeTab, setActiveTab] = useState("dashboard");
  // use path as active tab
  const router = useRouter();

  const pathname = router.pathname;

  //   navigate
  const navigate = (path: string) => {
    router.push(path);
  };

  return (
    <>
      <div className='pb-12'>{children}</div>
      <Tabbar labels icons className='left-0 bottom-0 fixed'>
        <TabbarLink
          active={pathname === "/dashboard"}
          onClick={() => navigate("/dashboard")}
          icon={<IconHome className='w-8 h-8' />}
          label={"Home"}
        />
        <TabbarLink
          active={pathname === "/rekap"}
          onClick={() => navigate("/rekap")}
          icon={<IconFileChart className='w-8 h-8' />}
          label={"Rekap"}
        />
        <TabbarLink
          active={pathname === "/setting"}
          onClick={() => navigate("/setting")}
          icon={<IconSettings className='w-8 h-8' />}
          label={"Setting"}
        />
      </Tabbar>
    </>
  );
}
