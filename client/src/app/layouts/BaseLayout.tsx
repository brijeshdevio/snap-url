import { Outlet } from "react-router-dom";
import { Footer, Navbar } from "@/components";

export function BaseLayout() {
  return (
    <>
      <Navbar />
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
