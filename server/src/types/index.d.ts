export type UploadImageRequest = {
  token: {
    _id: string;
    user: string;
    apiKey: string;
    purpose: string;
  };
};
