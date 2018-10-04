const { expect } = require('chai');

const { CorePolicyCreator } = require('../../src/services/corePolicyCreator');

let standardPolicy = {
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Action: [
        'iot:GetThingShadow',
        'iot:DeleteThingShadow',
        'iot:UpdateThingShadow'
      ],
      Resource: []
    },
    { Effect: 'Allow', Action: ['iot:Receive', 'iot:Publish'], Resource: [] },
    { Effect: 'Allow', Action: ['iot:Subscribe'], Resource: [] },
    { Effect: 'Allow', Action: ['iot:Connect'], Resource: ['*'] },
    {
      Effect: 'Allow',
      Action: [
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

describe('CorePolicyCreator Class', () => {
  describe(`Method: 'getPolicy'`, () => {
    it('returns an appropriate policy', () => {
      let policy = new CorePolicyCreator().getPolicy();
      expect(policy).to.deep.equal(standardPolicy);
    });
  });
  describe(`Method: 'greenlightThingShadow'`, () => {
    it(`can add the correct resource to access topics on the thing's device shadow`, async () => {
      let account = await new CorePolicyCreator().getAccount();
      let standardPolicyCopy = JSON.parse(JSON.stringify(standardPolicy));
      standardPolicyCopy.Statement[0].Resource = [
        `arn:aws:iot:us-east-1:${account}:thing/myNewThing`
      ];
      standardPolicyCopy.Statement[1].Resource = [
        `arn:aws:iot:us-east-1:${account}:topic/$aws/things/myNewThing/*`
      ];
      standardPolicyCopy.Statement[2].Resource = [
        `arn:aws:iot:us-east-1:${account}:topicfilter/$aws/things/myNewThing/*`
      ];
      let policy = await new CorePolicyCreator()
        .greenlightThingShadow('myNewThing')
        .then(policy => {
          return policy.getPolicy();
        });
      expect(policy).to.deep.equal(standardPolicyCopy);
    });
  });
  describe(`Method: 'greenlightThingArr'`, () => {
    it(`can take an array of thing names and add the correct resources to access topics on the things' device shadows`, async () => {
      let account = await new CorePolicyCreator().getAccount();
      let standardPolicyCopy = JSON.parse(JSON.stringify(standardPolicy));
      standardPolicyCopy.Statement[0].Resource = [
        `arn:aws:iot:us-east-1:${account}:thing/myNewThing`,
        `arn:aws:iot:us-east-1:${account}:thing/myOtherThing`
      ];
      standardPolicyCopy.Statement[1].Resource = [
        `arn:aws:iot:us-east-1:${account}:topic/$aws/things/myNewThing/*`,
        `arn:aws:iot:us-east-1:${account}:topic/$aws/things/myOtherThing/*`
      ];
      standardPolicyCopy.Statement[2].Resource = [
        `arn:aws:iot:us-east-1:${account}:topicfilter/$aws/things/myNewThing/*`,
        `arn:aws:iot:us-east-1:${account}:topicfilter/$aws/things/myOtherThing/*`
      ];
      let policy = await new CorePolicyCreator()
        .greenlightThingArr(['myNewThing', 'myOtherThing'])
        .then(policy => {
          return policy.getPolicy();
        });
      expect(policy).to.deep.equal(standardPolicyCopy);
    });
  });
});
