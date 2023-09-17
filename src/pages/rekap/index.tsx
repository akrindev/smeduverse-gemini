import { Page, Navbar, Block, BlockTitle, List, ListItem } from "konsta/react";
import { useEffect, useState } from "react";
import LatestAttendances from "@/components/latest-attendances";
import WithNavbar from "@/components/with-navbar";
import KonstaLayouts from "@/components/konsta-layouts";
import DialogRombel from "@/components/dialog-rombel";
import DialogDate from "@/components/dialog-date";
import RecapAttendance from "@/components/recap/attendances";
import { useRecap } from "@/store/recap";
import format from "date-fns/format";
import { useRouter } from "next/router";

export default function RekapPage() {
  const [date, setDate] = useState("");
  // state for selected rombel
  const [selectedRombel, setSelectedRombel] = useState(null);
  // state for selected date
  const [selectedDate, setSelectedDate] = useState(null);

  // dialog rombel
  const [dialogRombelOpened, setDialogRombelOpened] = useState(false);
  // dialog date
  const [dialogDateOpened, setDialogDateOpened] = useState(false);
  // fetch attendances
  const fetchAttendances = useRecap((state) => state.fetchAttendances);

  const router = useRouter();

  // on selecting rombel
  const onSelectingRombel = () => {
    setDialogRombelOpened(true);
  };

  // on select rombel
  const onSelectedRombel = (rombel: any) => {
    setSelectedRombel(rombel);
    setDialogRombelOpened(false);

    // fetch attendances
    fetchAttendances(1, selectedDate, rombel?.id);
    // console.log(rombel);
  };

  // on selected date
  const onSelectedDate = (date: any) => {
    setSelectedDate(date);
    setDialogDateOpened(false);

    // refetch attendances
    fetchAttendances(1, date, selectedRombel?.id);
  };

  useEffect(() => {
    setSelectedDate((prev) => format(new Date(), "yyyy-MM-dd"));
  }, []);

  return (
    <KonstaLayouts>
      <Page>
        <WithNavbar>
          <Navbar title="Rekap" />
          {/* <BlockTitle>Pilih Rekap</BlockTitle> */}
          <List strong>
            <ListItem
              link
              title="Rekap Per Kelas"
              onClick={() => router.push("/rekap/rombel")}
            />
          </List>
          <hr className="border border-t" />
          <BlockTitle>Pilih Rombel dan Tanggal</BlockTitle>
          <Block>
            <List strongIos outlineIos>
              <ListItem
                link
                title="Rombel"
                after={selectedRombel ? selectedRombel.nama : "All"}
                onClick={() => setDialogRombelOpened(true)}
              />
              <ListItem
                link
                title="Tanggal"
                after={selectedDate ? selectedDate : ""}
                onClick={() => setDialogDateOpened(true)}
              />
            </List>
          </Block>
          {/*  */}
          <RecapAttendance />
        </WithNavbar>
      </Page>

      <DialogRombel
        opened={dialogRombelOpened}
        onRombelSelect={onSelectedRombel}
      />
      <DialogDate opened={dialogDateOpened} onDateSelect={onSelectedDate} />
    </KonstaLayouts>
  );
}
