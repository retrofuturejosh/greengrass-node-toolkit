const { logGreenDim, logRed } = require('../utils/chalk.js');

class GreengrassService {
  constructor(greengrass) {
    this.greengrass = greengrass;
  }

  /**
   * creates new greengrass group
   *
   * @param {string} name - name of group
   */
  createGroup(name) {
    const params = {
      Name: name
    };
    return this.greengrass
      .createGroup(params)
      .promise()
      .then(res => {
        logGreenDim(`Successfully created group: ${JSON.stringify(res)}`);
        return res;
      })
      .catch(err => {
        logRed(err);
      });
  }

  /**
   * creates a new core definition
   *
   * @param {string} coreDefinitionName - name of core definition
   * @param {object} initialVersion - intial version object e.g. {
      Cores: [
        {
          Id: thingName,
          CertificateArn: certArn,
          SyncShadow: True,
          ThingArn: thingArn
        }
      ]
    };
  */
  createCoreDefinition(coreDefinitionName, initialVersion) {
    const params = {
      InitialVersion: initialVersion,
      Name: coreDefinitionName
    };
    return this.greengrass
      .createCoreDefinition(params)
      .promise()
      .then(res => {
        logGreenDim(
          `Successfully Created core definiton: ${JSON.stringify(res)}`
        );
        return res;
      })
      .catch(err => {
        logRed(err);
      });
  }

  /**
   * Creates initial device definition
   * @param {string} deviceDefName - name of device definition
   * @param {Array} devicesArr - array of device objects following pattern: {
          CertificateArn: 'STRING_VALUE',
          Id: 'STRING_VALUE',
          SyncShadow: true || false,
          ThingArn: 'STRING_VALUE'
        }
   */
  createDeviceDefinition(deviceDefName, devicesArr) {
    const params = {
      InitialVersion: {
        Devices: devicesArr
      },
      Name: deviceDefName
    };
    return this.greengrass
      .createDeviceDefinition(params)
      .promise()
      .then(res => {
        logGreenDim(
          `Successfully Created Device Definition:
          ${JSON.stringify(res)}`
        );
        return res;
      })
      .catch(err => {
        log.red(err);
      });
  }

  /**
   * Creates a new Device Definition Version
   * @param {string} deviceDefinitionId - id of device definition
   * @param {Array} devicesArr - array of device objects following pattern: {
          CertificateArn: 'STRING_VALUE',
          Id: 'STRING_VALUE',
          SyncShadow: true || false,
          ThingArn: 'STRING_VALUE'
        }
   */
  createDeviceDefinitionVersion(deviceDefinitionId, devicesArr) {
    var params = {
      DeviceDefinitionId: deviceDefinitionId,
      Devices: devicesArr
    };
    return this.greengrass
      .createDeviceDefinitionVersion(params)
      .promise()
      .then(res => {
        logGreenDim(
          `Created new device definition version: ${JSON.stringify(res)}`
        );
        return res;
      })
      .catch(err => {
        log.red(err);
      });
  }

  /**
   * creates version of group: do not include or use null as value for any unwanted optional definitions
   *
   * @param {string} groupId - required: id of group
   * @param {string} coreArn - optional: arn of latest core version
   * @param {string} deviceDefVersionArn - optional: arn of device definition version
   * @param {string} funcDefVersionArn - optional: arn of function definition version
   * @param {string} loggerDefVersionArn - optional: arn of logger definition version
   * @param {string} ResourceDefVersionArn - optional: arn of resource definition version
   * @param {string} subDefVersionArn - optional: arn of subscription definition version
   */
  createGroupVersion(
    groupId,
    coreArn,
    deviceDefVersionArn,
    funcDefVersionArn,
    loggerDefVersionArn,
    ResourceDefVersionArn,
    subDefVersionArn
  ) {
    let params = {
      GroupId: groupId
    };

    //add optional params
    if (coreArn) params.CoreDefinitionVersionArn = coreArn;
    if (deviceDefVersionArn)
      params.DeviceDefinitionVersionArn = deviceDefVersionArn;
    if (funcDefVersionArn)
      params.FunctionDefinitionVersionArn = funcDefVersionArn;
    if (loggerDefVersionArn)
      params.LoggerDefinitionVersionArn = loggerDefVersionArn;
    if (ResourceDefVersionArn)
      params.ResourceDefinitionVersionArn = ResourceDefVersionArn;
    if (subDefVersionArn)
      params.SubscriptionDefinitionVersionArn = subDefVersionArn;

    return this.greengrass
      .createGroupVersion(params)
      .promise()
      .then(res => {
        logGreenDim(
          `Successfully created group version: ${JSON.stringify(res)}`
        );
        return res;
      })
      .catch(err => {
        log.red(err);
      });
  }

