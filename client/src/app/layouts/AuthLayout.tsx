import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return <>
    <main className="w-full flex items-center justify-center sm:p-5">
      <div className="w-full rounded-2xl px-3 py-10 bg-base-200"><Outlet /></div>
    </main>
  </>
}