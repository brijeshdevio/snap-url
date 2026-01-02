import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components";

export function ProtectLayout() {
  return (
    <>
      <Sidebar />
      <main className="fixed top-0 left-14 md:left-72">
        <Outlet />
      </main>
    </>
  );
}
