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
        logRed(err);
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
        logRed(err);
      });
  }

  /**
   * creates version of group: do not include or use null as value for any unwanted optional definitions
   *
   * @param {string} groupId - required: id of group
   * @param {object} definitionARNs - optional: object of definition arns following pattern (no property is requried) {
   *  CoreDefinitionVersionArn: '<STRING>',
   * DeviceDefinitionVersionArn: '<STRING>',
   * FunctionDefinitionVersionArn: '<STRING>',
   * LoggerDefinitionVersionArn: '<STRING>',
   * ResourceDefinitionVersionArn: '<STRING>',
   * SubscriptionDefinitionVersionArn: '<STRING>',
   * }
   */
  createGroupVersion(groupId, definitionARNs) {
    let params = {
      GroupId: groupId
    };
    for (let arn in definitionARNs) {
      params[arn] = definitionARNs[arn];
    }

    console.log('CREATING GROUP WITH PARAMS', params);

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
        logRed(err);
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
        logRed(err);
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
        logRed(err);
      });
  }

  /**
   * Gets info about the latest Group version from only groupId
   * @param {string} groupId - id of group
   */
  async getLatestGroupVersion(groupId) {
    let group = await this.getGroup(groupId);
    let groupName = group.Name;
    let latestVersion = group.LatestVersion;
    let res = await this.getGroupVersion(groupId, latestVersion);
    res.groupName = groupName;
    return res;
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
        logRed(err);
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
        logRed(err);
      });
  }

  /**
   * Gets device version id from device version arn
   * @param {string} latestVersionARN - arn of device version
   * @param {string} token - only used for paginated results
   */
  async findLatestDeviceVersionId(latestVersionARN, token) {
    let list = await this.listDeviceDefinitions(token);
    let filteredList = list.Definitions.filter(def => {
      if (def.LatestVersionArn === latestVersionARN) return true;
      else return false;
    });
    //if deviceDefinition is found
    if (filteredList.length) return filteredList[0];
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
    deviceVersion.definitionId = device.Id;
    return deviceVersion;
  }
}

module.exports = {
  GreengrassService
};
