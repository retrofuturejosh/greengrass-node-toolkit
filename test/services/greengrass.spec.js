const { expect } = require('chai');

//import greengrass stub, greengrass servic, and eexpected results
const { GreengrassService } = require('../../src/services/greengrass');
const expectedResults = require('../expectedResults');
const {
  greengrass,
  createGroupStub,
  createCoreDefStub,
  createGroupVersionStub,
  createDeviceDefStub,
  getGroupStub,
  getGroupVersionStub,
  createDeviceDefVersionStub,
  getDeviceDefVersionStub,
  listDeviceDefinitionsStub,
  resetStubHistory
} = require('./stubService.js');

//TESTS
describe('Greengrass service', () => {
  //start service
  const greengrassService = new GreengrassService(greengrass);

  //reset stubs after tests
  after(() => {
    let stubs = [
      createGroupStub,
      createCoreDefStub,
      createGroupVersionStub,
      createDeviceDefStub,
      getGroupStub,
      getGroupVersionStub,
      createDeviceDefVersionStub,
      getDeviceDefVersionStub,
      listDeviceDefinitionsStub
    ];
    resetStubHistory(stubs);
  });

  //test methods
  describe(`has working method 'createGroup'`, () => {
    it('createGroup calls the service with correct params and returns promise resolving to correct data', async () => {
      let res = await greengrassService.createGroup('testName');
      expect(res).to.deep.equal(expectedResults.createGroupRes);
      expect(createGroupStub.args[0][0]).to.deep.equal({
        Name: 'testName'
      });
    });
  });

  describe(`has working method 'createCoreDefinition'`, () => {
    it('createCoreDefinition calls the service with correct params and returns promise resolving to correct data', async () => {
      let initialVersion = {
        Cores: [
          {
            CertificateArn: 'myCert',
            Id: 'myCoreId',
            SyncShadow: true,
            ThingArn: 'myThingArn'
          }
        ]
      };
      let res = await greengrassService.createCoreDefinition(
        'myCoreDefName',
        initialVersion
      );
      let calledWith = {
        InitialVersion: {
          Cores: [
            {
              CertificateArn: 'myCert',
              Id: 'myCoreId',
              SyncShadow: true,
              ThingArn: 'myThingArn'
            }
          ]
        },
        Name: 'myCoreDefName'
      };
      expect(res).to.deep.equal(expectedResults.createCoreRes);
      expect(createCoreDefStub.args[0][0]).to.deep.equal(calledWith);
    });
  });

  describe(`has working method 'createGroupVersion'`, () => {
    it('createGroupVersion calls the service with correct params and returns promise resolving to correct data', async () => {
      let res = await greengrassService.createGroupVersion('groupID', {
        CoreDefinitionVersionArn: 'coreArn'
      });
      let calledWith = {
        GroupId: 'groupID',
        CoreDefinitionVersionArn: 'coreArn'
      };
      expect(res).to.deep.equal(expectedResults.createGroupVersionRes);
      expect(createGroupVersionStub.args[0][0]).to.deep.equal(calledWith);
    });
  });
  describe(`has working method 'getGroup'`, () => {
    it('getGroup calls the service with correct params and returns promise resolving to correct data', async () => {
      let res = await greengrassService.getGroup('groupId');
      let calledWith = {
        GroupId: 'groupId'
      };
      expect(res).to.deep.equal(expectedResults.getGroupRes);
      expect(getGroupStub.args[0][0]).to.deep.equal(calledWith);
    });
  });
  describe(`has working method 'getVersion'`, () => {
    it('getVersion calls the service with correct params and returns promise resolving to correct data', async () => {
      let res = await greengrassService.getGroupVersion('groupId', 'versionId');
      let calledWith = {
        GroupId: 'groupId',
        GroupVersionId: 'versionId'
      };
      expect(res).to.deep.equal(expectedResults.getGroupVersionRes);
      expect(getGroupVersionStub.args[0][0]).to.deep.equal(calledWith);
    });
  });
  describe(`has working method 'getLatestGroupVersion'`, () => {
    it('getLatestGroupVersion calls the service with correct params and returns promise resolving to correct data', async () => {
      let res = await greengrassService.getLatestGroupVersion('anotherGroupId');
      let calledWith = {
        GroupId: 'anotherGroupId'
      };
      expect(getGroupStub.args[1][0]).to.deep.equal(calledWith);
      calledWith = {
        GroupId: 'anotherGroupId',
        GroupVersionId: 'latestVersion'
      };
      expect(getGroupVersionStub.args[1][0]).to.deep.equal(calledWith);
      let expected = expectedResults.getGroupVersionRes;
      expected.groupName = 'groupName';
      expect(res).to.deep.equal(expected);
    });
  });
  describe(`has working method 'createDeviceDefinition'`, () => {
    it('createDeviceDefinition calls the service with correct params and returns promise resolving to correct data', async () => {
      let devicesArr = [
        {
          CertificateArn: 'CertArn',
          Id: 'thingId',
          SyncShadow: true,
          ThingArn: 'thingArn'
        }
      ];
      let res = await greengrassService.createDeviceDefinition(
        'myNewDeviceDef',
        devicesArr
      );
      let calledWith = {
        InitialVersion: {
          Devices: devicesArr
        },
        Name: 'myNewDeviceDef'
      };
      expect(res).to.deep.equal(expectedResults.createDeviceDefRes);
      expect(createDeviceDefStub.args[0][0]).to.deep.equal(calledWith);
    });
  });
  describe(`has working method 'createDeviceDefinitionVersion'`, () => {
    it('createDeviceDefinitionVersion calls the service with correct params and returns promise resolving to correct data', async () => {
      let devicesArr = [
        {
          CertificateArn: 'CertArn',
          Id: 'thingId',
          SyncShadow: true,
          ThingArn: 'thingArn'
        }
      ];
      let res = await greengrassService.createDeviceDefinitionVersion(
        'deviceId',
        devicesArr
      );
      let calledWith = {
        DeviceDefinitionId: 'deviceId',
        Devices: devicesArr
      };
      expect(res).to.deep.equal(expectedResults.createDeviceDefVersionRes);
      expect(createDeviceDefVersionStub.args[0][0]).to.deep.equal(calledWith);
    });
  });
  describe(`has working method 'getDeviceDefinitionVersion'`, () => {
    it('getDeviceDefinitionVersion calls the service with correct params and returns promise resolving to correct data', async () => {
      let res = await greengrassService.getDeviceDefinitionVersion(
        'deviceDefId',
        'deviceDefVersionId'
      );
      let calledWith = {
        DeviceDefinitionId: 'deviceDefId',
        DeviceDefinitionVersionId: 'deviceDefVersionId'
      };
      expect(res).to.deep.equal(expectedResults.getDeviceDefVersionRes);
      expect(getDeviceDefVersionStub.args[0][0]).to.deep.equal(calledWith);
    });
  });
  describe(`has working method 'listDeviceDefinitions'`, () => {
    it('listDeviceDefinitions calls the service with correct params and returns promise resolving to correct data', async () => {
      let res = await greengrassService.listDeviceDefinitions();
      let calledWith = {
        MaxResults: '100'
      };
      expect(res).to.deep.equal(expectedResults.listDeviceDefinitionsRes);
      expect(listDeviceDefinitionsStub.args[0][0]).to.deep.equal(calledWith);
    });
  });
  describe(`has working method 'findLatestDeviceVersionId'`, () => {
    it(`findLatestDeviceVersionId calls the service's methods with correct params and returns promise resolving to correct data`, async () => {
      let res = await greengrassService.findLatestDeviceVersionId(
        'latestVersionArn'
      );
      expect(res).to.deep.equal(
        expectedResults.listDeviceDefinitionsRes.Definitions[0]
      );
      expect();
    });
  });
  describe(`has working method 'findLatestDeviceVersionDefinition'`, () => {
    it('findLatestDeviceVersionDefinition calls greengrass methods with correct params and returns promise resolving to correct data', async () => {
      let res = await greengrassService.findLatestDeviceVersionDefinition(
        'latestVersionArn'
      );
      expect(res).to.deep.equal(expectedResults.getDeviceDefVersionRes);
    });
  });
});
