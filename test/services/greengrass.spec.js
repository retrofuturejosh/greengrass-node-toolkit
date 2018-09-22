const AWS = require(`aws-sdk`);
const { expect } = require('chai');
const { stub, spy } = require('sinon');

//start greengrass()
const greengrass = new AWS.Greengrass({
  apiVersion: '2017-06-07',
  region: 'us-east-1'
});

//import greengrass service and expected results
const { GreengrassService } = require('../../src/services/greengrass');
const expectedResults = require('../expectedResults');

//testing suite
describe('Greengrass service', () => {
  //assign expected results
  let {
    createCoreRes,
    createGroupRes,
    createGroupVersionRes,
    createDeviceDefRes,
    createDeviceDefVersionRes,
    getGroupRes,
    getGroupVersionRes
  } = expectedResults;

  //stub services
  let createGroupStub = stub(greengrass, 'createGroup');
  createGroupStub.returns({
    promise: () => {
      return Promise.resolve(createGroupRes);
    }
  });
  let createCoreDefStub = stub(greengrass, 'createCoreDefinition');
  createCoreDefStub.returns({
    promise: () => {
      return Promise.resolve(createCoreRes);
    }
  });
  let createGroupVersionStub = stub(greengrass, 'createGroupVersion');
  createGroupVersionStub.returns({
    promise: () => {
      return Promise.resolve(createGroupVersionRes);
    }
  });
  let createDeviceDefStub = stub(greengrass, 'createDeviceDefinition');
  createDeviceDefStub.returns({
    promise: () => {
      return Promise.resolve(createDeviceDefRes);
    }
  });
  let getGroupStub = stub(greengrass, 'getGroup');
  getGroupStub.returns({
    promise: () => {
      return Promise.resolve(getGroupRes);
    }
  });
  let getGroupVersionStub = stub(greengrass, 'getGroupVersion');
  getGroupVersionStub.returns({
    promise: () => {
      return Promise.resolve(getGroupVersionRes);
    }
  });
  let createDeviceDefVersionStub = stub(
    greengrass,
    'createDeviceDefinitionVersion'
  );
  createDeviceDefVersionStub.returns({
    promise: () => {
      return Promise.resolve(createDeviceDefVersionRes);
    }
  });

  //start service
  const greengrassService = new GreengrassService(greengrass);

  //test methods
  describe(`has working method 'createGroup'`, () => {
    it('createGroup calls the service with correct params and returns greengrass promise', async () => {
      let res = await greengrassService.createGroup('testName');
      expect(res).to.deep.equal(createGroupRes);
      expect(createGroupStub.args[0][0]).to.deep.equal({
        Name: 'testName'
      });
    });
  });

  describe(`has working method 'createCoreDefinition'`, () => {
    it('createCoreDefinition calls the service with correct params and returns greengrass promise', async () => {
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
      expect(res).to.deep.equal(createCoreRes);
      expect(createCoreDefStub.args[0][0]).to.deep.equal(calledWith);
    });
  });

  describe(`has working method 'createGroupVersion'`, () => {
    it('createGroupVersion calls the service with correct params and returns greengrass promise', async () => {
      let res = await greengrassService.createGroupVersion(
        'groupID',
        'coreArn'
      );
      let calledWith = {
        GroupId: 'groupID',
        CoreDefinitionVersionArn: 'coreArn'
      };
      expect(res).to.deep.equal(createGroupVersionRes);
      expect(createGroupVersionStub.args[0][0]).to.deep.equal(calledWith);
    });
  });
  describe(`has working method 'getGroup'`, () => {
    it('getGroup calls the service with correct params and returns greengrass promise', async () => {
      let res = await greengrassService.getGroup('groupId');
      let calledWith = {
        GroupId: 'groupId'
      };
      expect(res).to.deep.equal(getGroupRes);
      expect(getGroupStub.args[0][0]).to.deep.equal(calledWith);
    });
  });
  describe(`has working method 'getVersion'`, () => {
    it('getVersion calls the service with correct params and returns greengrass promise', async () => {
      let res = await greengrassService.getGroupVersion('groupId', 'versionId');
      let calledWith = {
        GroupId: 'groupId',
        GroupVersionId: 'versionId'
      };
      expect(res).to.deep.equal(getGroupVersionRes);
      expect(getGroupVersionStub.args[0][0]).to.deep.equal(calledWith);
    });
  });
  describe(`has working method 'getLatestGroupVersion'`, () => {
    it('getLatestGroupVersion calls the service with correct params and returns greengrass promise', async () => {
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
      expect(res).to.deep.equal(getGroupVersionRes);
    });
  });
  describe(`has working method 'createDeviceDefinition'`, () => {
    it('createDeviceDefinition calls the service with correct params and returns greengrass promise', async () => {
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
      expect(res).to.equal(createDeviceDefRes);
      expect(createDeviceDefStub.args[0][0]).to.deep.equal(calledWith);
    });
  });
  describe(`has working method 'createDeviceDefinitionVersion'`, () => {
    it('createDeviceDefinitionVersion calls the service with correct params and returns greengrass promise', async () => {
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
      }
      expect(res).to.equal(createDeviceDefVersionRes);
      expect(createDeviceDefVersionStub.args[0][0]).to.deep.equal(calledWith);
    });
  });
});
