
import "./index.css";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import App from "./App";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Match server config
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  },
});

// Hydrate the app
hydrateRoot(
  document.getElementById("root") as HTMLElement,
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={(window as any).__REACT_QUERY_STATE__}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HydrationBoundary>
    </QueryClientProvider>
  </StrictMode>
);
