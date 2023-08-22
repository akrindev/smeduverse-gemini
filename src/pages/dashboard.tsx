import KonstaLayouts from "@/components/konsta-layouts";
import QRCode from "@/components/qrcode";
import { Page, Block, Navbar, Dialog, DialogButton } from "konsta/react";
import { useEffect, useState } from "react";
import { api } from "@/hooks/auth";

export default function DashboardPage() {
  const [tokenized, setTokenized] = useState("");
  const [alertOpened, setAlertOpened] = useState(false);
  //   message
  const [message, setMessage] = useState("");
  // results
  const [results, setResults] = useState([]);

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

    // set results
    setResults((prev) => [...prev, qrCodeMessage]);

    // last scanned qrcode
    if (tokenized !== qrCodeMessage) {
      setTokenized(qrCodeMessage);

      api
        .post("/api/attendance/apel/store", { nis: qrCodeMessage })
        // then console log the response
        .then((response) => {
          // hikshiks
          console.log("res", response);
          setAlertOpened(true);
          setMessage(response.data.message);
        })
        .catch((error) => {
          setAlertOpened(true);
          setMessage(error.response.data.message);
        });
    }
  }, 2500);

  //   use effect to remove last scanned qrcode after 3 seconds using interval
  useEffect(() => {
    const interval = setInterval(() => {
      setTokenized((prev) => "");
      console.log("interval");
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // on alert is open then it will automatically close after 3 seconds
  useEffect(() => {
    if (alertOpened) {
      setTimeout(() => {
        setAlertOpened(false);
      }, 1500);
    }
  }, [alertOpened]);

  return (
    <KonstaLayouts>
      <Page>
        <Navbar title='Dashboard' />
        <Block>Scan Kehadiran</Block>
        <Block>
          <div className='max-h-96 max-w-96'>
            <QRCode
              fps={10}
              qrbox={300}
              aspectRatio={1.0}
              disableFlip={true}
              verbose={false}
              qrCodeSuccessCallback={qrCodeSuccessCallback}
            />
          </div>
        </Block>
        <Block>{tokenized}</Block>
        <Block>{results}</Block>
      </Page>

      <Dialog
        opened={alertOpened}
        onBackdropClick={() => setAlertOpened(false)}
        title='Alert'
        content={message}
      />
    </KonstaLayouts>
  );
}
