import { Toaster } from "sonner";
import { AuthProvider, QueryProvider } from "./Providers";
import { Router } from "./Router";
import "@/styles/App.css";

export function App() {
  return (
    <>
      <QueryProvider>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </QueryProvider>
      <Toaster />
    </>
  );
}
