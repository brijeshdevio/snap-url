import { Eye, Pen, Trash, Upload } from "lucide-react";
import { Button, Loader } from "@/components/ui";
import { formatByte, formatTime } from "@/utils";
import { useGetImagesQuery } from "@/features/image/image.queries";
import { Pagination } from "@/components/layouts";
import type { ImageDto } from "@/features/image/image.types";
import { useDeleteImageMutation } from "@/features/image/image.mutations";

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

function TableRow({ id, name, size, mimeType, createdAt }: ImageDto) {
  const { mutateAsync: deleteImage, isPending: isDeleting } =
    useDeleteImageMutation();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this image?")) {
      deleteImage(id);
    }
  };

  return (
    <tr>
      <td className="max-w-40 overflow-hidden text-ellipsis" title={name}>
        {name}
      </td>
      <td>{mimeType}</td>
      <td>{formatByte(size)}</td>
      <td>{formatTime(createdAt) || "__"}</td>
      <td>
        <div className="flex items-center gap-3">
          <button className="btn btn-soft btn-circle btn-sm">
            <Pen size={16} />
          </button>
          <Button
            className="btn btn-soft btn-error btn-circle btn-sm"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            <Trash size={16} />
          </Button>
          <button className="btn btn-soft btn-circle btn-sm">
            <Eye size={16} />
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
