/* eslint-env node */
'use strict';

module.exports = function(deployTarget) {
  let ENV = {
    build: {},
    pipeline: {
      activateOnDeploy: true
    }
  };

  ENV.cloudfront = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    distribution: process.env.CLOUDFRONT_DISTRIBUTION_ID,
  };

  ENV['s3'] = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucket: 'future-butcher',
    region: 'us-west-1'
  };

  ENV['s3-index'] = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucket: 'future-butcher',
    region: 'us-west-1'
  };

  return ENV;
};
