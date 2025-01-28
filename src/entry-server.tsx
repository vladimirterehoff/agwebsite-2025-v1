import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { StrictMode } from "react";

export const render = (url: string) => {
  const queryClient = new QueryClient();
  
  const html = renderToString(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <StaticRouter location={url}>
          <App url={url} />
        </StaticRouter>
      </QueryClientProvider>
    </StrictMode>
  );

  return { html };
};