export type CurrentUser = {
  user: { id: string };
};

export type SaveImage = {
  name: string;
  size: number;
  mimeType: string;
  signKey: string;
};

export type FileUploadAuth = {
  project: {
    id: string;
    userId: string;
  };
};
