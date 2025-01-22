// src/renderer/_default.page.client.tsx
import { PageShell } from './PageShell'
import React from 'react'
import { hydrateRoot } from 'react-dom/client'
// import { PageShell } from '@/components/PageShell'

async function render(pageContext) {
  const { Page, pageProps } = pageContext
  hydrateRoot(
    document.getElementById('root')!,
    <PageShell isClient={true}>
      <Page {...pageProps} />
    </PageShell>
  )
}

export { render }
