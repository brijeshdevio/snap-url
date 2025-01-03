import { Outlet } from "react-router-dom";
import { Navbar } from "@/components";

export function ProtectLayout() {
  return (
    <>
      <Navbar />
      <main className="w-full h-[calc(100vh-50px)] px-5 py-10 mt-[50px]">
        <Outlet />
      </main>
    </>
  );
}
