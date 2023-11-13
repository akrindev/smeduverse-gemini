import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface QrCameraState {
  qrMessage: string | number;
  isError: boolean;
  message: string;
  alertOpened: boolean;
  setQrMessage: (message: string | number) => void;
  setAlertOpened: (alertOpened: boolean) => void;
  setIsError: (isError: boolean) => void;
  setMessage: (message: string) => void;
}

const useQrCamera = create<QrCameraState>()(
  devtools(
    persist(
      (set) => ({
        qrMessage: "",
        isError: false,
        message: "",
        alertOpened: false,
        setQrMessage: (message) => set({ qrMessage: message }),
        setAlertOpened: (alertOpened) => set({ alertOpened }),
        setIsError: (isError) => set({ isError }),
        setMessage: (message) => set({ message }),
      }),
      {
        name: "smeduverse-gemini-qr-message",
      }
    )
  )
);

export { useQrCamera };
