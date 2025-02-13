
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { QueryClient, QueryClientProvider, dehydrate } from "@tanstack/react-query";
import App from "./App";
import { StrictMode } from "react";

export const render = (url: string) => {
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

  const html = renderToString(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </QueryClientProvider>
    </StrictMode>
  );

  // Use the proper dehydrate function
  const dehydratedState = dehydrate(queryClient);

  return {
    html,
    head: `<script>window.__REACT_QUERY_STATE__ = ${JSON.stringify(dehydratedState)};</script>`
  };
};
