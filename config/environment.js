'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'future-butcher-web',
    environment,
    rootURL: '/',
    locationType: 'hash',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    sentry: {
      dsn: "https://8809bb8c7dc0466cbfef54ec16c730de@sentry.io/1341103"
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    contentSecurityPolicy: {
      'script-src': "'self' 'unsafe-unline' 'unsafe-eval'",
      'img-src': "data: app.getsentry.com",
      'connect-src': "'self' app.getsentry.com"
    }
  };

  if (environment === 'development') {
    ENV.api_url = 'ws://localhost:4000/socket';

    ENV['ember-logging-service'] = {
      enabled: true,
      errorsEnabled: true
    }

    ENV['ember-logging-amplitude'] = {
      enabled: true,
      apiKey: '06aa670dce5ece2db0701876c1530203',
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
    ENV.api_url = 'wss://futurebutcher.com:4000/socket';

    ENV['ember-logging-service'] = {
      enabled: true,
      errorsEnabled: true
    }

    ENV['ember-logging-amplitude'] = {
      enabled: true,
      apiKey: '06aa670dce5ece2db0701876c1530203',
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
      apiKey: '83122e013ff15ff5211b333d82f8ea8d',
      amplitudeConfig: {},
      tags: ['user', 'gameplay']
    }
  }

  return ENV;
};
