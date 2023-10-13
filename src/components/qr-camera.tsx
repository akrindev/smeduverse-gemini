import { Block } from "konsta/react";
import QRCode from "./qrcode";

import { useQrCallback } from "@/hooks/qr-callback";
import { useCallback, useEffect } from "react";

import { useQrCamera } from "@/store/qrcamera";

export function QrCamera() {
  const { qrCodeSuccessCallback } = useQrCallback();

  const { setQrMessage, qrMessage } = useQrCamera((state) => ({
    setQrMessage: state.setQrMessage,
    qrMessage: state.qrMessage,
  }));

  const handleSuccessCallback = useCallback(
    (qrCodeMessage: string) => {
      // console both qrMessage and qrCodeMessage
      console.log("qrMessage", qrMessage);
      console.log("qrCodeMessage", qrCodeMessage);
      // test bool
      console.log("qrMessage != qrCodeMessage", qrMessage != qrCodeMessage);
      if (qrMessage != qrCodeMessage) {
        setQrMessage(qrCodeMessage);

        qrCodeSuccessCallback(qrCodeMessage);
      }
    },
    [qrCodeSuccessCallback, setQrMessage, qrMessage]
  );

  console.log("rendered qrcamera");

  useEffect(() => {
    useQrCamera.getState();
  }, []);

  return (
    <>
      <Block>
        <QRCode
          fps={10}
          qrbox={300}
          aspectRatio={1.0}
          disableFlip={false}
          verbose={false}
          qrCodeSuccessCallback={handleSuccessCallback}
        />
      </Block>
    </>
  );
}
