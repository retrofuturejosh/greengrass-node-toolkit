const AWS = require(`aws-sdk`);

const iot = new AWS.Iot({ apiVersion: '2015-05-28', region: 'us-east-1' });
const greengrass = new AWS.Greengrass({
  apiVersion: '2017-06-07',
  region: 'us-east-1'
});

const { createGreengrassGroup } = require('./createGroup');
const { addDevice } = require('./addDevice');

if (process.env.CREATE === 'group') {
  createGreengrassGroup(
    iot,
    greengrass,
    process.env.GROUP_NAME,
    process.env.CORE_NAME
  );
}

if (process.env.CREATE === 'device') {
  addDevice(iot, greengrass, process.env.DEVICE_NAME);
}
