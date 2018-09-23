const createGroupRes = {
  Arn: 'groupArn',
  CreationTimestamp: 'timestamp',
  Id: 'groupId',
  LastUpdatedTimestamp: 'timestamp',
  Name: 'testGroup'
};

const createThingRes = {
  thingName: 'myNewThing',
  thingArn: 'thingArn',
  thingId: 'randomString'
};

const createKeysRes = {
  certificateArn: 'certArn',
  certificateId: 'certId',
  certificatePem: 'certPem',
  keyPair: {
    PublicKey: 'publicKey',
    PrivateKey: 'privateKey'
  }
};

const createCoreRes = {
  Arn: 'coreArn',
  CreationTimestamp: 'timestamp',
  Id: 'coreId',
  LastUpdatedTimestamp: 'timestamp',
  LatestVersion: 'lastestVersionId',
  LatestVersionArn: 'versionArn',
  Name: 'myNewGroup'
};

const createPolicyRes = {
  policyName: 'greengrassPolicy',
  policyArn: 'policyArn',
  policyDocument:
    '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["iot:Publish","iot:Subscribe","iot:Connect","iot:Receive","iot:GetThingShadow","iot:DeleteThingShadow","iot:UpdateThingShadow","greengrass:AssumeRoleForGroup","greengrass:CreateCertificate","greengrass:GetConnectivityInfo","greengrass:GetDeployment","greengrass:GetDeploymentArtifacts","greengrass:UpdateConnectivityInfo","greengrass:UpdateCoreDeploymentStatus"],"Resource":["*"]}]}',
  policyVersionId: '1'
};

const createGroupVersionRes = {
  Arn: 'versionArn',
  CreationTimestamp: 'timestamp',
  Id: 'groupId',
  Version: 'versionId'
};
const endpointRes = {
  endpointAddress: 'uniquenumber.iot.us-east-1.amazonaws.com'
};

const createDeviceDefRes = {
  Arn: 'deviceArn',
  CreationTimestamp: 'timestamp',
  Id: 'definitionId',
  LastUpdatedTimestamp: 'timestamp',
  LatestVersion: 'latestVersion',
  LatestVersionArn: 'latestVersionArn',
  Name: 'definitionName'
};

const getGroupRes = {
  Arn: 'definitionARN',
  CreationTimestamp: 'timestamp',
  LastUpdatedTimestamp: 'timestamp',
  LatestVersion: 'latestVersion',
  LatestVersionArn: 'latestVersionArn',
  Name: 'groupName'
};

const getGroupVersionRes = {
  Arn: 'groupArn',
  CreationTimestamp: 'timestamp',
  Definition: {
    CoreDefinitionVersionArn: 'CoreDefinitionVersionArn',
    DeviceDefinitionVersionArn: 'DeviceDefinitionVersionArn',
    FunctionDefinitionVersionArn: 'FunctionDefinitionVersionArn',
    LoggerDefinitionVersionArn: 'LoggerDefinitionVersionArn',
    ResourceDefinitionVersionArn: 'ResourceDefinitionVersionArn',
    SubscriptionDefinitionVersionArn: 'SubscriptionDefinitionVersionArn'
  },
  Id: 'groupId',
  Version: 'groupVersionId'
};

const createDeviceDefVersionRes = {
  CertificateArn: 'certArn',
  Id: 'deviceId',
  SyncShadow: 'boolean',
  ThingArn: 'thingArn'
};

const getDeviceDefVersionRes = {
  Arn: 'deviceDefVersionArn',
  CreationTimestamp: 'timestamp',
  Definition: {
    Devices: [
      {
        CertificateArn: 'certArn',
        Id: 'deviceId',
        SyncShadow: true,
        ThingArn: 'thingArn'
      }
    ]
  },

  Id: 'deviceDefinitionVersionId',
  Version: 'deviceDefinitionVersion'
};

const listDeviceDefinitionsRes = {
  Definitions: [
    {
      Arn: 'deviceDefArn',
      CreationTimestamp: 'timestamp',
      Id: 'definitionId',
      LastUpdatedTimestamp: 'timestamp',
      LatestVersion: 'latestVersion',
      LatestVersionArn: 'latestVersionArn',
      Name: 'definitionName'
    }
  ],
  NextToken: 'nextToken'
};

const groupInfo = {
  group: {
    Arn: 'groupArn',
    CreationTimestamp: 'timestamp',
    Id: 'groupId',
    LastUpdatedTimestamp: 'timestamp',
    Name: 'testGroup'
  },
  thing: {
    thingName: 'myNewThing',
    thingArn: 'thingArn',
    thingId: 'randomString'
  },
  cert: {
    certificateArn: 'certArn',
    certificateId: 'certId',
    certificatePem: 'certPem',
    keyPair: { PublicKey: 'publicKey', PrivateKey: 'privateKey' }
  },
  policy: {
    policyName: 'greengrassPolicy',
    policyArn: 'policyArn',
    policyDocument:
      '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["iot:Publish","iot:Subscribe","iot:Connect","iot:Receive","iot:GetThingShadow","iot:DeleteThingShadow","iot:UpdateThingShadow","greengrass:AssumeRoleForGroup","greengrass:CreateCertificate","greengrass:GetConnectivityInfo","greengrass:GetDeployment","greengrass:GetDeploymentArtifacts","greengrass:UpdateConnectivityInfo","greengrass:UpdateCoreDeploymentStatus"],"Resource":["*"]}]}',
    policyVersionId: '1'
  },
  coreDefinition: {
    Arn: 'coreArn',
    CreationTimestamp: 'timestamp',
    Id: 'coreId',
    LastUpdatedTimestamp: 'timestamp',
    LatestVersion: 'lastestVersionId',
    LatestVersionArn: 'versionArn',
    Name: 'myNewGroup'
  },
  groupVersion: {
    Arn: 'versionArn',
    CreationTimestamp: 'timestamp',
    Id: 'groupId',
    Version: 'versionId'
  },
  iotHost: { endpointAddress: 'uniquenumber.iot.us-east-1.amazonaws.com' }
};

module.exports = {
  createGroupRes,
  createThingRes,
  createKeysRes,
  createCoreRes,
  createPolicyRes,
  createGroupVersionRes,
  endpointRes,
  createDeviceDefRes,
  getGroupRes,
  getGroupVersionRes,
  createDeviceDefVersionRes,
  getDeviceDefVersionRes,
  listDeviceDefinitionsRes,
  groupInfo
};
