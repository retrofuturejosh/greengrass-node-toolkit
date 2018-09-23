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

  //CREATE THING
  let newDevice = await iotService.createThing(deviceName);
  let thingArn = newDevice.thingArn;
  let thingId = newDevice.thingId;
  console.log('Created thing :', newDevice);

  //CERTS
  //Create Cert
  let cert = await iotService.createKeysCert(true);
  let certArn = cert.certificateArn;
  //Create addedDevices folder if none exists
  let dir = './addedDevices';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  //add Device Info to folder
  fs.mkdirSync(`./addedDevices/${deviceName}`);
  fs.writeFileSync(
    __dirname + `/../addedDevices/${deviceName}/certInfo.json`,
    JSON.stringify(cert)
  );

  //ATTACH CERT TO THING
  //Attach Thing Principal
  let attachedPrincipal = await iotService.attachThingPrincipal(
    certArn,
    deviceName
  );

  //POLICY
  //Create policy
  let policyDoc = {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: [
          'iot:Publish',
          'iot:Subscribe',
          'iot:Connect',
          'iot:Receive',
          'iot:GetThingShadow',
          'iot:DeleteThingShadow',
          'iot:UpdateThingShadow'
        ],
        Resource: ['*']
      }
    ]
  };
  let policy = await iotService.createPolicy(`${deviceName}Policy`, policyDoc);
  let policyName = policy.policyName;
  //Attach policy to certificate
  let attachPolicy = await iotService.attachPrincipalPolicy(
    policyName,
    certArn
  );

  // Get group ID from groupInfo folder
  let groupInfo = JSON.parse(
    fs.readFileSync('./groupInfo/groupInfoV1.json').toString('utf-8')
  );
  let groupId = groupInfo.group.Id;

  //get latest version of group
  let latestGroupVersion = await greengrassService.getLatestGroupVersion(
    groupId
  );
  console.log('LATEST GROUP VERSION IS ', JSON.stringify(latestGroupVersion));
  let groupName = latestGroupVersion.groupName;

  // Format Device Object to add to Device Definition Devices Arr
  let deviceToAdd = {
    CertificateArn: certArn,
    Id: thingId,
    SyncShadow: true,
    ThingArn: thingArn
  };

  //CREATE NEW DEVICE DEFINITION VERSION
  let createdDeviceDefVersion;
  let latestDeviceDefVersion;
  let devicesArr;
  let updatedDeviceDefVersionArn;
  // check if device definition already exists
  if (latestGroupVersion.Definition.DeviceDefinitionVersionArn) {
    let latestDeviceDefVersionVersionArn =
      latestGroupVersion.Definition.DeviceDefinitionVersionArn;
    //if it does, get info about latest device definition version
    latestDeviceDefVersion = await greengrassService.findLatestDeviceVersionDefinition(
      latestDeviceDefVersionVersionArn
    );
    let deviceDefId = latestDeviceDefVersion.definitionId;
    devicesArr = latestDeviceDefVersion.Definition.Devices;
    // add new device to existing devices array
    devicesArr.push(deviceToAdd);
    console.log('DEVICES ARRAY IS ', devicesArr);
    // create a new device definition version
    createdDeviceDefVersion = await greengrassService.createDeviceDefinitionVersion(
      deviceDefId,
      devicesArr
    );
    updatedDeviceDefVersionArn = createdDeviceDefVersion.Arn;
  } else {
    //if no existing device definition version exists, create a new device definition
    devicesArr = [deviceToAdd];
    createdDeviceDefVersion = await greengrassService.createDeviceDefinition(
      `${groupName}DeviceDef`,
      devicesArr
    );
    updatedDeviceDefVersionArn = createdDeviceDefVersion.LatestVersionArn;
  }

  //update group version definition
  let updatedDefinition = latestGroupVersion.Definition;
  updatedDefinition.DeviceDefinitionVersionArn = updatedDeviceDefVersionArn;

  //CREATE NEW GROUP VERSION
  let newGroupVersion = await greengrassService.createGroupVersion(
    latestGroupVersion.Id,
    updatedDefinition
  );
  console.log('Created new Group Version', newGroupVersion);
}
