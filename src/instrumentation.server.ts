import * as Sentry from '@sentry/sveltekit';

Sentry.init({
  dsn: 'https://026732390b7c1af7e06c3c9037a3e28d@o4511508022099968.ingest.de.sentry.io/4511508040384592',

  tracesSampleRate: 1.0,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: import.meta.env.DEV,
});