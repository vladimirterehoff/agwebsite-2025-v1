// Libs
import React from 'react';
import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document';
import { ServerStyleSheets } from '@mui/styles';
import theme from '@/theme';

export default class MyDocument extends Document {
  static async getInitialProps(
      ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () => {
      return originalRenderPage({
        enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
      });
    }

    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      // Styles fragment is rendered after the app and page rendering finish.
      styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
    };
  }

  render() {
    return (
      <Html lang="en">
      <Head>
        <meta name="theme-color" content={theme.palette.primary.main} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
      </Html>
    );
  }
}