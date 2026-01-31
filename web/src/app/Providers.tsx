import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode } from "react";
import { AuthContext } from "@/contexts/auth-context";
import { useMe } from "@/features/user/user.queries";

// auth provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isPending, isSuccess } = useMe();

  return (
    <AuthContext.Provider
      value={{
        user: data?.user,
        isLoading: isPending,
        isAuthenticated: isSuccess && data?.user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// query provider
export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  );
}
