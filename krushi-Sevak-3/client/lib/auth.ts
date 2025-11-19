import { createContext, useContext, useState, ReactNode, FC, createElement } from "react";

export type UserRole = "user" | "admin";

export interface User {
  id: string;
  username: string;
  role: UserRole;
}

export interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  canAccessCrops: () => boolean;
  canAccessFinance: () => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "authUser";

// Simulated user database
const VALID_USERS: Record<string, { password: string; role: UserRole }> = {
  farmer: { password: "password123", role: "user" },
  admin: { password: "admin123", role: "admin" },
};

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 500));

    const userConfig = VALID_USERS[username];
    if (!userConfig || userConfig.password !== password) {
      return false;
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      username,
      role: userConfig.role,
    };

    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const isLoggedIn = user !== null;

  const value: AuthContextType = {
    user,
    isLoggedIn,
    login,
    logout,
    canAccessCrops: () => isLoggedIn,
    canAccessFinance: () => isLoggedIn,
  };

  return createElement(AuthContext.Provider, { value }, children);
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
