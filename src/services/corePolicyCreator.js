const AWS = require('aws-sdk');
const sts = new AWS.STS();

class CorePolicyCreator {
  constructor() {
    this.policy = {
      Version: '2012-10-17',
      Statement: []
    };
    this.iotThingStatement = {
      Effect: 'Allow',
      Action: [
        'iot:GetThingShadow',
        'iot:DeleteThingShadow',
        'iot:UpdateThingShadow'
      ],
      Resource: []
    };
    this.iotTopicStatement = {
      Effect: 'Allow',
      Action: ['iot:Receive', 'iot:Publish'],
      Resource: []
    };
    this.iotTopicFilterStatement = {
      Effect: 'Allow',
      Action: ['iot:Subscribe'],
      Resource: []
    };
    this.iotStatement = {
      Effect: 'Allow',
      Action: ['iot:Connect'],
      Resource: ['*']
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
    let thingStatement = JSON.parse(JSON.stringify(this.iotThingStatement));
    let topicStatement = JSON.parse(JSON.stringify(this.iotTopicStatement));
    let topicFilterStatement = JSON.parse(
      JSON.stringify(this.iotTopicFilterStatement)
    );
    let iotStatement = JSON.parse(JSON.stringify(this.iotStatement));
    let greengrassStatement = JSON.parse(
      JSON.stringify(this.greengrassStatement)
    );
    policy.Statement = policy.Statement.concat(
      thingStatement,
      topicStatement,
      topicFilterStatement,
      iotStatement,
      greengrassStatement
    );
    console.log('POLICY : \n\n\n');
    console.log(JSON.stringify(policy));
    return policy;
  }

  addThingResource(thing) {
    let thingResource = `arn:aws:iot:us-east-1:${this.account}:thing/${thing}`;
    let newStatement = JSON.parse(JSON.stringify(this.iotThingStatement));
    let oldResource = newStatement.Resource;
    let newResource = [].concat(oldResource, thingResource);
    newStatement.Resource = newResource;
    this.iotThingStatement = newStatement;
    return this;
  }

  addTopicResource(thing) {
    let topicResource = `arn:aws:iot:us-east-1:${
      this.account
    }:topic/$aws/things/${thing}/*`;
    let newStatement = JSON.parse(JSON.stringify(this.iotTopicStatement));
    let oldResource = newStatement.Resource;
    let newResource = [].concat(oldResource, topicResource);
    newStatement.Resource = newResource;
    this.iotTopicStatement = newStatement;
    return this;
  }

  addTopicFilterResource(thing) {
    let topicFilterResource = `arn:aws:iot:us-east-1:${
      this.account
    }:topicfilter/$aws/things/${thing}/*`;
    let newStatement = JSON.parse(JSON.stringify(this.iotTopicFilterStatement));
    let oldResource = newStatement.Resource;
    let newResource = [].concat(oldResource, topicFilterResource);
    newStatement.Resource = newResource;
    this.iotTopicFilterStatement = newStatement;
    return this;
  }

  async addThingCore(thing) {
    if (!this.account) {
      let account = await this.getAccount();
    }
    this.addThingResource(thing);
    this.addThingResource(`${thing}-gda`);
    this.addTopicResource(thing);
    this.addTopicResource(`${thing}-gda`);
    this.addTopicFilterResource(thing);
    this.addTopicFilterResource(`${thing}-gda`);
    return this;
  }

  async greenlightThingShadow(thing) {
    if (!this.account) {
      let account = await this.getAccount();
    }
    this.addThingResource(thing);
    this.addTopicResource(thing);
    this.addTopicFilterResource(thing);
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
   * @param {array} topicResourceArray array<string>
   */
  addStatement(statement) {
    this.iotThingStatement = statement[0];
    this.iotTopicStatement = statement[1];
    this.iotTopicFilterStatement = statement[2];
    this.iotStatement = statement[3];
    this.greengrassStatement = statement[4];
    return this;
  }
}

module.exports = {
  CorePolicyCreator
};
