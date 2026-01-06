import { type FormEvent } from "react";
import { X } from "lucide-react";
import { InputField } from "../ui/InputField";
import { useCreateSecret } from "@/queries/key.query";
import type { SecretForm } from "@/types/secret";
import { useModal } from "@/app/providers/modal-provider";

export function NewSecretModal() {
  const { mutateAsync, isPending, isError } = useCreateSecret();
  const { closeModal } = useModal();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries()) as SecretForm;
    await mutateAsync(data).finally(() => {
      if (!isError) handleCloseModal();
    });
  };

  const handleCloseModal = () => closeModal();

  return (
    <div className="card w-[600px] border border-white/5 shadow-xl">
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
        <form className="flex flex-col gap-5 mt-5" onSubmit={handleSubmit}>
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
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner"></span>
                </>
              ) : (
                <>Submit</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
