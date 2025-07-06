import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PostHogProvider } from 'posthog-js/react';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider
      apiKey={'phc_8HAU7haRJW1XAby18QlMOKWATCBxHzE8hFhF31nlGGj'}
      options={{
        api_host: 'https://eu.i.posthog.com',
        defaults: '2025-05-24',
        capture_exceptions: true, // This enables capturing exceptions using Error Tracking
        debug: import.meta.env.MODE === 'development',
      }}
    >
      <App />
    </PostHogProvider>
  </StrictMode>
);
