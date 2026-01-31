import { Plus } from "lucide-react";

export function Dashboard() {
  return (
    <>
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl">Projects</h2>
            <p className="text-md opacity-80 mt-1 flex-wrap">
              Manage your projects. Remember to keep your API keys safe to
              prevent unauthorized access.
            </p>
          </div>
          <div>
            <button className="btn btn-primary btn-gradient whitespace-nowrap text-sm">
              <Plus size={20} />
              <span>Create Project</span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
