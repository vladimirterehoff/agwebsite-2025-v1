import { PageShell } from './PageShell'
import React from 'react'
import { hydrateRoot } from 'react-dom/client'

export { render }

async function render(pageContext: any) {
  const { Page, pageProps } = pageContext
  const rootElement = document.getElementById('root')
  
  if (!rootElement) {
    console.error('Root element not found for hydration')
    return
  }

  hydrateRoot(
    rootElement,
    <PageShell isClient={true}>
      <Page {...pageProps} />
    </PageShell>
  )
}

// Enable Client-side Routing
export const clientRouting = true

// Ensure pages are rendered only once
export const hydrationCanBeAborted = true