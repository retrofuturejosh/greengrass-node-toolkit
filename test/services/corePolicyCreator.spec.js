const { expect } = require('chai');

const { CorePolicyCreator } = require('../../src/services/corePolicyCreator');

let standardPolicy = {
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
        'iot:UpdateThingShadow'
      ],
      Resource: ['*']
    },
    {
      Effect: 'Allow',
      Action: [
        'greengrass:GetConnectivityInfo',
        'greengrass:UpdateConnectivityInfo'
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
    let standardPolicyCopy = JSON.parse(JSON.stringify(standardPolicy));
    standardPolicyCopy.Statement[0].Resource = [
      `arn:aws:iot:us-east-1:878186260336:topic/$aws/things/myNewThing/shadow/*`
    ];
    it(`can add the correct resource to access topics on the thing's device shadow`, async () => {
      let policy = await new CorePolicyCreator()
        .greenlightThingShadow('myNewThing')
        .then(policy => {
          return policy.getPolicy();
        });
      expect(policy).to.deep.equal(standardPolicyCopy);
    });
  });
  describe(`Method: 'greenlightThingArr'`, () => {
    let standardPolicyCopy = JSON.parse(JSON.stringify(standardPolicy));
    standardPolicyCopy.Statement[0].Resource = [
      `arn:aws:iot:us-east-1:878186260336:topic/$aws/things/myNewThing/shadow/*`,
      `arn:aws:iot:us-east-1:878186260336:topic/$aws/things/myOtherThing/shadow/*`
    ];
    it(`can take an array of thing names and add the correct resources to access topics on the things' device shadows`, async () => {
      let policy = await new CorePolicyCreator()
        .greenlightThingArr(['myNewThing', 'myOtherThing'])
        .then(policy => {
          return policy.getPolicy();
        });
      expect(policy).to.deep.equal(standardPolicyCopy);
    });
  });
  describe(`Method: 'greenlightThingArr'`, () => {
    let anotherPolicy = JSON.parse(JSON.stringify(standardPolicy));
    anotherPolicy.Statement[0].Resource = [
      `arn:aws:iot:us-east-1:878186260336:topic/$aws/things/myNewThing/shadow/*`,
      `arn:aws:iot:us-east-1:878186260336:topic/$aws/things/myOtherThing/shadow/*`
    ];
    it('can add an existing Resource array', () => {
      let policy = new CorePolicyCreator()
        .addIoTResources([
          `arn:aws:iot:us-east-1:878186260336:topic/$aws/things/myNewThing/shadow/*`,
          `arn:aws:iot:us-east-1:878186260336:topic/$aws/things/myOtherThing/shadow/*`
        ])
        .getPolicy();
      expect(policy).to.deep.equal(anotherPolicy);
    });
  });
});
