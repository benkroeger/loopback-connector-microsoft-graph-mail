'use strict';

const connectorFactory = require('./connector');

function initializeConnector(dataSource, callback) {
  // const { settings } = dataSource;
  const connector = connectorFactory(dataSource);

  // assign connector instance to dataSource. Although this doesn't comply with the concept of `pure functions`, it is required by loopback's connector contract
  // https://docs.strongloop.com/display/public/LB/Building+a+connector#Buildingaconnector-Implementlifecylemethods
  Object.assign(dataSource, { connector });

  if (callback) {
    connector.connect(callback);
  }
  return;
}

exports.initialize = function initialize(dataSource, callback) {
  const isAggregate = dataSource.aggregate;

  // run initializeConnector if pre-requisites are met
  if (isAggregate === true && typeof callback === 'function') {
    initializeConnector(dataSource, callback);
    return;
  }

  const err = new Error([
    'This connector can not be used for regular datasources.',
    'Only aggregated datasources are supported for now.',
  ].join(' '));

  callback(err);
  return;
};
