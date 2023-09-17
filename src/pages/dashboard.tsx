// Importing necessary libraries and components
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
import WithNavbar from "@/components/with-navbar";

// Main function for the Dashboard page
export default function DashboardPage() {
  // State variables
  const [tokenized, setTokenized] = useState(""); // For storing tokenized QR code
  const [alertOpened, setAlertOpened] = useState(false); // For handling alert dialog
  const [message, setMessage] = useState(""); // For storing messages
  const [results, setResults] = useState([]); // For storing results
  const [isError, setIsError] = useState(false); // For error handling

  // Function to fetch attendances
  const fetchAttendances = useAttendance((state) => state.fetchAttendances);

  // Debounce function to prevent multiple scans in quick succession
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

  // Callback function for successful QR code scan
  const qrCodeSuccessCallback = debounce((qrCodeMessage: string) => {
    console.log("scanned", qrCodeMessage);
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
  }, 1000);

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

  // Lottie options for animations
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

  // Rendering the Dashboard page
  return (
    <KonstaLayouts>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Page>
        <WithNavbar>
          <Navbar title="Dashboard" />
          <BlockTitle>Scan Kehadiran</BlockTitle>
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
          <div className="mt-5">
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
