import { useAuth } from "@/hooks/auth";
import {
  BlockTitle,
  List,
  ListInput,
  ListButton,
  Dialog,
  DialogButton,
  Preloader,
} from "konsta/react";
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";

export default function LoginForm() {
  const { login, user } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/dashboard",
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [status, setStatus] = useState("idle");

  const submitForm = async (event: SyntheticEvent) => {
    event.preventDefault();

    login({ email, password, setErrors, setStatus });
  };

  // use effect to handle dialog when error
  const [alertOpened, setAlertOpened] = useState(false);

  useEffect(() => {
    console.log("error", status);
    if (status === "error") {
      setAlertOpened(true);
    }
  }, [status]);

  return (
    <>
      <BlockTitle>Masuk menggunakan akun smeduverse </BlockTitle>
      <List strongIos insetIos>
        <ListInput
          outline
          label='NIS / NIY / Email'
          type='text'
          placeholder='Identitas Kamu'
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setEmail(event.target.value)
          }
        />

        <ListInput
          outline
          label='Password'
          type='password'
          placeholder='Password'
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setPassword(event.target.value)
          }
        />
      </List>
      <List inset strong>
        <ListButton onClick={submitForm}>
          {status == "loading" ? <Preloader /> : "Masuk"}
        </ListButton>
      </List>

      <Dialog
        opened={alertOpened}
        onBackdropClick={() => setAlertOpened(false)}
        title='Akses Ditolak'
        content={errors ? errors : "Terjadi kesalahan saat login"}
        buttons={
          <DialogButton onClick={() => setAlertOpened(false)}>Ok</DialogButton>
        }
      />
    </>
  );
}
