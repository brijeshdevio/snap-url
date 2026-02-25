import { Pen, Trash } from "lucide-react";
import { AddProjectModal } from "@/components/modals";
import { Loader } from "@/components/ui";
import { useGetProjectsQuery } from "@/features/project/project.queries";
import { formatTime } from "@/utils";
import type { ProjectDto } from "@/features/project/project.types";
import { Pagination } from "@/components/layouts";
import { useDeleteProjectMutation } from "@/features/project/project.mutations";
import { useState } from "react";

function Header() {
  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h2 className="text-2xl">Projects</h2>
        <p className="text-md mt-2 flex-wrap opacity-80">
          Manage your projects. Remember to keep your API keys safe to prevent
          unauthorized access.
        </p>
      </div>
      <div>
        <AddProjectModal />
      </div>
    </div>
  );
}

function Actions({ id, status }: { id: string; status: string }) {
  const [selectedId, setSelectedId] = useState("");
  const { mutate: deleteProject, isPending } = useDeleteProjectMutation();

  const handleDelete = (id: string) => {
    return () => {
      if (confirm("Are you sure you want to delete this project?")) {
        setSelectedId(id);
        deleteProject(id);
      }
    };
  };

  return (
    <div className="flex items-center gap-3">
      <button className="btn btn-soft btn-circle btn-sm">
        <Pen size={16} />
      </button>
      <button
        className="btn btn-soft btn-error btn-circle btn-sm"
        onClick={handleDelete(id)}
        disabled={(selectedId === id && isPending) || status !== "active"}
      >
        <Trash size={16} />
      </button>
    </div>
  );
}

function Status({ status }: { status: string }) {
  const statuss = {
    active: "active",
    revoked: "revoked",
    expired: "expired",
  };
  const activeStatus =
    statuss.active === status
      ? "badge-success"
      : statuss.expired === status
        ? "badge-error"
        : "badge-warning";
  return <span className={`badge badge-sm ${activeStatus}`}>{status}</span>;
}

function TableRow({
  id,
  name,
  status,
  usedCount,
  expiredAt,
  lastUsedAt,
}: ProjectDto) {
  return (
    <tr>
      <td>{name}</td>
      <td className="capitalize">
        <Status status={status} />
      </td>
      <td>{formatTime(lastUsedAt) || "Never"}</td>
      <td>{formatTime(expiredAt) || "Never"}</td>
      <td>{usedCount} API Calls</td>
      <td>
        <Actions id={id} status={status} />
      </td>
    </tr>
  );
}

function Project() {
  const { data, isPending, error } = useGetProjectsQuery();

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
              <th className="text-sm">Status</th>
              <th className="text-sm">Last Used</th>
              <th className="text-sm">Expired</th>
              <th className="text-sm">Usage</th>
              <th className="text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.projects?.map((project: ProjectDto) => (
              <TableRow key={project.id} {...project} />
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

export default function Dashboard() {
  return (
    <>
      <section className="mx-auto max-w-[1000px]">
        <Header />
        <Project />
      </section>
    </>
  );
}
