import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return <>
    <main className="w-full sm:p-5">
      <div className="w-full h-screen flex items-center justify-center sm:rounded-2xl px-3 py-10 bg-base-200/50 border border-secondary/10 shadow">
        <Outlet />
      </div>
    </main>
  </>
} 