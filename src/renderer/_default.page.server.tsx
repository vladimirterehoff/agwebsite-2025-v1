import ReactDOMServer from "react-dom/server";
import React from "react";
import { escapeInject, dangerouslySkipEscape } from "vite-plugin-ssr/server";
import { PageShell } from "./PageShell";
import "../index.css";

export { render };
export const passToClient = ['pageProps', 'urlPathname'];

async function render(pageContext: any) {
  const { Page, pageProps, urlPathname } = pageContext;
  const viewHtml = ReactDOMServer.renderToString(
    <PageShell url={urlPathname}>
      <Page {...pageProps} />
    </PageShell>
  );

  return escapeInject`<!DOCTYPE html>
    <html>
      <head>
        <title>Attract Group</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/index.css" />
      </head>
      <body>
        <div id="root">${dangerouslySkipEscape(viewHtml)}</div>
      </body>
    </html>`;
}