
import "./index.css";
import { StrictMode, Suspense } from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import App from "./App";

// Loading component for the entire app
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      suspense: true, // Enable suspense mode
    },
  },
});

// Hydrate the app
hydrateRoot(
  document.getElementById("root") as HTMLElement,
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={(window as any).__REACT_QUERY_STATE__}>
        <Suspense fallback={<LoadingFallback />}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Suspense>
      </HydrationBoundary>
    </QueryClientProvider>
  </StrictMode>
);
