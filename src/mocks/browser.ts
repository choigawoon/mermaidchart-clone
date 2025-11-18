import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// Setup MSW browser worker
export const worker = setupWorker(...handlers)

// Start worker function
export async function startMockServiceWorker() {
  try {
    await worker.start({
      onUnhandledRequest: 'bypass', // Bypass unhandled requests
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    })
    console.log('🔶 MSW: Mock Service Worker is running')
  } catch (error) {
    console.error('MSW: Failed to start Mock Service Worker', error)
  }
}
