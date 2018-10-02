const AWS = require('aws-sdk');
const sts = new AWS.STS();

class CorePolicyCreator {
  constructor() {
    this.policy = {
      Version: '2012-10-17',
      Statement: []
    };
    this.iotStatement = {
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
      Resource: []
    };
    this.greengrassStatement = {
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
    };
    this.account = null;
    return this;
  }

  getPolicy() {
    let policy = JSON.parse(JSON.stringify(this.policy));
    let iotStatement = JSON.parse(JSON.stringify(this.iotStatement));
    if (!iotStatement.Resource.length) iotStatement.Resource = ['*'];
    let greengrassStatement = JSON.parse(
      JSON.stringify(this.greengrassStatement)
    );
    policy.Statement = policy.Statement.concat(iotStatement).concat(
      greengrassStatement
    );
    return policy;
  }

  async addThingCore(thing) {
    if (!this.account) {
      let account = await this.getAccount();
    }
    let thingResource = `arn:aws:iot:us-east-1:${this.account}:thing/${thing}`;
    let thingResourceGDA = `arn:aws:iot:us-east-1:${
      this.account
    }:thing/${thing}-gda`;
    let resourceGDA = `arn:aws:iot:us-east-1:${
      this.account
    }:topic/$aws/things/${thing}-gda/*`;
    let resource = `arn:aws:iot:us-east-1:${
      this.account
    }:topic/$aws/things/${thing}/*`;
    let newIotStatement = JSON.parse(JSON.stringify(this.iotStatement));
    let oldResource = newIotStatement.Resource;
    let newResource = [].concat(
      oldResource,
      thingResource,
      thingResourceGDA,
      resourceGDA,
      resource
    );
    newIotStatement.Resource = newResource;
    this.iotStatement = newIotStatement;
    return this;
  }

  async greenlightThingShadow(thing) {
    if (!this.account) {
      let account = await this.getAccount();
    }
    let resource = `arn:aws:iot:us-east-1:${this.account}:topic/$aws/things/${thing}/shadow/*`;
    let thingResource = `arn:aws:iot:us-east-1:${this.account}:thing/${thing}`;
    let newIotStatement = JSON.parse(JSON.stringify(this.iotStatement));
    let oldResource = newIotStatement.Resource;
    let newResource = [].concat(
      oldResource,
      thingResource,
      resource
    );
    newIotStatement.Resource = newResource;
    this.iotStatement = newIotStatement;
    return this;
  }

  async greenlightThingArr(thingArr) {
    let addPromise = [];
    for (let thing of thingArr) {
      let res = await this.greenlightThingShadow(thing);
      addPromise.push(res);
    }
    return Promise.all(addPromise).then(success => {
      return this;
    });
  }

  async getAccount() {
    let account = await sts
      .getCallerIdentity({})
      .promise()
      .then(data => {
        return data.Account;
      })
      .catch(err => {
        console.log(err);
      });
    this.account = account;
    return account;
  }

  /**
   *
   * @param {array} resourceArray array<string>
   */
  addIoTResources(resourceArray) {
    let newIotStatement = JSON.parse(JSON.stringify(this.iotStatement));
    newIotStatement.Resource = resourceArray;
    this.iotStatement = newIotStatement;
    return this;
  }
}

module.exports = {
  CorePolicyCreator
};
