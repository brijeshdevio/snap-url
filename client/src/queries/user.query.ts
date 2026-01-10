import { useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { UserService } from "@/services/user.service";
import { notifyError, notifySuccess } from "@/utils";
import { useUploadImage } from "./playground.query";
import { useEffect } from "react";

export function useUpdateProfile() {
  return useMutation({
    mutationKey: ["update-profile"],
    mutationFn: UserService.update,
    onSuccess: (data: AxiosResponse["data"]) => notifySuccess(data.message),
    onError: (error: unknown) => notifyError(error),
  });
}

export function useUpdateAvatar() {
  const X_UPLOAD_TOKEN = import.meta.env.VITE_UPLOAD_TOKEN;
  const {
    mutate: uploadImage,
    isPending: isUploading,
    data: uploadData,
  } = useUploadImage();

  const { mutate: updateAvatar, isPending: isUpdating } = useMutation({
    mutationKey: ["update-avatar"],
    mutationFn: UserService.avatar,
    onSuccess: (data: AxiosResponse["data"]) => notifySuccess(data.message),
    onError: (error: unknown) => notifyError(error),
  });

  function handleUpload(file: File) {
    uploadImage({ file, secret: X_UPLOAD_TOKEN });
  }

  useEffect(() => {
    if (uploadData?.data?.url) {
      const avatarUrl = uploadData.data.url?.split("images/")[1];
      updateAvatar({ avatar: avatarUrl });
    }
  }, [uploadData, updateAvatar]);

  return {
    isLoading: isUploading || isUpdating,
    handleUpload,
  };
}

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
