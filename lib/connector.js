'use strict';

const _ = require('lodash');
const Connector = require('loopback-connector').Connector;
const loggerFactory = require('./logger-factory');
const mailServiceFactory = require('./mail-service');
const MethodNotSupportedError = require('./errors/MethodNotSupportedError');

function mailConnector(settings, dataSource) {
  const connector = new Connector('microsoft-graph-mail', settings);

  const logger = loggerFactory(settings.name);

  logger.debug('Settings: %j', settings);

  // create reference for our future service instance
  let service;

  // assign basic properties to connector instance
  _.assign(connector, {
    buildNearFilter: false,
    dataSource,
  });

  // Lifecycle Handlers

  /**
   * create connections to the backend system
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  function connect(callback) {
    service = mailServiceFactory(settings.baseUrl, settings);

    return callback(null, connector);
  }

  /**
   * close connections to the backend system
   * @param  {Function} [callback] [description]
   * @return {[type]}            [description]
   */
  function disconnect(callback) {
    logger.debug('> disconnect');
    return callback();
  }

  /**
   * (optional): check connectivity
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  function ping(callback) {
    logger.debug('> ping');
    return callback();
  }

  // make lifecycle handler functions member of the connector object
  _.assign(connector, {
    connect,
    disconnect,
    ping,
  });

  // Connector metadata (optional)
  // Model definition for the configuration, such as host/URL/username/password
  // What data access interfaces are implemented by the connector (the capability of the connector)
  // Connector-specific model/property mappings
  function getTypes() {
    return ['mail'];
  }

  // triggered from DataSource.createModel as the last manipulating step
  function define(options) {
    logger.debug('> define; options %j', options);
    // {
    //   model: modelClass,
    //   properties: modelClass.definition.properties,
    //   settings: settings
    // }
  }

  // make connector metadate functions member of the connector object
  _.assign(connector, {
    getTypes,
    define,
  });

  // Model method delegations
  // Delegating model method invocations to backend calls, for example create, retrieve, update, and delete
  function create(model, data, options, callback) {
    logger.debug('> create; model %s, data %j, options %j', model, data, options);
    return callback(new MethodNotSupportedError('create'));
  }

  function updateOrCreate(model, data, options, callback) {
    logger.debug('> updateOrCreate; model %s, data %j, options %j', model, data, options);
    return callback(new MethodNotSupportedError('updateOrCreate'));
  }

  function findOrCreate(model, data, options, callback) {
    logger.debug('> findOrCreate; model %s, data %j, options %j', model, data, options);
    return callback(new MethodNotSupportedError('create'));
  }

  function all(model, filter, options, callback) {
    logger.debug('> all; model %s, filter %j, options %j', model, filter, options);

    const params = _.merge({}, options, {
      query: filter,
    });

    service.getMails(params, (err, result) => {
      if (err) {
        return callback(err);
      }
      return callback(null, result);
    });
  }

  function count(model, where, options, callback) {
    logger.debug('> count; model %s, where %j, options %j', model, where, options);
    return callback(new MethodNotSupportedError('create'));
  }

  // removeAll, deleteAll, destroyAll
  function destroyAll(model, where, options, callback) {
    logger.debug('> destroyAll; model %s, where %j, options %j', model, where, options);
    return callback(new MethodNotSupportedError('create'));
  }

  function save(model, id, options, callback) {
    logger.debug('> save; model %s, id %s, options %j', model, id, options);
    return callback(new MethodNotSupportedError('create'));
  }

  // update, updateAll
  function update(model, where, data, options, callback) {
    logger.debug('> update; model %s, where %j, data %j, options %j', model, where, data, options);
    return callback(new MethodNotSupportedError('create'));
  }

  // remove, delete, destroy
  function destroy(model, id, options, callback) {
    logger.debug('> destroy; model %s, id %s options %j', model, id, options);
    return callback();
  }

  function updateAttributes(model, id, data, options, callback) {
    logger.debug('> updateAttributes; model %s, id %s, data %j, options %j', model, id, data, options);
    return callback(new MethodNotSupportedError('create'));
  }

  // make Model method delegation functions member of the connector object
  _.assign(connector, {
    create,
    updateOrCreate,
    findOrCreate,
    all,
    destroyAll,
    count,
    save,
    update,
    destroy,
    updateAttributes,
  });
  _.assign(connector, {
    all,
  });

  return connector;
}

module.exports = mailConnector;
