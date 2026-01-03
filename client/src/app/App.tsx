import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "./providers/AuthProvider";
import { AppRoutes } from "./routes/AppRoutes";
import "@/App.css";
import { ModalProvider } from "./providers/modal-provider";

function App() {
  return (
    <>
      <QueryClientProvider client={new QueryClient()}>
        <AuthProvider>
          <ModalProvider>
            <AppRoutes />
          </ModalProvider>
        </AuthProvider>
      </QueryClientProvider>
      <Toaster />
    </>
  );
}

export { App };
