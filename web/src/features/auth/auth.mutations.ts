import { useMutation } from "@tanstack/react-query";
import { AuthServices } from "./auth.services";
import { notifyError } from "@/utils";

export const useRegisterMutation = () =>
  useMutation({
    mutationKey: ["register"],
    mutationFn: AuthServices.register,
    onError: (error: unknown) => notifyError(error),
  });

export const useLoginMutation = () =>
  useMutation({
    mutationKey: ["login"],
    mutationFn: AuthServices.login,
    onError: (error: unknown) => notifyError(error),
  });

export const useLogoutMutation = () =>
  useMutation({
    mutationKey: ["logout"],
    mutationFn: AuthServices.logout,
    onError: (error: unknown) => notifyError(error),
  });
