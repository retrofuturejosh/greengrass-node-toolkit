const AWS = require(`aws-sdk`);
const fs = require('fs');

const iot = new AWS.Iot({ apiVersion: '2015-05-28', region: 'us-east-1' });
const greengrass = new AWS.Greengrass({
  apiVersion: '2017-06-07',
  region: 'us-east-1'
});

const { IoTService } = require('./services/iot');
const { GreengrassService } = require('./services/greengrass');

async function addDevice(iot, greengrass, deviceName) {
  //START SERVICE
  let iotService = new IoTService(iot);
  let greengrassService = new GreengrassService(greengrass);

  // //CREATE THING
  // let newDevice = await iotService.createThing(deviceName);
  // let thingArn = newDevice.thingArn;
  // let thingId = newDevice.thingId;
  // console.log('Created thing :', newDevice);

  // //CERTS
  // //Create Cert
  // let cert = await iotService.createKeysCert(true);
  // let certArn = cert.certificateArn;
  // //Create addedDevices folder if none exists
  // let dir = './addedDevices';
  // if (!fs.existsSync(dir)) {
  //   fs.mkdirSync(dir);
  // }
  // //add Device Info to folder
  // fs.mkdirSync(`./addedDevices/${deviceName}`);
  // fs.writeFileSync(
  //   __dirname + `/../addedDevices/${deviceName}/certInfo.json`,
  //   JSON.stringify(cert)
  // );

  // //ATTACH CERT TO THING
  // //Attach Thing Principal
  // let attachedPrincipal = await iotService.attachThingPrincipal(
  //   certArn,
  //   deviceName
  // );

  // //POLICY
  // //Create policy
  // let policyDoc = {
  //   Version: '2012-10-17',
  //   Statement: [
  //     {
  //       Effect: 'Allow',
  //       Action: [
  //         'iot:Publish',
  //         'iot:Subscribe',
  //         'iot:Connect',
  //         'iot:Receive',
  //         'iot:GetThingShadow',
  //         'iot:DeleteThingShadow',
  //         'iot:UpdateThingShadow'
  //       ],
  //       Resource: ['*']
  //     }
  //   ]
  // };
  // let policy = await iotService.createPolicy(`${deviceName}Policy`, policyDoc);
  // let policyName = policy.policyName;
  // //Attach policy to certificate
  // let attachPolicy = await iotService.attachPrincipalPolicy(
  //   policyName,
  //   certArn
  // );

  // // GET LATEST DEVICE DEFINITION
  let latestGroupDef = await greengrassService.getLatestGroupVersion(
    '15b239ae-4aac-471f-8275-9e79a635b553'
  );

  //check if devices are already defined
  let latestDeviceDef;
  if (latestGroupDef.Definition.DeviceDefinitionVersionArn) {
    latestDeviceDef = await greengrassService.findLatestDeviceVersionDefinition(
      latestGroupDef.Definition.DeviceDefinitionVersionArn
    );
    console.log('LATEST DEVICE DEF DEVICES ARE ', latestDeviceDef.Definition);
    console.log('LATEST DEVICE DEF IS ', latestDeviceDef);

    //device definition version
  } else {
    //create device definition
  }


}

addDevice(iot, greengrass, 'myNewDevice');
