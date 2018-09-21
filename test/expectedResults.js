module.exports = {
  createGroup: {
    Arn: 'groupArn',
    CreationTimestamp: 'timestamp',
    Id: 'groupId',
    LastUpdatedTimestamp: 'timestamp',
    Name: 'testGroup'
  },
  createThing: {
    thingName: 'myNewThing',
    thingArn: 'thingArn',
    thingId: 'randomString'
  },
  createKeysCerts: {
    certificateArn: 'certArn',
    certificateId: 'certId',
    certificatePem: 'certPem',
    keyPair: {
      PublicKey: 'publicKey',
      PrivateKey: 'privateKey'
    }
  },
  createCoreDefinition: {
    Arn: 'coreArn',
    CreationTimestamp: 'timestamp',
    Id: 'coreId',
    LastUpdatedTimestamp: 'timestamp',
    LatestVersion: 'lastestVersionId',
    LatestVersionArn: 'versionArn',
    Name: 'myNewGroup'
  },
  createPolicy: {
    policyName: 'greengrassPolicy',
    policyArn: 'policyArn',
    policyDocument:
      '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["iot:Publish","iot:Subscribe","iot:Connect","iot:Receive","iot:GetThingShadow","iot:DeleteThingShadow","iot:UpdateThingShadow","greengrass:AssumeRoleForGroup","greengrass:CreateCertificate","greengrass:GetConnectivityInfo","greengrass:GetDeployment","greengrass:GetDeploymentArtifacts","greengrass:UpdateConnectivityInfo","greengrass:UpdateCoreDeploymentStatus"],"Resource":["*"]}]}',
    policyVersionId: '1'
  },
  createGGVersion: {
    Arn: 'versionArn',
    CreationTimestamp: 'timestamp',
    Id: 'groupId',
    Version: 'versionId'
  },
  endpoint: { endpointAddress: 'uniquenumber.iot.us-east-1.amazonaws.com' },
  groupInfo: {
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
  }
};
