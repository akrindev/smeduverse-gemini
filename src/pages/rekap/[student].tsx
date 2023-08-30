import Calendar from "@/components/Calendar";
import KonstaLayouts from "@/components/konsta-layouts";
import WithNavbar from "@/components/with-navbar";
import { Block, Navbar, Page } from "konsta/react";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps } from "next/types";
import { useEffect, useState } from "react";

// it is a page that displays the attendance of a student
export default function RekapStudent({ student }) {
  // a month and year state that has been initially set to the current month and date
  const [month, setMonth] = useState(new Date().getMonth());
  //   year
  const [year, setYear] = useState(new Date().getFullYear());

  const router = useRouter();

  const { student: studentId } = router.query;

  useEffect(() => {
    if (!studentId) {
      router.push("/rekap");
    }
  }, [studentId, router]);

  return (
    <KonstaLayouts>
      <Page>
        <WithNavbar>
          <Navbar title={`Rekap ${studentId}`} />
          <Block>
            <Calendar year={year} month={month} />
          </Block>
        </WithNavbar>
      </Page>
    </KonstaLayouts>
  );
}
