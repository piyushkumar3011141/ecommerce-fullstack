import { createContext, useCallback, useContext, useRef, useState } from "react";
import "./Toast.css";

const ToastContext = createContext(null);

// Chhota sa message jo kuch second baad apne aap hat jata hai
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  const showToast = useCallback((message, type = "error") => {
    if (!message) return;
    clearTimeout(timer.current);
    setToast({ message, type });
    timer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className={`app-toast app-toast--${toast.type}`} role="status">
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
