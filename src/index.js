const AWS = require(`aws-sdk`);

const iot = new AWS.Iot({ apiVersion: '2015-05-28', region: 'us-east-1' });
const greengrass = new AWS.Greengrass({
  apiVersion: '2017-06-07',
  region: 'us-east-1'
});

const { createGreengrassGroup } = require('./createGroup');
const params = require('./params');

createGreengrassGroup(iot, greengrass, params.groupName, params.coreName, params.policyName);
