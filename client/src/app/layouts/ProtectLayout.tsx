import { Outlet } from "react-router-dom";
import { Navbar } from "@/components";

export function ProtectLayout() {
  return (
    <>
      <Navbar />
      <main className="h-[calc(100vh-65px)] w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Outlet />
      </main>
    </>
  );
}
