import Calendar from "@/components/Calendar";
import KonstaLayouts from "@/components/konsta-layouts";
import WithNavbar from "@/components/with-navbar";
import { useRecap } from "@/store/recap";
import { AxiosResponse } from "axios";
import format from "date-fns/format";
import id from "date-fns/locale/id";
import { Block, BlockTitle, List, ListItem, Navbar, NavbarBackLink, Page } from "konsta/react";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps } from "next/types";
import { useEffect, useState } from "react";

// it is a page that displays the attendance of a student
export default function RekapStudent({ student }) {
  // a month and year state that has been initially set to the current month and date
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  //   year
  const [year, setYear] = useState(new Date().getFullYear());
  //   results state
  const [results, setResults] = useState([]);
  // populated Dates
  const [populatedDates, setPopulatedDates] = useState([]);

  const router = useRouter();
  const fetchAttendanceByStudentId = useRecap(
    (state) => state.fetchAttendanceByStudentId
  );

  const { student: studentId } = router.query as { student: string };

  useEffect(() => {
    const populatedDates = results.map((result) => ({
      date: format(new Date(result.attendance_date), 'yyyy-MM-dd'),
      status: "h",
    }));

    // set populated dates
    setPopulatedDates(populatedDates);

  }, [results]);

  //   fetch attendance by student id
  useEffect(() => {
    if (!studentId) {
      router.push("/rekap");
    }
    fetchAttendanceByStudentId(studentId).then((res) => {
      // console.log("fetching res", res);
      if (res.status === 200) setResults(res.data.attendances);
      // console.log("fetching", res.data.attendances);
    });
  }, [studentId, fetchAttendanceByStudentId]);

  return (
    <KonstaLayouts>
      <Page>
        <WithNavbar>
          <Navbar
            title={`Rekap`}
            left={<NavbarBackLink text='Back' onClick={() => history.back()} />}
          />
          <Block strong>
            <Calendar year={year} month={month} dates={populatedDates} />
          </Block>
          <BlockTitle>Kehadiran Bulanan</BlockTitle>
          <List strong>
            {results.map((result) => (
              <ListItem
                key={result.id}
                title={format(
                  new Date(result.attendance_date),
                  "HH:mm | EEE, dd MMM",
                  { locale: id })
                }
                after={result.rombel.nama}
              />
            ))}
          </List>
        </WithNavbar>
      </Page>
    </KonstaLayouts>
  );
}
