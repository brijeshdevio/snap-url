import { type FormEvent } from "react";
import { Clipboard, X } from "lucide-react";
import { InputField } from "../ui/InputField";
import { useCreateSecret } from "@/queries/key.query";
import type { SecretForm } from "@/types/secret";
import { useModal } from "@/app/providers/modal-provider";
import { toast } from "sonner";

function SecretForm({
  onSubmit,
  isLoading = false,
}: {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}) {
  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <div>
        <InputField
          name="name"
          label="Display Name"
          placeholder="e.g. Production API Key"
        />
        <p className="text-accent-content/80 text-sm mt-1">
          A display name for the key. Maximum 50 characters.
        </p>
      </div>
      <div className="flex items-center justify-end">
        <button
          type="submit"
          className="btn btn-primary btn-gradient"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="loading loading-spinner"></span>
            </>
          ) : (
            <>Submit</>
          )}
        </button>
      </div>
    </form>
  );
}

function SecretCopy({ secret }: { secret: string }) {
  const { closeModal } = useModal();

  const handleCloseModal = () => closeModal();
  const handleClipboard = () => {
    navigator.clipboard.writeText(secret);
    toast.success("Secret copied to clipboard");
  };

  return (
    <>
      <div>
        <div className="flex items-center gap-2 w-full">
          <InputField disabled value={secret} className="!w-full" />
          <button className="btn btn-soft btn-circle" onClick={handleClipboard}>
            <Clipboard size={20} />
          </button>
        </div>
        <p className="text-warning/80 text-sm mt-1">
          This key will be generated and shown only once. Please copy it
          somewhere safe!
        </p>
      </div>
      <div className="mt-3 flex items-center justify-end">
        <button
          type="button"
          className="btn btn-gradient me-3"
          onClick={handleCloseModal}
        >
          Done
        </button>
      </div>
    </>
  );
}

export function NewSecretModal() {
  const { mutateAsync, isPending, data } = useCreateSecret();
  const { closeModal } = useModal();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries()) as SecretForm;
    mutateAsync(data);
  };

  const handleCloseModal = () => closeModal();

  return (
    <div className="card w-full sm:w-[600px] border border-white/5 shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <h3 className="text-xl text-accent-content">Create API Key</h3>
          <button
            className="btn btn-soft btn-circle bg-transparent"
            onClick={handleCloseModal}
          >
            <X size={20} />
          </button>
        </div>
        <div className="py-5">
          {data?.data?.secretHash ? (
            <SecretCopy secret={data?.data?.secretHash} />
          ) : (
            <SecretForm onSubmit={handleSubmit} isLoading={isPending} />
          )}
        </div>
      </div>
    </div>
  );
}
