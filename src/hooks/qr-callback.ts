import { useEffect, useState } from "react";
import { api } from "@/hooks/auth";
import { useAttendance } from "@/store/attendance";
import { useQrCamera } from "@/store/qrcamera";

export const useQrCallback = () => {
  const [results, setResults] = useState<string[]>([]);

  const fetchAttendances = useAttendance((state) => state.fetchAttendances);

  const {
    qrMessage,
    alertOpened,
    setMessage,
    message,
    isError,
    setIsError,
    setAlertOpened,
    setQrMessage,
  } = useQrCamera((state) => ({
    qrMessage: state.qrMessage,
    alertOpened: state.alertOpened,
    setMessage: state.setMessage,
    message: state.message,
    isError: state.isError,
    setIsError: state.setIsError,
    setAlertOpened: state.setAlertOpened,
    setQrMessage: state.setQrMessage,
  }));

  const debouncedApiCall = (qrCodeMessage: string) => {
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
  };

  const qrCodeSuccessCallback = (qrCodeMessage: string) => {
    useQrCamera.getState();
    setIsError(false);
    setResults((prev) => [...prev, qrCodeMessage]);

    console.log(qrCodeMessage);
    console.log("tokenize", qrMessage);
    console.log("is Same", qrMessage != qrCodeMessage);

    if (qrMessage != qrCodeMessage) {
      setQrMessage(qrCodeMessage);

      console.log("qrMessage", qrMessage);
      debouncedApiCall(qrCodeMessage);

      // clear qr message after 3 seconds
      setTimeout(() => {
        setQrMessage("");
      }, 3600);
    }
  };

  // Effect to handle alert dialog and play sounds
  useEffect(() => {
    const successSound = new Audio("/sounds/successful.ogg");
    const errorSound = new Audio("/sounds/failure.ogg");

    if (alertOpened) {
      const st = setTimeout(() => {
        setAlertOpened(false);
      }, 3000);

      // Playing sounds based on success or failure
      if (isError) {
        // errorSound.play();
      }
      if (!isError) {
        // successSound.play();
      }
      // clear timeout
      return () => clearTimeout(st);
    }
  }, [alertOpened, isError, setAlertOpened]);

  return {
    alertOpened,
    setAlertOpened,
    message,
    isError,
    results,
    qrCodeSuccessCallback,
  };
};
