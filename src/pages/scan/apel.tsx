import KonstaLayouts from "@/components/konsta-layouts";
import LatestAttendances from "@/components/latest-attendances";
import WithNavbar from "@/components/with-navbar";
import { BlockTitle, Dialog, Navbar, NavbarBackLink, Page } from "konsta/react";
import Head from "next/head";
import { QrCamera } from "@/components/qr-camera";
import { useQrCallback } from "@/hooks/qr-callback";
import Lottie from "react-lottie";

import { errorOptions, successOptions } from "@/lib/lottie-options";
import { useQrCamera } from "@/store/qrcamera";
import { useEffect } from "react";

export default function ScanApel() {
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

  useEffect(() => {
    useQrCamera.getState();
  }, []);

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
          <QrCamera />
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
