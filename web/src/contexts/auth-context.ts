import { createContext } from "react";
import type { UserDto } from "@/features/user/user.types";

type AuthContext = {
  user: UserDto | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

const initialState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
};

export const AuthContext = createContext<AuthContext>(initialState);
