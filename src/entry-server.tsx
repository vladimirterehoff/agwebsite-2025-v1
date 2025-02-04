import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { QueryClient, QueryClientProvider, dehydrate } from "@tanstack/react-query";
import App from "./App";
import { StrictMode, Suspense } from "react";

export const render = (url: string) => {
  const queryClient = new QueryClient();
  
  const html = renderToString(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<div>Loading...</div>}>
          <StaticRouter location={url}>
            <App />
          </StaticRouter>
        </Suspense>
      </QueryClientProvider>
    </StrictMode>
  );

  return {
    html,
    head: `<script>window.__REACT_QUERY_STATE__ = ${JSON.stringify(dehydrate(queryClient))}</script>`
  };
};