/* eslint-env node */

'use strict';

const path = require('path');

module.exports = function(/* env */) {
  return {
    clientAllowedKeys: ['ASSETS_S3_BUCKET'],
    fastbootAllowedKeys: [],
    failOnMissingKey: false,
    path: path.join(path.dirname(__dirname), '.env')
  }
};
