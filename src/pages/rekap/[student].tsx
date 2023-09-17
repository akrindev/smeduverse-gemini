import Calendar from "@/components/Calendar";
import KonstaLayouts from "@/components/konsta-layouts";
import WithNavbar from "@/components/with-navbar";
import { Student, getStudentInformationById } from "@/lib/information";
import { useAttendance } from "@/store/attendance";
import { useRecap } from "@/store/recap";
import format from "date-fns/format";
import id from "date-fns/locale/id";
import {
  Block,
  BlockTitle,
  Dialog,
  DialogButton,
  List,
  ListItem,
  Navbar,
  NavbarBackLink,
  Page,
  Preloader,
} from "konsta/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Lottie from "react-lottie";
import success from "../../assets/success.json";
import Head from "next/head";

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
  // baseStudent state
  const [baseStudent, setBaseStudent] = useState<Student | null>(null);

  // state for dialog
  const [dialogOpened, setDialogOpened] = useState(false);
  // state for selected id
  const [selectedId, setSelectedId] = useState<number | null>(null);
  // state for count down item clicked
  const [countDownItemClicked, setCountDownItemClicked] = useState(0);
  // state for isLoading
  const [isLoading, setIsLoading] = useState(false);
  // state for deleted successful
  const [deletedSuccessful, setDeletedSuccessful] = useState(false);
  // state for on error deleting
  const [onErrorDeleting, setOnErrorDeleting] = useState(false);

  const successOptions = {
    loop: true,
    autoplay: true,
    animationData: success,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const deleteAttendance = useAttendance((state) => state.deleteAttendance);

  const router = useRouter();
  const fetchAttendanceByStudentId = useRecap(
    (state) => state.fetchAttendanceByStudentId
  );

  const { student: studentId } = router.query as { student: string };

  if (router.isReady && !studentId) {
    router.push("/rekap");
  }

  const onItemClicked = (id: number) => {
    setDialogOpened(true);
    // setToastLeftOpened(true);
    setSelectedId(id);
    setCountDownItemClicked(5);
  };

  // confirmed delete
  const onConfirmedDelete = () => {
    const successSound = new Audio("/sounds/eventually.ogg");

    setIsLoading(true);
    deleteAttendance(selectedId!)
      .then((res) => {
        if (res.status === 200) {
          setDialogOpened(false);
          // setToastLeftOpened(true);
          setSelectedId(null);
          setDeletedSuccessful(true);

          // play sound
          successSound.play();

          setTimeout(() => {
            setDeletedSuccessful(false);
          }, 3000);

          const newResults = results.filter((item) => item.id !== selectedId);
          setResults(newResults);
        }
      })
      .catch((err) => {
        console.error("error deleteAttendance", err);
        setDialogOpened(false);
        setOnErrorDeleting(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // use effect to handle count down
  useEffect(() => {
    if (countDownItemClicked === 0) return;
    const interval = setInterval(() => {
      setCountDownItemClicked((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countDownItemClicked]);

  useEffect(() => {
    const populatedDates = results.map((result) => ({
      date: format(new Date(result.attendance_date), "yyyy-MM-dd"),
      status: "h",
    }));

    // set populated dates
    setPopulatedDates(populatedDates);
  }, [results]);

  useEffect(() => {
    fetchAttendanceByStudentId(studentId, month, year)
      .then((res) => {
        if (res.status === 200) setResults(res.data.attendances);
      })
      .catch((err) => {
        console.error("error fetchAttendanceByStudentId", err);
      });
  }, [studentId, month, year]);

  useEffect(() => {
    getStudentInformationById(studentId)
      .then((res) => {
        // console.log("student", res.data);
        if (res.status === 200) setBaseStudent(res.data);
      })
      .catch((err) => {
        console.log("error getStudentInformationById", err);
      });
  }, [studentId]);

  return (
    <KonstaLayouts>
      <Head>
        <title>Rekap</title>
      </Head>
      <Page>
        <WithNavbar>
          <Navbar
            title={`Rekap`}
            left={<NavbarBackLink text="Back" onClick={() => history.back()} />}
          />

          {baseStudent ? (
            <>
              <List strong>
                <ListItem header="Nama" title={baseStudent?.fullname} />
                <ListItem header="NIS" title={baseStudent?.nipd} />
                <ListItem
                  header="Kelas"
                  title={baseStudent?.rombel_aktif[0]?.nama}
                />
                <ListItem
                  header="Tempat, Tanggal Lahir"
                  title={`${baseStudent?.tempat_lahir}, ${format(
                    new Date(baseStudent?.tanggal_lahir),
                    "dd-MMMM-yyyy"
                  )}`}
                />
                <ListItem
                  header="Jumlah Kehadiran"
                  title={populatedDates.length || "0"}
                />
              </List>

              <Block strong>
                <Calendar
                  year={year}
                  month={month}
                  onMonthChanged={(month) => setMonth(month)}
                  onYearChanged={(year) => setYear(year)}
                  dates={populatedDates}
                />
              </Block>
              <BlockTitle>Kehadiran Bulanan</BlockTitle>

              {results.length > 0 ? (
                <List strong>
                  {results.map((result) => (
                    <ListItem
                      key={result.id}
                      link
                      title={format(
                        new Date(result.attendance_date),
                        "HH:mm | EEE, dd MMM",
                        { locale: id }
                      )}
                      subtitle={"klik untuk menghapus"}
                      after={result.rombel.nama}
                      onClick={() => onItemClicked(result.id)}
                    />
                  ))}
                </List>
              ) : (
                <Block strong>
                  <p>Tidak ada data kehadiran.</p>
                </Block>
              )}
            </>
          ) : (
            <Block strong>
              <Preloader />
            </Block>
          )}
        </WithNavbar>
      </Page>

      {/* dialog to confirm delete */}
      <Dialog
        opened={dialogOpened}
        onBackdropClick={() => setDialogOpened(false)}
        title="Hapus kehadiran ini?"
        content="Kehadiran akan dihapus"
        buttons={[
          <DialogButton
            tabIndex={1}
            key="cancel"
            onClick={() => setDialogOpened(false)}
          >
            Batal
          </DialogButton>,
          <DialogButton
            tabIndex={2}
            key="delete"
            className="k-color-brand-red"
            onClick={onConfirmedDelete}
            disabled={countDownItemClicked > 0 || isLoading}
          >
            {isLoading ? (
              <Preloader />
            ) : (
              `Hapus ${
                countDownItemClicked > 0
                  ? "(" + countDownItemClicked + "d)"
                  : ""
              }`
            )}
          </DialogButton>,
        ]}
      />

      {/* dialog alert */}
      <Dialog
        opened={deletedSuccessful}
        onBackdropClick={() => setDeletedSuccessful(false)}
        title={
          <Lottie options={successOptions} speed={1} height={120} width={120} />
        }
        content={"Kehadiran berhasil dihapus"}
      />
      {/* dialog error */}
      <Dialog
        opened={onErrorDeleting}
        onBackdropClick={() => setOnErrorDeleting(false)}
        title={"Gagal menghapus kehadiran"}
        content={"Terjadi kesalahan saat menghapus kehadiran"}
        buttons={[
          <DialogButton
            tabIndex={1}
            key="cancel"
            onClick={() => setOnErrorDeleting(false)}
          >
            Tutup
          </DialogButton>,
        ]}
      />
    </KonstaLayouts>
  );
}
