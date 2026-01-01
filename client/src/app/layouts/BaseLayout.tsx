import { Outlet } from "react-router-dom";
import { Footer, Navbar } from "@/components";

export function BaseLayout() {
  return (
    <>
      <Navbar />
      <main className="w-full sm:w-[90%] mx-auto px-3 py-5 mt-[63px]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