  /**
   * gets info about group
   * @param {string} groupId - id of group
   */
  getGroup(groupId) {
    const params = {
      GroupId: groupId
    };
    return this.greengrass
      .getGroup(params)
      .promise()
      .then(res => {
        logGreenDim(`Fetched Group: ${JSON.stringify(res)}`);
        return res;
      })
      .catch(err => {
        log.red(err);
      });
  }

  /**
   * returns info about group version
   * @param {string} groupId - id of group
   * @param {string} versionId - id of version
   */
  getGroupVersion(groupId, versionId) {
    const params = {
      GroupId: groupId,
      GroupVersionId: versionId
    };
    return this.greengrass
      .getGroupVersion(params)
      .promise()
      .then(res => {
        logGreenDim(`Fetched Group Version: ${JSON.stringify(res)}`);
        return res;
      })
      .catch(err => {
        log.red(err);
      });
  }

  /**
   * Gets info about the latest Group version from only groupId
   * @param {string} groupId - id of group
   */
  async getLatestGroupVersion(groupId) {
    let group = await this.getGroup(groupId);
    let latestVersion = group.LatestVersion;
    return this.getGroupVersion(groupId, latestVersion);
  }

  /**
   * gets info about device definition version
   * @param {string} deviceDefinitionId - id of device definition
   * @param {string} deviceDefinitionVersionId - id of device definition version
   */
  getDeviceDefinitionVersion(deviceDefinitionId, deviceDefinitionVersionId) {
    const params = {
      DeviceDefinitionId: deviceDefinitionId,
      DeviceDefinitionVersionId: deviceDefinitionVersionId
    };
    return this.greengrass
      .getDeviceDefinitionVersion(params)
      .promise()
      .then(res => {
        logGreenDim(`Got device definition version : ${JSON.stringify(res)}`);
        return res;
      })
      .catch(err => {
        log.red(err);
      });
  }

  /**
   * lists all device definitions
   * @param {string} token - optional: for paginated results
   */
  listDeviceDefinitions(token) {
    let params = {
      MaxResults: '100'
    };
    if (token) params.NextToken = token;
    return this.greengrass
      .listDeviceDefinitions(params)
      .promise()
      .catch(err => {
        log.red(err);
      });
  }

  /**
   * Gets device version id from device version arn
   * @param {string} latestVersionARN - arn of device version
   * @param {string} token - only used for paginated results
   */
  async findLatestDeviceVersionId(latestVersionARN, token) {
    let list = await this.listDeviceDefinitions(token);
    list.Definitions.filter(def => {
      return def.LatestVersionArn === latestVersionARN;
    });
    //if deviceDefinition is found
    if (list.Definitions.length) return list.Definitions[0];
    //if deviceDefinition is not found, but there is more list
    else if (list.NextToken)
      return findLatestDeviceVersionId(latestVersionARN, list.NextToken);
    //if deviceDefinition is not found
    else return null;
  }

  /**
   * gets info about latest device version definition from latest device definition version arn;
   * @param {string} versionArn - latest Device Definition Version ARN
   */
  async findLatestDeviceVersionDefinition(versionArn) {
    let device = await this.findLatestDeviceVersionId(versionArn);
    let deviceVersion = await this.getDeviceDefinitionVersion(
      device.Id,
      device.LatestVersion
    );
    return deviceVersion;
  }
}

module.exports = {
  GreengrassService
};
