import { Pen, Plus, Trash } from "lucide-react";
// import { apiKeys } from "@/dummy";
import { useDeleteSecret, useGetAllSecret } from "@/queries/key.query";
import { useModal } from "@/app/providers/modal-provider";
import { NewSecretModal } from "@/components/";
import { formatDate } from "@/utils";
import { Loader } from "@/components";

type SecretType = {
  _id: string;
  name: string;
  secretHash: string;
  createdAt: string;
  lastUsedAt: string;
  expiredAt: string;
  isActive: boolean;
  usedCount: number;
};

function TableRow({ secret }: { secret: SecretType }) {
  const { mutate: deleteSecret, isPending } = useDeleteSecret();

  function handleDelete() {
    deleteSecret(secret._id);
  }

  return (
    <tr className="border-b border-white/10">
      <td>{secret.name} </td>
      <td className="opacity-50">{secret.secretHash}</td>
      <td>{formatDate(secret.createdAt) ?? "__"}</td>
      <td>{formatDate(secret.lastUsedAt) ?? "__"}</td>
      <td>{formatDate(secret.expiredAt) ?? "__"}</td>
      <td>{secret.usedCount} API Calls</td>
      <td>
        <div className="flex items-center gap-3">
          <button className="btn btn-soft btn-circle">
            <Pen size={20} />
          </button>
          <button
            className="btn btn-soft btn-error btn-circle"
            onClick={handleDelete}
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

function TableBody({ secrets = [] }: { secrets: SecretType[] }) {
  return (
    <tbody className="text-base opacity-90">
      {secrets?.map((secret) => (
        <TableRow key={secret._id} secret={secret} />
      ))}
    </tbody>
  );
}

function ApiKeySection() {
  const { data, isPending, isError, error } = useGetAllSecret();

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
        <span className="text-xl">No secrets yet?</span>
      </div>
    );
  }

  return (
    <div className="w-full max-h-[70vh] overflow-x-auto">
      <table className="table table-pin-rows shadow bg-base-200">
        <thead className="text-white/50">
          <tr>
            <th>Name</th>
            <th>SECRET KEY</th>
            <th>CREATED</th>
            <th>LAST USED</th>
            <th>EXPIRES</th>
            <th>USAGE</th>
            <th></th>
          </tr>
        </thead>
        <TableBody secrets={data?.data || []} />
      </table>
    </div>
  );
}

export function DashboardPage() {
  const { openModal } = useModal();
  const handleOpenModal = () => openModal(<NewSecretModal />);

  return (
    <>
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl">API Keys</h2>
            <p className="text-md opacity-80 mt-1 flex-wrap">
              Manage your project API keys. Remember to keep your API keys safe
              to prevent unauthorized access.
            </p>
          </div>
          <div>
            <button
              className="btn btn-primary btn-gradient whitespace-nowrap"
              onClick={() => handleOpenModal()}
            >
              <Plus size={20} />
              <span>Create API Key</span>
            </button>
          </div>
        </div>
      </section>
      <section className="mt-5">
        <ApiKeySection />
      </section>
    </>
  );
}
