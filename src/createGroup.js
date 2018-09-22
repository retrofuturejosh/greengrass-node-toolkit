const fs = require('fs');
const { logGreen, logRed } = require('./utils/chalk.js');

const { GreengrassService } = require('./services/greengrass');
const { IoTService } = require('./services/iot');
const { GreengrassConfigBuilder } = require('./services/ggConfig');

/**
 * Sets up greengrass group with thing/core, group, certificate, policy, and version
 * @param {service} iot - instance of aws.iot()
 * @param {service} greengrass - instance of aws.greengrass()
 * @param {string} groupName - name of group
 * @param {string} thingName - core/thing name
 * @param {string} policyName - name of IAM policy attached to IoT/Greengrass services
 */
const createGreengrassGroup = async (
  iot,
  greengrass,
  groupName,
  thingName,
  policyName
) => {
  try {
    logGreen('Creating greengrass group');

    //start services
    const greengrassService = new GreengrassService(greengrass);
    const iotService = new IoTService(iot);
    //configBuilder creates the config.json file for greengrass
    let configBuilder = new GreengrassConfigBuilder();
    //groupInfo will save all metadata locally and write it to a file groupInfo.json
    let groupInfo = {};

    //GROUP
    //Create Group
    let group = await greengrassService.createGroup(groupName);
    let groupId = group.Id;
    //add group to groupInfo
    groupInfo.group = group;

    //THING
    //Create Thing
    let thing = await iotService.createThing(thingName);
    let thingArn = thing.thingArn;
    let thingId = thing.thingId;
    //add thingArn to config
    configBuilder.addThingArn(thingArn);
    //add thing to groupInfo
    groupInfo.thing = thing;

    //CERTS
    //Create Cert
    let cert = await iotService.createKeysCert(true);
    let certArn = cert.certificateArn;
    let certPem = cert.certificatePem;
    let keyPem = cert.keyPair.PrivateKey;
    //Add certs to `/cert` folder
    fs.writeFileSync(__dirname + '/../certs/cloud-pem-crt', certPem);
    fs.writeFileSync(__dirname + '/../certs/cloud-pem-key', keyPem);
    groupInfo.cert = cert;

    //ATTACH CERT TO THING
    //Attach Thing Principal
    let attachedPrincipal = await iotService.attachThingPrincipal(
      certArn,
      thingName
    );

    //POLICY
    //Create policy
    let policy = await iotService.createPolicy();
    let policyName = policy.policyName;
    groupInfo.policy = policy;
    //Attach policy to certificate
    let attachPolicy = await iotService.attachPrincipalPolicy(
      policyName,
      certArn
    );

    //CORE
    //set parameters for initial version of core
    let initialVersion = {
      Cores: [
        {
          Id: thingId,
          CertificateArn: certArn,
          SyncShadow: true,
          ThingArn: thingArn
        }
      ]
    };
    //create core definition
    let coreDefinition = await greengrassService.createCoreDefinition(
      groupName,
      initialVersion
    );
    let coreArn = coreDefinition.LatestVersionArn;

    groupInfo.coreDefinition = coreDefinition;

    //GROUP VERSION
    // create group version
    let groupVersion = await greengrassService.createGroupVersion(
      groupId,
      coreArn
    );
    groupInfo.groupVersion = groupVersion;

    //ENDPOINT
    let endpoint = await iotService.getIoTEndpoint();
    //add to config file
    configBuilder.addIotHost(endpoint.endpointAddress);
    groupInfo.iotHost = endpoint;

    //save group information and config.json
    //Create addedDevices folder if none exists
    let dir = './groupInfo';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    fs.writeFileSync('./groupInfo/groupInfoV1.json', JSON.stringify(groupInfo));
    fs.writeFileSync('config.json', JSON.stringify(configBuilder.getConfig()));

    //all done
    logGreen('Successfully set up Greengrass Group!');
  } catch (err) {
    logRed(err);
  }
};

module.exports = {
  createGreengrassGroup
};
