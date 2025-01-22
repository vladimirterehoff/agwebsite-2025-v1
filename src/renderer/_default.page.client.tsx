import { PageShell } from './PageShell'
import React from 'react'
import { hydrateRoot } from 'react-dom/client'

async function render(pageContext: any) {
  const { Page, pageProps } = pageContext
  hydrateRoot(
    document.getElementById('root')!,
    <PageShell isClient={true}>
      <Page {...pageProps} />
    </PageShell>
  )
}

export { render }