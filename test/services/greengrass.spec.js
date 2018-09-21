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
  let createCoreRes = expectedResults.createCoreDefinition;
  let createGroupRes = expectedResults.createGroup;
  let ggVersionRes = expectedResults.createGGVersion;

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
  let groupVersionStub = stub(greengrass, 'createGroupVersion');
  groupVersionStub.returns({
    promise: () => {
      return Promise.resolve(ggVersionRes);
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
      let res = await greengrassService.createInitialGroupVersion(
        'groupID',
        'coreArn'
      );
      let calledWith = {
        GroupId: 'groupID',
        CoreDefinitionVersionArn: 'coreArn'
      };
      expect(res).to.deep.equal(ggVersionRes);
      expect(groupVersionStub.args[0][0]).to.deep.equal(calledWith);
    });
  });
});
