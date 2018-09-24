const fs = require('fs');
const { expect } = require('chai');

const { logRedDim } = require('../../src/utils/chalk');
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
      return expect(stub.calledOnce).to.equal(true);
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
    try {
      fs.unlinkSync('./groupInfo/groupInfoV1.json');
      logRedDim('groupInfoV1.json deleted successfully');
      fs.rmdirSync('./groupInfo');
      logRedDim('groupInfo folder deleted successfully');
      fs.unlinkSync('./certs/cloud-pem-crt');
      logRedDim('cloud-pem-crt deleted successfully');
      fs.unlinkSync('./certs/cloud-pem-key');
      logRedDim('cloud-pem-key deleted successfully');
      fs.unlinkSync('./config.json');
      logRedDim('cloud-pem-key deleted successfully');
    } catch (err) {
      console.log(err);
    }
    //reset stubs
    resetStubHistory(stubs);
  });
});
