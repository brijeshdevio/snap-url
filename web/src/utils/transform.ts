import type { AxiosResponse } from "axios";

export function transform(data: AxiosResponse["data"]) {
  return { ...data?.data, ...data, data: undefined };
}
