import { Pen, Trash, Upload } from "lucide-react";
import { Button, Loader } from "@/components/ui";
import { formatByte, formatTime } from "@/utils";
import { useGetImagesQuery } from "@/features/image/image.queries";
import { Pagination } from "@/components/layouts";
import type { ImageDto } from "@/features/image/image.types";

function Header() {
  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h2 className="text-2xl">Images</h2>
        <p className="text-md mt-2 flex-wrap opacity-80">
          Upload and manage your images.
        </p>
      </div>
      <div>
        <Button className="btn-primary btn-gradient">
          <Upload size={20} />
          <span>Upload</span>
        </Button>
      </div>
    </div>
  );
}

function TableRow({ name, size, mimeType, createdAt }: ImageDto) {
  return (
    <tr>
      <td>{name}</td>
      <td>{mimeType}</td>
      <td>{formatByte(size)}</td>
      <td>{formatTime(createdAt) || "__"}</td>
      <td>
        <div className="flex items-center gap-3">
          <button className="btn btn-soft btn-circle btn-sm">
            <Pen size={16} />
          </button>
          <button className="btn btn-soft btn-error btn-circle btn-sm">
            <Trash size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function ImageList() {
  const { data, isPending, error } = useGetImagesQuery();

  if (isPending) {
    return <Loader className="h-60" />;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <>
      <div className="mt-5 max-h-[70vh] w-full overflow-x-auto">
        <table className="table-pin-rows table shadow">
          <thead className="text-base-content/70 uppercase">
            <tr>
              <th className="text-sm">Name</th>
              <th className="text-sm">Mime Type</th>
              <th className="text-sm">Size</th>
              <th className="text-sm">Created At</th>
              <th className="text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.images?.map((image: ImageDto) => (
              <TableRow key={image.id} {...image} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center justify-center">
        <Pagination {...data?.pagination} />
      </div>
    </>
  );
}

export function Images() {
  return (
    <section className="mx-auto max-w-[1000px]">
      <Header />
      <ImageList />
    </section>
  );
}
