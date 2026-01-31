import { useEffect } from "react";
import {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
} from "./auth.mutations";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoginSchema,
  type LoginDto,
  RegisterSchema,
  type RegisterDto,
} from "./auth.schema";
import { notifySuccess } from "@/utils";

export const useRegisterFacade = () => {
  const { mutate, isPending, isSuccess, data } = useRegisterMutation();
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RegisterDto>({
    resolver: zodResolver(RegisterSchema),
  });

  function submit(data: RegisterDto) {
    mutate(data);
  }

  useEffect(() => {
    if (isSuccess && data) {
      notifySuccess(data.message);
      navigate("/login");
    }
  }, [isSuccess, data, navigate]);

  return { submit, isPending, register, handleSubmit, errors };
};

export const useLoginFacade = () => {
  const { mutate, isPending, isSuccess, data } = useLoginMutation();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginDto>({
    resolver: zodResolver(LoginSchema),
  });

  function submit(data: LoginDto) {
    mutate(data);
  }

  useEffect(() => {
    if (isSuccess && data) {
      notifySuccess(data.message);
      window.location.href = "/dashboard";
    }
  }, [isSuccess, data]);

  return { submit, isPending, register, handleSubmit, errors };
};

export const useLogoutFacade = () => {
  const { mutate, isSuccess } = useLogoutMutation();

  useEffect(() => {
    if (isSuccess) window.location.reload();
  }, [isSuccess]);
  return { logout: mutate };
};
