import { Pen, Trash } from "lucide-react";
import { AddProjectModal } from "@/components/modals";
import { Loader } from "@/components/ui";
import { useGetProjectsQuery } from "@/features/project/project.queries";
import { formatTime } from "@/utils";
import type { ProjectDto } from "@/features/project/project.types";
import { Pagination } from "@/components/layouts";

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

function TableRow({
  name,
  status,
  usedCount,
  expiredAt,
  lastUsedAt,
}: ProjectDto) {
  return (
    <tr>
      <td>{name}</td>
      <td className="capitalize">{status}</td>
      <td>{formatTime(lastUsedAt) || "__"}</td>
      <td>{formatTime(expiredAt) || "__"}</td>
      <td>{usedCount} API Calls</td>
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

export function Dashboard() {
  return (
    <>
      <section className="mx-auto max-w-[1000px]">
        <Header />
        <Project />
      </section>
    </>
  );
}
