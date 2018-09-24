const fs = require('fs');
const { expect } = require('chai');
const ncp = require('ncp').ncp;

const { logRedDim } = require('../../src/utils/chalk');
const { addDevice } = require('../../src/addDevice');
const expectedResults = require('../expectedResults');
const { createGreengrassGroup } = require('../../src/createGroup');
const {
  greengrass,
  iot,
  createDeviceDefVersionStub,
  createThingStub,
  createKeysStub,
  attachPrincipalStub,
  createPolicyStub,
  attachPrincPolStub,
  createGroupVersionStub,
  resetStubHistory
} = require('../services/stubService');

describe('Add device function', () => {
  let stubs = [
    createThingStub,
    createKeysStub,
    attachPrincipalStub,
    createPolicyStub,
    attachPrincPolStub,
    createDeviceDefVersionStub,
    createGroupVersionStub
  ];
  before(async () => {
    fs.mkdirSync('./groupInfo');
    fs.writeFileSync(
      __dirname + `/../../groupInfo/groupInfoV1.json`,
      JSON.stringify({ group: { Id: 'groupId' } })
    );
    let res = await addDevice(iot, greengrass, 'myNewDevice');
  });
  it('Calls all the necessary APIs', () => {
    stubs.forEach(stub => {
      return expect(stub.calledOnce).to.equal(true);
    });
  });
  it('Writes the file ./addedDevices/myNewDevice/certInfo.json', () => {
    let certPath = fs.existsSync('./addedDevices/myNewDevice/certInfo.json');
    expect(certPath).to.equal(true);
  });
  after(() => {
    //clean up files
    try {
      fs.unlinkSync('./groupInfo/groupInfoV1.json');
      logRedDim('groupInfoV1.json deleted successfully');
      fs.rmdirSync('./groupInfo');
      logRedDim('groupInfo folder deleted successfully');
      fs.unlinkSync('./addedDevices/myNewDevice/certInfo.json');
      logRedDim('myNewDevice/certInfo.json deleted successfully');
      fs.rmdirSync('./addedDevices/myNewDevice');
      logRedDim('/addedDevices/myNewDevice folder deleted successfully');
      fs.rmdirSync('./addedDevices');
      logRedDim('/addedDevices folder deleted successfully');
    } catch (err) {
      console.log(err);
    }
    //reset history
    resetStubHistory(stubs);
  });
});
