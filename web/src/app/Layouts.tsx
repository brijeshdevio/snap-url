import { Outlet } from "react-router-dom";
import { Footer, Navbar } from "@/components/layouts";

export function BaseLayout() {
  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-[calc(100vh-130px)] w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export function AuthLayout() {
  return (
    <>
      <main className="w-full sm:p-5">
        <div className="bg-base-200/50 flex h-screen w-full items-center justify-center border border-white/10 px-3 py-10 shadow sm:rounded-2xl">
          <div className="w-full max-w-[350px]">
            <Outlet />
          </div>
        </div>
      </main>
    </>
  );
}
