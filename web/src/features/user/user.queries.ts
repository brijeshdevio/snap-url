import { useQuery } from "@tanstack/react-query";
import { UserServices } from "./user.services";
import { transform } from "@/utils";

export const useMe = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: UserServices.me,
    retry: 0,
    staleTime: Infinity,
    select: transform,
  });
