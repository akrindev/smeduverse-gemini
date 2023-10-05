import KonstaLayouts from "@/components/konsta-layouts";
import LatestAttendances from "@/components/latest-attendances";
import QRCode from "@/components/qrcode";
import WithNavbar from "@/components/with-navbar";
import { api } from "@/hooks/auth";
import { errorOptions, successOptions } from "@/lib/lottie-options";
import { useAttendance } from "@/store/attendance";
import {
  Block,
  BlockTitle,
  Dialog,
  Navbar,
  NavbarBackLink,
  Page,
} from "konsta/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import Lottie from "react-lottie";

export default function ScanApel() {
  // State variables
  const [tokenized, setTokenized] = useState(""); // For storing tokenized QR code
  const [alertOpened, setAlertOpened] = useState(false); // For handling alert dialog
  const [message, setMessage] = useState(""); // For storing messages
  const [results, setResults] = useState([]); // For storing results
  const [isError, setIsError] = useState(false); // For error handling

  const fetchAttendances = useAttendance((state) => state.fetchAttendances);

  // Callback function for successful QR code scan
  const qrCodeSuccessCallback = (qrCodeMessage: string) => {
    // console.log("scanned", qrCodeMessage);
    setIsError(false);

    // Updating results
    setResults((prev) => [...prev, qrCodeMessage]);

    // Checking for duplicate scans
    if (tokenized !== qrCodeMessage) {
      setTokenized(qrCodeMessage);

      // API call to store attendance
      api
        .post("/api/attendance/apel/store", { nis: qrCodeMessage })
        .then((response) => {
          setAlertOpened(true);
          setMessage(response.data.message);

          fetchAttendances();
        })
        .catch((error) => {
          setAlertOpened(true);
          setMessage(error.response.data.message);
          setIsError(true);
        });
    }
  };

  // Effect to remove last scanned QR code after 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTokenized((prev) => "");
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Effect to handle alert dialog and play sounds
  useEffect(() => {
    const successSound = new Audio("/sounds/successful.ogg");
    const errorSound = new Audio("/sounds/failure.ogg");
    if (alertOpened) {
      setTimeout(() => {
        setAlertOpened(false);
      }, 3000);

      // Playing sounds based on success or failure
      if (isError) {
        errorSound.play();
      }
      if (!isError) {
        successSound.play();
      }
    }
  }, [alertOpened, isError]);

  return (
    <KonstaLayouts>
      <Head>
        <title>Scan Apel</title>
      </Head>
      <Page>
        <WithNavbar>
          <Navbar
            title='Scan Apel'
            left={<NavbarBackLink text='Back' onClick={() => history.back()} />}
          />
          <BlockTitle>Scan Kehadiran Apel</BlockTitle>
          <Block>
            <QRCode
              fps={10}
              qrbox={300}
              aspectRatio={1.0}
              disableFlip={false}
              verbose={false}
              qrCodeSuccessCallback={qrCodeSuccessCallback}
            />
          </Block>
          <div className='mt-5'>
            <LatestAttendances />
          </div>
        </WithNavbar>
      </Page>

      <Dialog
        opened={alertOpened}
        onBackdropClick={() => setAlertOpened(false)}
        title={
          isError ? (
            <Lottie
              options={errorOptions}
              speed={0.5}
              height={180}
              width={180}
            />
          ) : (
            <Lottie options={successOptions} height={180} width={180} />
          )
        }
        content={message}
      />
    </KonstaLayouts>
  );
}
