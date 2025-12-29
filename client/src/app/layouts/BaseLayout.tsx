import { Outlet } from "react-router-dom";
import { Navbar } from "@/components";

export function BaseLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
