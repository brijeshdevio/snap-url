import { Copy, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui";
import { ModalWrapper } from "./ModalWrapper";
import { Input } from "../ui";
import { useCreateProjectFacade } from "@/features/project/project.hooks";
import { notifySuccess } from "@/utils";

function ViewApiKey({
  keyHash,
  onClose = () => {},
}: {
  keyHash: string;
  onClose: () => void;
}) {
  const handleClipboard = () => {
    navigator.clipboard.writeText(keyHash);
    notifySuccess("Api Key copied to clipboard");
  };

  return (
    <div className="space-y-4">
      <p className="text-warning text-sm">
        <strong>Note: </strong> Your new API key has been created. Copy it now,
        as we will not display it again.
      </p>
      <div>
        <input
          className="input overflow-clip text-ellipsis"
          defaultValue={keyHash}
          readOnly
        />
      </div>
      <div className="flex items-center justify-end gap-x-3">
        <Button className="btn-gradient btn-primary" onClick={handleClipboard}>
          <Copy className="h-4 w-4" />
          <span>Copy</span>
        </Button>
        <Button className="btn-gradient" onClick={onClose}>
          <span>Done</span>
        </Button>
      </div>
    </div>
  );
}

function Form({ onClose = () => {} }: { onClose: () => void }) {
  const { isPending, submit, handleSubmit, register, errors, isSuccess, data } =
    useCreateProjectFacade();

  if (isSuccess && data?.data) {
    return (
      <ViewApiKey onClose={onClose} keyHash={data.data?.project?.keyHash} />
    );
  }

  return (
    <form className="mt-2" onSubmit={handleSubmit(submit)}>
      <Input
        label="Display Name"
        placeholder="e.g. My Project"
        autoComplete="off"
        {...register("name")}
        error={errors.name}
      />
      <div className="mt-2 flex items-center justify-end gap-x-2">
        <Button
          className="btn-soft btn-error"
          onClick={onClose}
          isDisabled={isPending}
        >
          Close
        </Button>
        <Button
          type="submit"
          isLoading={isPending}
          className="btn-primary btn-gradient"
        >
          Create Project
        </Button>
      </div>
    </form>
  );
}

export function AddProjectModal() {
  const [isActive, setIsActive] = useState(false);

  function handleClose() {
    setIsActive(false);
  }

  return (
    <>
      <Button
        className="btn-gradient btn-primary"
        onClick={() => setIsActive(true)}
      >
        <Plus />
        <span>Create Project</span>
      </Button>

      <ModalWrapper isActive={isActive} onClose={handleClose}>
        <div className="card border border-white/10">
          <div className="card-body">
            <div>
              <h2 className="text-lg font-bold">Create Project</h2>
            </div>
            <Form onClose={handleClose} />
          </div>
        </div>
      </ModalWrapper>
    </>
  );
}
