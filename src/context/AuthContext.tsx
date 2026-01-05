import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  role: "owner" | "staff";
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Check LocalStorage on Load (Restores session on refresh)
  useEffect(() => {
    const storedUser = localStorage.getItem("afh_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data");
        localStorage.removeItem("afh_user");
      }
    }
    setIsLoading(false);
  }, []);

  // 2. Login Function (Call this from Login.tsx)
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("afh_user", JSON.stringify(userData));
  };

  // 3. Logout Function
//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("afh_user");
//     // Also clear cookies via API if possible
//     window.location.href = "/login";
//   };
const logout = () => {
    setUser(null);
    localStorage.removeItem("afh_user");
    
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};