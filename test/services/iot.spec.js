const AWS = require(`aws-sdk`);
const { expect } = require('chai');
const { stub, spy } = require('sinon');

const iot = new AWS.Iot({ apiVersion: '2015-05-28', region: 'us-east-1' });

const { IoTService } = require('../../src/services/iot');
const expectedResults = require('../expectedResults.js');

describe('IoT Service', () => {
  //assign expected results
  const createThingRes = expectedResults.createThing;
  const createKeysRes = expectedResults.createKeysCerts;
  const createPolicyRes = expectedResults.createPolicy;
  const endpointRes = expectedResults.endpoint;

  //stub services
  let createThingStub = stub(iot, 'createThing');
  createThingStub.returns({
    promise: () => {
      return Promise.resolve(createThingRes);
    }
  });
  createKeysStub = stub(iot, 'createKeysAndCertificate');
  createKeysStub.returns({
    promise: () => {
      return Promise.resolve(createKeysRes);
    }
  });
  let attachPrincipalStub = stub(iot, 'attachThingPrincipal');
  attachPrincipalStub.returns({
    promise: () => {
      return Promise.resolve('success');
    }
  });
  let createPolicyStub = stub(iot, 'createPolicy');
  createPolicyStub.returns({
    promise: () => {
      return Promise.resolve(createPolicyRes);
    }
  });
  let attachPrincPolStub = stub(iot, 'attachPrincipalPolicy');
  attachPrincPolStub.returns({
    promise: () => {
      return Promise.resolve('success');
    }
  });
  let getEndpointStub = stub(iot, 'describeEndpoint');
  getEndpointStub.returns({
    promise: () => {
      return Promise.resolve(endpointRes);
    }
  });

  //start service
  const iotService = new IoTService(iot);

  describe(`Has working method: 'createThing'`, () => {
    it('createThing calls the service with correct params and returns IoT promise', async () => {
      let myAttribute = { myAttribute: 'yas', anotherAttribute: 'werk' };
      let res = await iotService.createThing('MyTestThing');
      let res2 = await iotService.createThing('MyTestThing', myAttribute);
      expect(createThingStub.args[0][0]).to.deep.equal({
        thingName: 'MyTestThing'
      });
      expect(createThingStub.args[1][0]).to.deep.equal({
        thingName: 'MyTestThing',
        attributePayload: { attributes: myAttribute }
      });
      expect(res).to.deep.equal(createThingRes);
      expect(res2).to.deep.equal(createThingRes);
    });
  });
  describe(`has working method: 'createKeysCert'`, () => {
    it('createKeysCert calls service with correct arg and creates keys/certificate', async () => {
      let res1 = await iotService.createKeysCert(true);
      let res2 = await iotService.createKeysCert(false);
      expect(res1).to.deep.equal(createKeysRes);
      expect(res2).to.deep.equal(createKeysRes);
      expect(createKeysStub.args[0][0]).to.deep.equal({ setAsActive: true });
      expect(createKeysStub.args[1][0]).to.deep.equal({ setAsActive: false });
    });
  });
  describe(`has working method: 'attachThingPrincipal'`, () => {
    it('attachThingPrincipal calls the service with correct params and returns IoT promise', async () => {
      let res = await iotService.attachThingPrincipal('certArn', 'testThing');
      let calledWith = {
        principal: 'certArn',
        thingName: 'testThing'
      };
      expect(attachPrincipalStub.args[0][0]).to.deep.equal(calledWith);
    });
  });
  describe(`has working method: createPolicy`, () => {
    it('createPolicy calls the service with correct params and returns IoT promise', async () => {
      let res = await iotService.createPolicy();
      let policy = {
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
              'iot:UpdateThingShadow',
              'greengrass:AssumeRoleForGroup',
              'greengrass:CreateCertificate',
              'greengrass:GetConnectivityInfo',
              'greengrass:GetDeployment',
              'greengrass:GetDeploymentArtifacts',
              'greengrass:UpdateConnectivityInfo',
              'greengrass:UpdateCoreDeploymentStatus'
            ],
            Resource: ['*']
          }
        ]
      };
      let calledWith = {
        policyDocument: JSON.stringify(policy) /* required */,
        policyName: 'greengrassPolicy' /* required */
      };
      expect(res).to.deep.equal(createPolicyRes);
      expect(createPolicyStub.args[0][0]).to.deep.equal(calledWith);
    });
  });
  describe(`has working method: 'attachPrincipalPolicy'`, () => {
    it('attachPrincipalPolicy calls the service with correct params and returns IoT promise', async () => {
      let res = await iotService.attachPrincipalPolicy(
        'myPolicy',
        'myPrincipal'
      );
      expect(res).to.equal('success');
      expect(attachPrincPolStub.args[0][0]).to.deep.equal({
        policyName: 'myPolicy',
        principal: 'myPrincipal'
      });
    });
  });
  describe(`has a working method: 'getEndpoint'`, () => {
    it('getEndpoint calls the service with correct params and returns IoT promise', async () => {
      let res = await iotService.getIoTEndpoint();
      expect(res).to.equal(endpointRes);
    });
  });
});
