const AWS = require(`aws-sdk`);

const iot = new AWS.Iot({ apiVersion: '2015-05-28', region: 'us-east-1' });

const { IoTService } = require('./services/iot');

async function addDevice(iot, deviceName) {
  let iotService = new IoTService(iot);
  let newDevice = await iotService.createThing(deviceName);
  console.log('Added new device :', newDevice);

}

// addDevice(iot, 'myNewDevice')
