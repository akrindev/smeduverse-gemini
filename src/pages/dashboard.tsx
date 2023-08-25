import KonstaLayouts from "@/components/konsta-layouts";
import QRCode from "@/components/qrcode";
import {
  Page,
  Block,
  Navbar,
  Dialog,
  DialogButton,
  BlockTitle,
} from "konsta/react";
import { useEffect, useState } from "react";
import { api } from "@/hooks/auth";
import success from "../assets/success.json";
import error from "../assets/error.json";
import Lottie from "react-lottie";
import { useAttendance } from "@/store/attendance";
import LatestAttendances from "@/components/latest-attendances";
import Head from "next/head";

export default function DashboardPage() {
  const [tokenized, setTokenized] = useState("");
  const [alertOpened, setAlertOpened] = useState(false);
  //   message
  const [message, setMessage] = useState("");
  // results
  const [results, setResults] = useState([]);
  // is error
  const [isError, setIsError] = useState(false);

  // to refetch attendances
  const fetchAttendances = useAttendance((state) => state.fetchAttendances);

  const debounce = <T extends (...args: any[]) => void>(
    func: T,
    delay: number
  ) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // callback function
  // it handle when qrcode success scanned
  // it will have 1 argument of qrCodeMessage
  // when it success scanned, it must be delayed for the next scan
  // so it wont be scanned twice
  // and use lastScannedQRCodeMessage to store the last scanned qrcode
  // and dont use lastScannedQRCodeMessage directly
  // because it will be updated after the delay
  const qrCodeSuccessCallback = debounce((qrCodeMessage: string) => {
    console.log("scanned", qrCodeMessage);
    setIsError(false);

    // set results
    setResults((prev) => [...prev, qrCodeMessage]);

    // last scanned qrcode
    if (tokenized !== qrCodeMessage) {
      setTokenized(qrCodeMessage);

      api
        .post("/api/attendance/apel/store", { nis: qrCodeMessage })
        // then console log the response
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
  }, 1000);

  //   use effect to remove last scanned qrcode after 3 seconds using interval
  useEffect(() => {
    const interval = setInterval(() => {
      setTokenized((prev) => "");
      // console.log("interval");
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // on alert is open then it will automatically close after 3 seconds
  useEffect(() => {
    // there are 2 sounds, success and error
    // success sound will be played when qrcode success scanned
    // error sound will be played when qrcode failed scanned
    const successSound = new Audio("/sounds/eventually.ogg");
    const errorSound = new Audio("/sounds/failure.ogg");
    if (alertOpened) {
      setTimeout(() => {
        setAlertOpened(false);
      }, 3000);

      // if it is error then play error sound
      if (isError) {
        errorSound.play();
      }

      // if it is not error then play success sound
      if (!isError) {
        successSound.play();
      }
    }
  }, [alertOpened, isError]);

  // these options are lottie options
  // it will be used to render lottie animation
  const errorOptions = {
    loop: true,
    autoplay: true,
    animationData: error,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const successOptions = {
    loop: true,
    autoplay: true,
    animationData: success,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <KonstaLayouts>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Page>
        <Navbar title='Dashboard' />
        <BlockTitle>Scan Kehadiran</BlockTitle>
        <Block>
          <div className='max-h-96 max-w-96'>
            <QRCode
              fps={10}
              qrbox={300}
              aspectRatio={1.0}
              disableFlip={false}
              verbose={false}
              qrCodeSuccessCallback={qrCodeSuccessCallback}
            />
          </div>
        </Block>
        <LatestAttendances />
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
