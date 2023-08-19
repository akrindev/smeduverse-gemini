import useSWR from "swr";
import Axios, { AxiosError } from "axios";
import { useEffect, useCallback } from "react";
import { useRouter } from "next/router";

const api = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      // window.location.pathname = '/'
      return;
    }
    return Promise.reject(error);
  }
);

const useAuth = ({
  middleware,
  redirectIfAuthenticated,
}: {
  middleware?: "auth" | "guest";
  redirectIfAuthenticated?: string;
}) => {
  const router = useRouter();

  const {
    data: user,
    error,
    mutate,
  } = useSWR("/api/user", () =>
    api
      .get("/api/user")
      .then((res) => res.data)
      .catch((error) => {
        if (error.response.status != 409) throw error;
      })
  );

  const login = async ({
    setErrors,
    setStatus,
    ...props
  }: {
    setErrors: (errors: string) => void;
    setStatus: (status: string) => void;
    [key: string]: any;
  }) => {
    setErrors("");
    setStatus("loading");

    api
      .post("/assembly-login", props)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        mutate(res.data.user);

        console.log("response", res.data);
        setStatus("idle");
      })
      .catch((error) => {
        console.log(error);
        console.log(error.message);
        // if (error.response?.status != 422) throw error;

        if (error.response?.status == 403) {
          setErrors(error.message);
          // status = 'error'
        }

        setStatus("error");
      });
    // .finally(() => setStatus("idle"));
  };

  const logout = useCallback(() => {
    if (!error) {
      localStorage.removeItem("token");
      mutate(null);
    }

    window.location.pathname = "/";
  }, [error, mutate]);

  useEffect(() => {
    if (middleware == "guest" && redirectIfAuthenticated && user)
      router.push(redirectIfAuthenticated);
    if (middleware == "auth" && error) logout();
  }, [user, error, middleware, redirectIfAuthenticated, router, logout]);

  return {
    user,
    login,
    logout,
  };
};

export { api, useAuth };
