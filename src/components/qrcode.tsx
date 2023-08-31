import { Html5QrcodeScanner } from "html5-qrcode";
import { Html5QrcodeScannerConfig } from "html5-qrcode/esm/html5-qrcode-scanner";
import { useEffect } from "react";

const qrcodeRegionId = "html5qr-code-id-id";

interface ConfigProps extends Html5QrcodeScannerConfig {
  fps: number;
  qrbox?: number;
  aspectRatio?: number | undefined;
  disableFlip?: boolean;
  verbose?: boolean;
  qrCodeSuccessCallback?: (decodedText: string, decodedResult: any) => void;
  qrCodeErrorCallback?: (errorMessage: string) => void;
}

// Creates the configuration object for Html5QrcodeScanner.
const createConfig = (props: ConfigProps) => {
  let config: ConfigProps = {
    fps: 25,
    qrbox: 260,
    aspectRatio: 1,
    disableFlip: false,
    verbose: false,
    rememberLastUsedCamera: true,
  };

  if (props.fps) {
    config.fps = props.fps;
  }

  if (props.qrbox) {
    config.qrbox = props.qrbox;
  }

  if (props.aspectRatio) {
    config.aspectRatio = props.aspectRatio;
  }

  if (props.disableFlip !== undefined) {
    config.disableFlip = props.disableFlip;
  }

  return config;
};

const QRCode = (props: ConfigProps) => {
  useEffect(() => {
    // when component mounts
    const config = createConfig(props);
    const verbose = props.verbose === true;

    // Suceess callback is required.
    if (!props.qrCodeSuccessCallback) {
      throw "qrCodeSuccessCallback is required callback.";
    }

    const html5QrcodeScanner = new Html5QrcodeScanner(
      qrcodeRegionId,
      config,
      verbose
    );

    html5QrcodeScanner.render(
      props.qrCodeSuccessCallback,
      props.qrCodeErrorCallback
    );

    // cleanup function when component will unmount
    return () => {
      html5QrcodeScanner.clear().catch((error) => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, []);

  return <div id={qrcodeRegionId} className='max-h-96 max-w-96' />;
};

export default QRCode;
