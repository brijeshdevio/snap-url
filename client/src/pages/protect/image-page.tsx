import { Trash } from "lucide-react";
import { Loader, ToolTip } from "@/components";
import { useDeleteImage, useGetAllImages } from "@/queries/image.query";
import { formatBytes, formatDate } from "@/utils";

type ImageType = {
  _id: string;
  displayName?: string;
  publicId?: string;
  imageTokenHash: string;
  createdAt: string;
  mimeType: string;
  size: number;
};

function TableRow({ image }: { image: ImageType }) {
  const { mutate: deleteImage, isPending } = useDeleteImage();
  const imageUrl =
    import.meta.env.VITE_API_URL + "/images/" + image.displayName;
  const sortImageTokenHash = image.imageTokenHash.slice(0, 10) + "...";

  function handleDelete() {
    deleteImage(image.imageTokenHash);
  }

  return (
    <tr className="border-b border-white/10">
      <td>
        <img
          src={imageUrl}
          alt={image.displayName}
          className="w-14 h-14 object-cover rounded"
        />
      </td>
      <td>{image.displayName || image.publicId}</td>
      <td>{formatBytes(image.size)}</td>
      <td>{formatDate(image.createdAt)}</td>
      <td>{image.mimeType}</td>
      <td className="opacity-50">
        <ToolTip content={image.imageTokenHash}>{sortImageTokenHash}</ToolTip>
      </td>
      <td>
        <div className="flex items-center gap-3">
          <button
            className="btn btn-soft btn-error btn-circle"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <Trash size={20} />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}

function TableBody({ images = [] }: { images: ImageType[] }) {
  return (
    <tbody className="text-base opacity-90">
      {images?.map((image) => (
        <TableRow key={image._id} image={image} />
      ))}
    </tbody>
  );
}

function ImagesSection() {
  const { data, isPending, isError, error } = useGetAllImages();

  if (isPending) {
    return <Loader className="!h-[400px]" />;
  }

  if (isError) {
    return (
      <div className="text-center opacity-70 py-5">
        <span className="text-xl text-error">{error.message}</span>
      </div>
    );
  }

  if (data?.data?.length === 0) {
    return (
      <div className="text-center opacity-70 py-5">
        <span className="text-xl">No images yet?</span>
      </div>
    );
  }

  return (
    <div className="w-full max-h-[70vh] overflow-x-auto">
      <table className="table table-pin-rows shadow bg-base-200">
        <thead className="text-white/50">
          <tr>
            <th>IMAGE</th>
            <th>FILE NAME/ ID</th>
            <th>SIZE</th>
            <th>CREATED AT</th>
            <th>TYPE</th>
            <th>IMAGE HASH</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <TableBody images={data?.data} />
      </table>
    </div>
  );
}

export function ImagePage() {
  return (
    <>
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl">Images</h2>
            <p className="text-md opacity-80 mt-1 flex-wrap">
              Manage your project images. Remember to keep your images safe to
              prevent unauthorized access.
            </p>
          </div>
        </div>
      </section>
      <section className="mt-5">
        <ImagesSection />
      </section>
    </>
  );
}
