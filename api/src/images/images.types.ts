export type CreateResponse = {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  createdAt: string;
};

export type FindAllResponse = {
  images: {
    id: string;
    key: string;
    name: string;
    size: number;
    mimeType: string;
    createdAt: Date | null;
  }[];
};
