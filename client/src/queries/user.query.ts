import { useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { UserService } from "@/services/user.service";
import { notifyError, notifySuccess } from "@/utils";

export function useChangeEmail() {
  return useMutation({
    mutationKey: ["change-email"],
    mutationFn: UserService.changeEmail,
    onSuccess: (data: AxiosResponse["data"]) => notifySuccess(data.message),
    onError: (error: unknown) => notifyError(error),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationKey: ["change-password"],
    mutationFn: UserService.changePassword,
    onSuccess: (data: AxiosResponse["data"]) => notifySuccess(data.message),
    onError: (error: unknown) => notifyError(error),
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationKey: ["delete-account"],
    mutationFn: UserService.deleteAccount,
    onSuccess: (data: AxiosResponse["data"]) => {
      notifySuccess(data.message);
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    },
    onError: (error: unknown) => notifyError(error),
  });
}
