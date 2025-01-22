import ReactDOMServer from "react-dom/server";
import React from "react";
import { escapeInject, dangerouslySkipEscape } from "vite-plugin-ssr/server";
import { PageShell } from "./PageShell";
import "../index.css";

export { render };
export { passToClient };

const passToClient = ['pageProps', 'urlPathname'];

async function render(pageContext: any) {
  const { Page, pageProps, urlPathname } = pageContext;
  
  if (!Page) throw new Error('My render() hook expects pageContext.Page to be defined');
  
  const viewHtml = ReactDOMServer.renderToString(
    <PageShell url={urlPathname}>
      <Page {...pageProps} />
    </PageShell>
  );

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Attract Group - Custom Software Development Solutions</title>
        <meta name="description" content="Transform your business with custom software solutions." />
        <link rel="stylesheet" href="/index.css" />
      </head>
      <body>
        <div id="root">${dangerouslySkipEscape(viewHtml)}</div>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {
      enableClientRouting: true,
      // This ensures the client-side router takes over after initial SSR
      redirectTo: undefined
    }
  };
}