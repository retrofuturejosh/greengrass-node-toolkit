const fs = require('fs');
const { expect } = require('chai');

const expectedResults = require('../expectedResults');
const { createGreengrassGroup } = require('../../src/createGroup');
const {
  greengrass,
  iot,
  createGroupStub,
  createCoreDefStub,
  createGroupVersionStub,
  createThingStub,
  createKeysStub,
  attachPrincipalStub,
  createPolicyStub,
  attachPrincPolStub,
  resetStubHistory
} = require('../services/stubService');

describe('Greengrass set up', () => {
  let stubs = [
    createGroupStub,
    createCoreDefStub,
    createGroupVersionStub,
    createThingStub,
    createKeysStub,
    attachPrincipalStub,
    createPolicyStub,
    attachPrincPolStub
  ];
  //run the function before tests
  before(async () => {
    let result = await createGreengrassGroup(
      iot,
      greengrass,
      'testGroup',
      'testThing'
    );
  });

  it('Calls all the necessary APIs', () => {
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
    //reset stubs
    resetStubHistory(stubs);
  });
});

function checkStub(stub) {
  console.log(stub.calledOnce);
  return expect(stub.calledOnce).to.equal(true);
}
