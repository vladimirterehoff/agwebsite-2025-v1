import { PageShell } from './PageShell'
import React from 'react'
import { hydrateRoot } from 'react-dom/client'

export { render }
export { onHydrationEnd }
export { onPageTransitionStart }
export { onPageTransitionEnd }

async function render(pageContext: any) {
  const { Page, pageProps } = pageContext
  const rootElement = document.getElementById('root')
  
  if (!rootElement) {
    throw new Error('DOM element #root not found')
  }

  hydrateRoot(
    rootElement,
    <PageShell isClient={true}>
      <Page {...pageProps} />
    </PageShell>
  )
}

function onHydrationEnd() {
  console.log('Hydration finished; page is now interactive.')
}
function onPageTransitionStart() {
  console.log('Page transition start')
}
function onPageTransitionEnd() {
  console.log('Page transition end')
}

// Enable Client-side Routing
export const clientRouting = true

// Ensure pages are rendered only once
export const hydrationCanBeAborted = true