
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { StrictMode } from "react";

export const render = (url: string) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Disable retries on server-side
        retry: false,
        // Ensure queries are not refetched on mount
        refetchOnMount: false,
        // Disable background refetches
        refetchOnWindowFocus: false,
        // Disable revalidation
        staleTime: Infinity,
      },
    },
  });

  const html = renderToString(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </QueryClientProvider>
    </StrictMode>
  );

  // Dehydrate the store
  const dehydratedState = JSON.stringify(queryClient.getQueryCache().getAll().map(query => ({
    queryKey: query.queryKey,
    data: query.state.data
  })));

  return {
    html,
    head: `<script>window.__REACT_QUERY_STATE__ = ${dehydratedState};</script>`
  };
};
