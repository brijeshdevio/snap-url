import { apiKeys } from "@/dummy";
import { Pen, Plus, Trash } from "lucide-react";

export function ApiKeyPage() {
  return (
    <section>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">API Keys</h2>
          <p className="text-md opacity-80 mt-1">
            Manage your project API keys. Remember to keep your API keys safe to
            prevent unauthorized access.
          </p>
        </div>
        <div>
          <button className="btn btn-primary btn-gradient">
            <Plus size={20} />
            <span>Create API Key</span>
          </button>
        </div>
      </div>

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
          <tbody className="text-base opacity-90">
            {apiKeys?.map((apiKey) => (
              <tr className="border-b border-white/10">
                <td>{apiKey.name} </td>
                <td className="opacity-50">
                  {apiKey.secretKey.slice(0, 3)}...{apiKey.secretKey.slice(-3)}
                </td>
                <td>{apiKey.created}</td>
                <td>{apiKey.lastUsed}</td>
                <td>{apiKey.expires}</td>
                <td>{apiKey.used24Hrs} API Calls</td>
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
        </table>
      </div>
    </section>
  );
}
