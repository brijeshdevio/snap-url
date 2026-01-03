import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "./providers/AuthProvider";
import { AppRoutes } from "./routes/AppRoutes";
import "@/App.css";

function App() {
  return (
    <>
      <QueryClientProvider client={new QueryClient()}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </QueryClientProvider>
      <Toaster />
    </>
  );
}

export { App };
