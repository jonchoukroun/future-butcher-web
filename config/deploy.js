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
    bucket: process.env.S3_BUCKET_NAME,
    region: process.env.S3_BUCKET_REGION
  };

  ENV['s3-index'] = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucket: process.env.S3_BUCKET_NAME,
    region: process.env.S3_BUCKET_REGION
  };

  return ENV;
};
