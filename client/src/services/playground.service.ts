import { http } from "./http";

export const playgroundService = {
  upload: async (data: any) =>
    (
      await http.post(
        "/uploads",
        { file: data?.file },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-Upload-Token": data?.secret,
          },
        }
      )
    ).data,
};
