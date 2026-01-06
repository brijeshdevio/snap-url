import { Pen, Plus, Trash } from "lucide-react";
// import { apiKeys } from "@/dummy";
import { useGetAllSecret } from "@/queries/key.query";
import { useEffect } from "react";
import { useModal } from "@/app/providers/modal-provider";
import { NewSecretModal } from "@/components/modals/new-secret-modal";
import { formatDate } from "@/utils";

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

function TableBody({ secrets = [] }: { secrets: SecretType[] }) {
  return (
    <tbody className="text-base opacity-90">
      {secrets?.map((secret) => (
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
              <button className="btn btn-soft btn-error btn-circle">
                <Trash size={20} />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
}

function ApiKeySection() {
  const { data, refetch } = useGetAllSecret();

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="w-full h-[70vh] overflow-x-auto mt-5">
      <table className="table table-pin-rows shadow bg-base-200">
        <thead className="text-white/50">
          <tr>
            <th>Name</th>
            <th>SECRET KEY</th>
            <th>CREATED</th>
            <th>LAST USED</th>
            <th>EXPIRES</th>
            <th>USAGE (24HRS)</th>
            <th></th>
          </tr>
        </thead>
        <TableBody secrets={data?.data || []} />
      </table>
    </div>
  );
}

export function ApiKeyPage() {
  const { openModal } = useModal();
  const handleOpenModal = () => openModal(<NewSecretModal />);

  return (
    <>
      <section>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl">API Keys</h2>
            <p className="text-md opacity-80 mt-1">
              Manage your project API keys. Remember to keep your API keys safe
              to prevent unauthorized access.
            </p>
          </div>
          <div>
            <button
              className="btn btn-primary btn-gradient"
              onClick={() => handleOpenModal()}
            >
              <Plus size={20} />
              <span>Create API Key</span>
            </button>
          </div>
        </div>
      </section>
      <section>
        <ApiKeySection />
      </section>
    </>
  );
}
