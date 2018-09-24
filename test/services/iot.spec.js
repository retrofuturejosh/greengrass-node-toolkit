const { expect } = require('chai');

//import iot stubs, iot service, and expected results
const { IoTService } = require('../../src/services/iot');
const expectedResults = require('../expectedResults.js');
const {
  iot,
  createThingStub,
  createKeysStub,
  attachPrincipalStub,
  createPolicyStub,
  attachPrincPolStub,
  resetStubHistory
} = require('./stubService');

describe('IoT Service', () => {
  //start service
  const iotService = new IoTService(iot);

  //reset stubs after tests
  after(() => {
    let stubs = [
      createThingStub,
      createKeysStub,
      attachPrincipalStub,
      createPolicyStub,
      attachPrincPolStub
    ];
    resetStubHistory(stubs);
  });

  describe(`Has working method: 'createThing'`, () => {
    it('createThing calls the service with correct params and returns promise resolving to correct data', async () => {
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
      expect(res).to.deep.equal(expectedResults.createThingRes);
      expect(res2).to.deep.equal(expectedResults.createThingRes);
    });
  });
  describe(`has working method: 'createKeysCert'`, () => {
    it('createKeysCert calls service with correct arg and creates keys/certificate', async () => {
      let res1 = await iotService.createKeysCert(true);
      let res2 = await iotService.createKeysCert(false);
      expect(res1).to.deep.equal(expectedResults.createKeysRes);
      expect(res2).to.deep.equal(expectedResults.createKeysRes);
      expect(createKeysStub.args[0][0]).to.deep.equal({ setAsActive: true });
      expect(createKeysStub.args[1][0]).to.deep.equal({ setAsActive: false });
    });
  });
  describe(`has working method: 'attachThingPrincipal'`, () => {
    it('attachThingPrincipal calls the service with correct params and returns promise resolving to correct data', async () => {
      let res = await iotService.attachThingPrincipal('certArn', 'testThing');
      let calledWith = {
        principal: 'certArn',
        thingName: 'testThing'
      };
      expect(attachPrincipalStub.args[0][0]).to.deep.equal(calledWith);
    });
  });
  describe(`has working method: createPolicy`, () => {
    it('createPolicy calls the service with correct params and returns promise resolving to correct data', async () => {
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
      expect(res).to.deep.equal(expectedResults.createPolicyRes);
      expect(createPolicyStub.args[0][0].policyDocument).to.equal(
        JSON.stringify(policy)
      );
    });
  });
  describe(`has working method: 'attachPrincipalPolicy'`, () => {
    it('attachPrincipalPolicy calls the service with correct params and returns promise resolving to correct data', async () => {
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
    it('getEndpoint calls the service with correct params and returns promise resolving to correct data', async () => {
      let res = await iotService.getIoTEndpoint();
      expect(res).to.equal(expectedResults.endpointRes);
    });
  });
});
