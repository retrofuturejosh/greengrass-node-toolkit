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
  it('Writes the file ./addedDevices/myNewDevice/deviceInfo.json', () => {
    let certPath = fs.existsSync('./addedDevices/myNewDevice/deviceInfo.json');
    expect(certPath).to.equal(true);
  });
  after(() => {
    //clean up files
    try {
      removeFile('./groupInfo/groupInfoV1.json');
      removeDirectory('./groupInfo');
      removeFile('./addedDevices/myNewDevice/deviceInfo.json');
      removeFile('./addedDevices/myNewDevice/certs/cloud-pem-crt');
      removeFile('./addedDevices/myNewDevice/certs/cloud-pem-key');
      removeDirectory('./addedDevices/myNewDevice/certs');
      removeDirectory('./addedDevices/myNewDevice');
      removeDirectory('./addedDevices');
    } catch (err) {
      console.log(err);
    }
    //reset history
    resetStubHistory(stubs);
  });
});

function removeFile(path) {
  fs.unlinkSync(path);
  logRedDim(`${path} deleted successfully`);
}

function removeDirectory(path) {
  fs.rmdirSync(path);
  logRedDim(`${path} folder deleted successfully`);
}
