import { useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { AuthService } from "@/services/auth.service";
import { notifyError, notifySuccess } from "@/utils";

export function useSignup() {
  return useMutation({
    mutationKey: ["signup"],
    mutationFn: AuthService.signup,
    onSuccess: (data: AxiosResponse["data"]) => notifySuccess(data.message),
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
