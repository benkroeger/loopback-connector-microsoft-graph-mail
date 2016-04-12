'use strict';

const mailConnector = require('./mail-connector');

function initializeAggregateConnector(settings, callback) {
  const connector = mailConnector(settings);
  if (callback) {
    connector.connect(callback);
  }
  return connector;
}

exports.initialize = function initializeConnector(dataSource, callback) {
  const isAggregate = dataSource.aggregate;

  // run initializeAggregateConnector if pre-requisites are met
  if (isAggregate === true && typeof callback === 'function') {
    return initializeAggregateConnector(dataSource, callback);
  }

  const err = new Error([
    'This connector can not be used for regular datasources.',
    'Only aggregated datasources are supported for now.',
  ].join(' '));

  return callback(err);
};
