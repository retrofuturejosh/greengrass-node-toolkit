const AWS = require(`aws-sdk`);
const fs = require('fs');
const { expect } = require('chai');
const { stub, spy } = require('sinon');

const greengrass = new AWS.Greengrass({
  apiVersion: '2017-06-07',
  region: 'us-east-1'
});
const iot = new AWS.Iot({ apiVersion: '2015-05-28', region: 'us-east-1' });

const expectedResults = require('../expectedResults');
const { createGreengrassGroup } = require('../../src/createGroup');

describe('Greengrass set up', () => {
  let createThingStub;
  let createKeysStub;
  let attachPrincipalStub;
  let createPolicyStub;
  let attachPrincPolStub;
  let createGroupStub;
  let createCoreDefStub;
  let groupVersionStub;
  let getEndpointStub;

  before(async () => {
    //create stubs
    createThingStub = stub(iot, 'createThing');
    createThingStub.returns({
      promise: () => {
        return Promise.resolve(expectedResults.createThingRes);
      }
    });

    createKeysStub = stub(iot, 'createKeysAndCertificate');
    createKeysStub.returns({
      promise: () => {
        return Promise.resolve(expectedResults.createKeysRes);
      }
    });
    attachPrincipalStub = stub(iot, 'attachThingPrincipal');
    attachPrincipalStub.returns({
      promise: () => {
        return Promise.resolve('success');
      }
    });
    createPolicyStub = stub(iot, 'createPolicy');
    createPolicyStub.returns({
      promise: () => {
        return Promise.resolve(expectedResults.createPolicyRes);
      }
    });
    attachPrincPolStub = stub(iot, 'attachPrincipalPolicy');
    attachPrincPolStub.returns({
      promise: () => {
        return Promise.resolve('success');
      }
    });
    createGroupStub = stub(greengrass, 'createGroup');
    createGroupStub.returns({
      promise: () => {
        return Promise.resolve(expectedResults.createGroupRes);
      }
    });
    createCoreDefStub = stub(greengrass, 'createCoreDefinition');
    createCoreDefStub.returns({
      promise: () => {
        return Promise.resolve(expectedResults.createCoreRes);
      }
    });
    groupVersionStub = stub(greengrass, 'createGroupVersion');
    groupVersionStub.returns({
      promise: () => {
        return Promise.resolve(expectedResults.createGroupVersionRes);
      }
    });
    getEndpointStub = stub(iot, 'describeEndpoint');
    getEndpointStub.returns({
      promise: () => {
        return Promise.resolve(expectedResults.endpointRes);
      }
    });

    let result = await createGreengrassGroup(
      iot,
      greengrass,
      'testGroup',
      'testThing'
    );
  });
  it('Calls all the necessary APIs', () => {
    let stubs = [
      createThingStub,
      createKeysStub,
      attachPrincipalStub,
      createPolicyStub,
      attachPrincPolStub,
      createGroupStub,
      createCoreDefStub,
      groupVersionStub,
      getEndpointStub
    ];
    stubs.forEach(stub => {
      return checkStub(stub);
    });
  });
  it('Writes the folder/file ./groupInfo/groupInfoV1.json', () => {
    let groupInfo = JSON.parse(
      fs.readFileSync('./groupInfo/groupInfoV1.json').toString('utf-8')
    );
    expect(groupInfo).to.deep.equal(expectedResults.groupInfo);
  });
  it('Writes the file ./certs/cloud-pem-crt', () => {
    let certPath = fs.existsSync('./certs/cloud-pem-crt');
    expect(certPath).to.equal(true);
  });
  it('Writes the file ./certs/cloud-pem-key', () => {
    let keyPath = fs.existsSync('./certs/cloud-pem-key');
    expect(keyPath).to.equal(true);
  });
  it('Writes the file config.json', () => {
    let config = fs.existsSync('config.json');
    expect(config).to.equal(true);
  });
  after(() => {
    //Clean up files
    fs.unlink('./groupInfo/groupInfoV1.json', function(err) {
      if (err) return console.log(err);
      console.log('groupInfoV1.json deleted successfully');
    });
    fs.rmdir('./groupInfo', function(err) {
      if (err) return console.log(err);
      console.log('groupInfo folder deleted successfully');
    });
    fs.unlink('./certs/cloud-pem-crt', function(err) {
      if (err) return console.log(err);
      console.log('cloud-pem-crt deleted successfully');
    });
    fs.unlink('./certs/cloud-pem-key', function(err) {
      if (err) return console.log(err);
      console.log('cloud-pem-key deleted successfully');
    });
    fs.unlink('./config.json', function(err) {
      if (err) return console.log(err);
      console.log('cloud-pem-key deleted successfully');
    });
  });
});

function checkStub(stub) {
  return expect(stub.calledOnce).to.equal(true);
}
