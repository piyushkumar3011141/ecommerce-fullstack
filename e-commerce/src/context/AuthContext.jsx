import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { loginUser, signupUser, updateUser } from "../services/userApi";
import {
  getErrorMessage,
  SESSION_KEY,
  TOKEN_KEY,
} from "../services/axiosConfig";

const AuthContext = createContext(null);

// =========================
// LOAD CURRENT USER
// =========================

function loadSessionUser() {
  try {
    const user = JSON.parse(localStorage.getItem(SESSION_KEY));
    const token = localStorage.getItem(TOKEN_KEY);

    // Token ke bina session bekaar hai
    if (!user || !token || token === "undefined") {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, user.token);
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

// =========================
// AUTH PROVIDER
// =========================

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(loadSessionUser);

  // =========================
  // LOGIN  -> { ok, message }
  // =========================

  const login = async ({ email, password }) => {
    try {
      const response = await loginUser({ email, password });
      saveSession(response.data);
      setCurrentUser(response.data);
      return { ok: true };
    } catch (error) {
      console.error("Login Error:", error);
      return {
        ok: false,
        message: getErrorMessage(error, "Invalid email or password."),
      };
    }
  };

  // =========================
  // SIGNUP -> { ok, message }
  // (backend token bhi deta hai, to seedha login ho jata hai)
  // =========================

  const signup = async ({ name, email, password, phone }) => {
    try {
      const response = await signupUser({ name, email, password, phone });
      saveSession(response.data);
      setCurrentUser(response.data);
      return { ok: true };
    } catch (error) {
      console.error("Signup Error:", error);
      return {
        ok: false,
        message: getErrorMessage(error, "Signup failed. Please try again."),
      };
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = useCallback(() => {
    clearSession();
    setCurrentUser(null);
  }, []);

  // Token expire hone par axios ye event bhejta hai
  useEffect(() => {
    window.addEventListener("ecom:unauthorized", logout);
    return () => window.removeEventListener("ecom:unauthorized", logout);
  }, [logout]);

  // =========================
  // UPDATE PROFILE (name, phone, optional password)
  // Token wahi rehta hai
  // =========================

  const updateProfile = async ({ name, phone, password }) => {
    if (!currentUser) {
      return { ok: false, message: "Please login first." };
    }

    try {
      const body = { name, phone };
      if (password) body.password = password;

      const response = await updateUser(currentUser.id, body);

      const updatedUser = { ...currentUser, ...response.data };
      saveSession(updatedUser);
      setCurrentUser(updatedUser);

      return { ok: true };
    } catch (error) {
      console.error("Profile Update Error:", error);
      return {
        ok: false,
        message: getErrorMessage(error, "Profile update failed."),
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoggedIn: !!currentUser,
        isAdmin: currentUser?.role === "ADMIN",
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =========================
// CUSTOM HOOK
// =========================

export const useAuth = () => useContext(AuthContext);
