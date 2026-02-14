import { Download, Eye, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, Loader } from "../ui";
import { ModalWrapper } from "./ModalWrapper";
import { useGetImageQuery } from "@/features/image/image.queries";
import { formatByte, formatTime } from "@/utils";
import { useDeleteImageMutation } from "@/features/image/image.mutations";

function ViewImage({
  imageId,
  onClose = () => {},
}: {
  imageId: string;
  onClose: () => void;
}) {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const { refetch, data, isPending, error, isError } =
    useGetImageQuery(imageId);
  const { mutateAsync: deleteImage, isPending: isDeleting } =
    useDeleteImageMutation();

  useEffect(() => {
    if (imageId) refetch();
  }, [imageId, refetch]);

  if (isPending) {
    return <Loader />;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  const imageURL = `${import.meta.env.VITE_API_URL}/images/view/${data?.image?.signKey}`;

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this image?")) {
      deleteImage(data.image.id);
    }
  };

  return (
    <>
      <div>
        <img
          src={imageURL}
          alt={data?.image?.name}
          className="max-h-60 min-w-full rounded-lg object-cover"
        />
      </div>
      <div className="mt-2 space-y-2">
        <div className="flex items-center gap-4">
          <p className="text-base-content/70 w-20 text-sm whitespace-nowrap">
            File Name
          </p>
          <p className="line-clamp-1 max-w-50 overflow-hidden text-sm text-ellipsis">
            : {data?.image?.name}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-base-content/70 w-20 text-sm">Mime Type</p>
          <p className="text-sm">: {data?.image?.mimeType}</p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-base-content/70 w-20 text-sm">File Size</p>
          <p className="text-sm">: {formatByte(data?.image?.size)}</p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-base-content/70 w-20 text-sm">Upload Date</p>
          <p className="text-sm">: {formatTime(data?.image?.createdAt)}</p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-base-content/70 w-20 text-sm">Project</p>
          <p className="text-sm">: {data?.image?.project?.name}</p>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-x-2">
        <a href={`${BASE_URL}/images/download/${data?.image?.signKey}`}>
          <Button className="btn btn-soft btn-primary">
            <Download size={20} />
          </Button>
        </a>
        <Button
          className="btn btn-soft btn-error"
          isLoading={isDeleting}
          onClick={handleDelete}
        >
          <Trash size={20} />
        </Button>
        <Button className="btn btn-soft" onClick={onClose}>
          <X size={20} />
        </Button>
      </div>
    </>
  );
}

export function ViewImageModal({ imageId }: { imageId: string }) {
  const [isActive, setIsActive] = useState(false);

  function handleClose() {
    setIsActive(false);
  }

  return (
    <>
      <Button
        className="btn btn-soft btn-circle btn-sm"
        onClick={() => setIsActive(true)}
      >
        <Eye size={16} />
      </Button>

      <ModalWrapper isActive={isActive} onClose={handleClose}>
        <div className="card border border-white/10">
          <div className="card-body">
            <ViewImage imageId={imageId} onClose={handleClose} />
          </div>
        </div>
      </ModalWrapper>
    </>
  );
}
