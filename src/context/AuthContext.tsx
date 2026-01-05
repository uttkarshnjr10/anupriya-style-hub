import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  role: string;
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

  useEffect(() => {
    // DEBUG: Print what we find on load
    const storedUser = localStorage.getItem("afh_user");
    console.log("🔄 AuthContext Loading...");
    console.log("📦 Found in LocalStorage:", storedUser);

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("✅ Parsed User:", parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("❌ Failed to parse user data", error);
        localStorage.removeItem("afh_user");
      }
    } else {
      console.warn("⚠️ No user found in LocalStorage");
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    console.log("🔐 Login called with:", userData);
    setUser(userData);
    localStorage.setItem("afh_user", JSON.stringify(userData));
  };

  const logout = () => {
    console.log("👋 Logout called");
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