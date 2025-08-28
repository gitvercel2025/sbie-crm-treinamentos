import { useAuth } from "@/contexts/AuthContext";
import { ReactNode, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated && location.pathname !== "/login") {
      // Add small delay to prevent rapid redirects that cause DOM errors
      timeoutRef.current = setTimeout(() => {
        if (mountedRef.current) {
          navigate("/login", { replace: true });
        }
      }, 50);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isAuthenticated, loading, navigate, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sbie-beige-light via-sbie-beige to-sbie-beige-light">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sbie-brown mx-auto mb-4"></div>
          <p className="text-sbie-green-gray">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Vai redirecionar via useEffect
  }

  return <>{children}</>;
}
