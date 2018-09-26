const AWS = require(`aws-sdk`);
const fs = require('fs');
const { logGreen, logRed } = require('./utils/chalk.js');

const { IoTService } = require('./services/iot');
const { GreengrassService } = require('./services/greengrass');

/**
 *  creates a new thing with certs and policy, adds thing to greengrass group as device
 * @param {service} iot
 * @param {sevice} greengrass
 * @param {string} deviceName
 */
async function addDevice(iot, greengrass, deviceName) {
  try {
    //object to save device info
    let deviceInfo = {};

    //START SERVICE
    let iotService = new IoTService(iot);
    let greengrassService = new GreengrassService(greengrass);

    //CREATE THING
    let newDevice = await iotService.createThing(deviceName);
    let thingArn = newDevice.thingArn;
    let thingId = newDevice.thingId;
    //save to deviceInfo
    deviceInfo.thingInfo = newDevice;

    //CERTS
    //Create Cert
    let cert = await iotService.createKeysCert(true);
    let certArn = cert.certificateArn;
    let certPem = cert.certificatePem;
    let keyPem = cert.keyPair.PrivateKey;
    //Create addedDevices folder if none exists
    let dir = './addedDevices';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    //add certs to ./addedDevices folder
    fs.mkdirSync(`./addedDevices/${deviceName}`);
    fs.mkdirSync(`./addedDevices/${deviceName}/certs`);
    fs.writeFileSync(
      __dirname + `/../addedDevices/${deviceName}/certs/cloud-pem-crt`,
      certPem
    );
    fs.writeFileSync(
      __dirname + `/../addedDevices/${deviceName}/certs/cloud-pem-key`,
      keyPem
    );
    //save cert info to deviceInfo
    deviceInfo.certInfo = cert;

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
    let policy = await iotService.createPolicy(
      `${deviceName}Policy`,
      policyDoc
    );
    let policyName = policy.policyName;
    //save policy to deviceInfo
    deviceInfo.policy = policy;

    //Save Device Info
    fs.writeFileSync(
      __dirname + `/../addedDevices/${deviceName}/deviceInfo.json`,
      JSON.stringify(deviceInfo)
    );

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

    logGreen('Created new Group Version');
    return 'Success';
  } catch (err) {
    logRed(
      `Failed to add new device! \n ${err} \n ${JSON.stringify(err.stack)}`
    );
  }
}

module.exports = {
  addDevice
};
