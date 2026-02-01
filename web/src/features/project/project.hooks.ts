import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateProjectSchema, type CreateProjectDto } from "./project.schema";
import { useCreateProjectMutation } from "./project.mutations";
import { notifySuccess } from "@/utils";

export const useCreateProjectFacade = () => {
  const { mutate, isPending, data, isSuccess } = useCreateProjectMutation();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateProjectDto>({
    resolver: zodResolver(CreateProjectSchema),
  });

  function submit(data: CreateProjectDto) {
    mutate(data);
  }

  useEffect(() => {
    if (isSuccess && data) {
      notifySuccess(data.message);
    }
  }, [isSuccess, data]);

  return { submit, isPending, register, handleSubmit, errors, data, isSuccess };
};
