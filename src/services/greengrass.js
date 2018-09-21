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
        console.log('Successfully created group:', res);
        return res;
      })
      .catch(err => {
        console.log(err);
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
        console.log('Successfully Created core definiton:', res);
        return res;
      })
      .catch(err => {
        console.log(err);
      });
  }

  /**
   * Creates a device definition
   *
   * @param {string} token - client token
   * @param {sting} certArn - arn of certificate
   * @param {string} deviceId - id of device
   * @param {boolean} syncShadow
   * @param {string} thingArn - arn of thing
   * @param {string} deviceName - name of device
   */
  createDeviceDefinition(
    token,
    certArn,
    deviceId,
    syncShadow,
    thingArn,
    deviceName
  ) {
    const params = {
      AmznClientToken: token,
      InitialVersion: {
        Devices: [
          {
            CertificateArn: certArn,
            Id: deviceId,
            SyncShadow: syncShadow,
            ThingArn: thingArn
          }
        ]
      },
      Name: deviceName
    };
    return this.greengrass
      .createDeviceDefinition(params)
      .promise()
      .then(res => {
        console.log(
          'Successfully Created Device Definition:',
          JSON.stringify(res)
        );
        return res;
      })
      .catch(err => {
        console.log(err);
      });
  }

  /**
   * creates first version of group, connecting core
   *
   * @param {string} groupId - id of group
   * @param {string} coreArn - arn of latest core version
   */
  createInitialGroupVersion(groupId, coreArn) {
    let params = {
      GroupId: groupId,
      CoreDefinitionVersionArn: coreArn
    };

    return this.greengrass
      .createGroupVersion(params)
      .promise()
      .then(res => {
        console.log('Successfully created group version:', res);
        return res;
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = {
  GreengrassService
};
