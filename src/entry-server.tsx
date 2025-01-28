import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";
import { StrictMode } from "react";

export const render = (url: string) => {
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App url={url} />
      </StaticRouter>
    </StrictMode>
  );

  return { html };
};