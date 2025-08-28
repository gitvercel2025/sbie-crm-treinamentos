import { useEffect, useRef } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

export default function ToastProvider() {
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      // Clean up any existing toasts to prevent DOM errors
      try {
        const toastElements = document.querySelectorAll('[data-radix-toast-viewport]');
        toastElements.forEach((element) => {
          if (element.parentNode) {
            element.remove();
          }
        });
      } catch (error) {
        // Ignore cleanup errors
      }
    };
  }, []);

  if (!mountedRef.current) {
    return null;
  }

  return (
    <>
      <Toaster />
      <Sonner />
    </>
  );
}
