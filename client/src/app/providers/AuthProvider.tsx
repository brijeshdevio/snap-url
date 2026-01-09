import { useContext, useEffect, useState, type ReactNode } from "react";
import { UserService } from "@/services/user.service";

import type { AuthContextType } from "@/types";
import { createContext } from "react";

const initialState: AuthContextType = {
  user: null,
  isAuthenticated: false,
  loading: false,
};

const AuthContext = createContext<AuthContextType>(initialState);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async function () {
      try {
        const response = await UserService.profile();
        if (response?.data) {
          setUser(response.data);
          setIsAuthenticated(true);
        }
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const value = { user, isAuthenticated, loading };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used within a AuthProvider");
  return context;
};
