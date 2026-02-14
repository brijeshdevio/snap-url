import { ImageServices } from "./image.services";

export const useImageDownload = () => {
  const download = (signKey: string) => {
    alert("Download");
    ImageServices.download(signKey);
  };

  return { download };
};
