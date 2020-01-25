'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'future-butcher-web',
    environment,
    rootURL: '/',
    locationType: 'none',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    sentry: {
      dsn: process.env.SENTRY_DSN
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    contentSecurityPolicy: {
      'script-src': "'self' 'unsafe-unline' 'unsafe-eval'",
      'img-src': "data: app.getsentry.com",
      'connect-src': "'self' app.getsentry.com"
    },

    ASSETS_S3_BUCKET: process.env.ASSETS_S3_BUCKET,
  };

  if (environment === 'development') {
    ENV.api_url = 'ws://localhost:4000/socket';

    ENV['ember-logging-service'] = {
      enabled: true,
      errorsEnabled: true
    }

    ENV['ember-logging-amplitude'] = {
      enabled: true,
      apiKey: process.env.AMPLITUDE_API_KEY,
      amplitudeConfig: {},
      tags: ['user', 'gameplay']
    }
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'semilocal') {
    ENV.api_url = process.env.API_HOST;

    ENV['ember-logging-service'] = {
      enabled: true,
      errorsEnabled: true
    }

    ENV['ember-logging-amplitude'] = {
      enabled: true,
      apiKey: process.env.AMPLITUDE_API_KEY,
      amplitudeConfig: {},
      tags: ['user', 'gameplay']
    }
  }

  if (environment === 'production') {
    ENV.api_url = process.env.API_HOST;

    ENV['ember-logging-service'] = {
      enabled: true,
      errorsEnabled: true
    }

    ENV['ember-logging-amplitude'] = {
      enabled: true,
      apiKey: process.env.AMPLITUDE_API_KEY,
      amplitudeConfig: {},
      tags: ['user', 'gameplay']
    }
  }

  return ENV;
};
