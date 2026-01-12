import { useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { AuthService } from "@/services/auth.service";
import { notifyError, notifySuccess } from "@/utils";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export function useSignup() {
  const navigate = useNavigate();
  return useMutation({
    mutationKey: ["signup"],
    mutationFn: AuthService.signup,
    onSuccess: (data: AxiosResponse["data"]) => {
      notifySuccess(data.message);
      navigate("/resend-email?email=" + data?.data?.email);
    },
    onError: (error: unknown) => notifyError(error),
  });
}

export function useLogin() {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: AuthService.login,
    onSuccess: (data: AxiosResponse["data"]) => {
      notifySuccess(data.message);
      window.location.href = "/dashboard";
    },
    onError: (error: unknown) => notifyError(error),
  });
}

export function useVerifyEmail() {
  const [searchParams] = useSearchParams();
  const code = searchParams?.get("code");

  const { mutate, ...mutation } = useMutation({
    mutationKey: ["verify-email"],
    mutationFn: () => AuthService.verifyEmail(code!),
    onSuccess: (data: AxiosResponse["data"]) => notifySuccess(data.message),
    onError: (error: unknown) => notifyError(error),
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  return mutation;
}

export function useResendEmail() {
  return useMutation({
    mutationKey: ["resend-email"],
    mutationFn: AuthService.resendEmail,
    onSuccess: (data: AxiosResponse["data"]) => notifySuccess(data.message),
    onError: (error: unknown) => notifyError(error),
  });
}
