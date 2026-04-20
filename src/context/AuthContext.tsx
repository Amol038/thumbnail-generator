import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import type { IUser } from "../assets/assets";
import { ApiError, apiRequest } from "../lib/api";

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = LoginPayload & {
  name: string;
};

type AuthResponse = {
  user: IUser;
};

type AuthContextValue = {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<IUser>;
  register: (payload: RegisterPayload) => Promise<IUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const getCurrentUser = async () => {
  try {
    const response = await apiRequest<AuthResponse>("/api/auth/verify");
    return response.user;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }

    throw error;
  }
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    const loadUser = async () => {
      try {
        const nextUser = await getCurrentUser();
        if (!isCancelled) {
          setUser(nextUser);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadUser();

    return () => {
      isCancelled = true;
    };
  }, []);

  const refreshUser = async () => {
    setIsLoading(true);

    try {
      const nextUser = await getCurrentUser();
      setUser(nextUser);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (payload: LoginPayload) => {
    const response = await apiRequest<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: payload,
    });

    setUser(response.user);
    return response.user;
  };

  const register = async (payload: RegisterPayload) => {
    const response = await apiRequest<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: payload,
    });

    setUser(response.user);
    return response.user;
  };

  const logout = async () => {
    try {
      await apiRequest("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
