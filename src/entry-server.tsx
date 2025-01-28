import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";

import App from "./App";
import { StrictMode } from "react";

interface IRenderProps {
  path: string;
}

export const render = (url: string) => {
  // console.log('>> params', params);
  const html = renderToString(
    <StrictMode>
      <h1>SERVER: {`${url}`}</h1>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>
  );

  return { html };
};
