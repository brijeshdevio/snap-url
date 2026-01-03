import { isAxiosError } from "axios";
import { toast } from "sonner";

export const globalError = (error: unknown) => {
  if (isAxiosError(error)) {
    if (error.code === "ERR_NETWORK") toast.error("Internal Server Error");
    else toast.error(error.response?.data.message || "Internal Server Error");
  }
};
