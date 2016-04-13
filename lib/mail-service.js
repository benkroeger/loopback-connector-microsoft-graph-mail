const _ = require('lodash');
const loggerFactory = require('./logger-factory');

const oniyiHttpClient = require('oniyi-http-client');
const attachCredentialsPlugin = require('oniyi-http-plugin-credentials');

function mailService(baseUrl, settings) {
  const logger = loggerFactory(`service:${settings.name}`);
  const service = {};

  if (settings.debug) {
    logger.enableDebug();
  }

  logger.debug('Settings: %j', settings);

  // create http client
  const httpClient = oniyiHttpClient(_.merge({
    defaults: {
      baseUrl,
      json: true,
      method: 'GET',
    },
  }, _.pick(settings, ['defaults'])));

  if (settings.plugins && settings.plugins.credentials) {
    httpClient.use(attachCredentialsPlugin(settings.plugins.credentials));
  }

  return _.assign(service, {
    getMails: (params, callback) => {
      httpClient.makeRequest(params, (err, response, body) => {
        if (err) {
          return callback(err);
        }
        return callback(null, body.value);
      });
    },
  });
}


module.exports = mailService;
