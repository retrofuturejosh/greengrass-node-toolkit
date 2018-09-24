const AWS = require(`aws-sdk`);
const { stub } = require('sinon');

//import expected results
const expectedResults = require('../expectedResults');

//start greengrass() and iot()
const greengrass = new AWS.Greengrass({
  apiVersion: '2017-06-07',
  region: 'us-east-1'
});
const iot = new AWS.Iot({ apiVersion: '2015-05-28', region: 'us-east-1' });

//STUBS
//Greengrass Stubs
let createGroupStub = stub(greengrass, 'createGroup');
createGroupStub.returns({
  promise: () => {
    return Promise.resolve(expectedResults.createGroupRes);
  }
});
let createCoreDefStub = stub(greengrass, 'createCoreDefinition');
createCoreDefStub.returns({
  promise: () => {
    return Promise.resolve(expectedResults.createCoreRes);
  }
});
let createGroupVersionStub = stub(greengrass, 'createGroupVersion');
createGroupVersionStub.returns({
  promise: () => {
    return Promise.resolve(expectedResults.createGroupVersionRes);
  }
});
let createDeviceDefStub = stub(greengrass, 'createDeviceDefinition');
createDeviceDefStub.returns({
  promise: () => {
    return Promise.resolve(expectedResults.createDeviceDefRes);
  }
});
let getGroupStub = stub(greengrass, 'getGroup');
getGroupStub.returns({
  promise: () => {
    return Promise.resolve(expectedResults.getGroupRes);
  }
});
let getGroupVersionStub = stub(greengrass, 'getGroupVersion');
getGroupVersionStub.returns({
  promise: () => {
    return Promise.resolve(expectedResults.getGroupVersionRes);
  }
});
let createDeviceDefVersionStub = stub(
  greengrass,
  'createDeviceDefinitionVersion'
);
createDeviceDefVersionStub.returns({
  promise: () => {
    return Promise.resolve(expectedResults.createDeviceDefVersionRes);
  }
});
let getDeviceDefVersionStub = stub(greengrass, 'getDeviceDefinitionVersion');
getDeviceDefVersionStub.returns({
  promise: () => {
    return Promise.resolve(expectedResults.getDeviceDefVersionRes);
  }
});
let listDeviceDefinitionsStub = stub(greengrass, 'listDeviceDefinitions');
listDeviceDefinitionsStub.returns({
  promise: () => {
    return Promise.resolve(expectedResults.listDeviceDefinitionsRes);
  }
});

//IOT stubs
let createThingStub = stub(iot, 'createThing');
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
let attachPrincipalStub = stub(iot, 'attachThingPrincipal');
attachPrincipalStub.returns({
  promise: () => {
    return Promise.resolve('success');
  }
});
let createPolicyStub = stub(iot, 'createPolicy');
createPolicyStub.returns({
  promise: () => {
    return Promise.resolve(expectedResults.createPolicyRes);
  }
});
let attachPrincPolStub = stub(iot, 'attachPrincipalPolicy');
attachPrincPolStub.returns({
  promise: () => {
    return Promise.resolve('success');
  }
});
let getEndpointStub = stub(iot, 'describeEndpoint');
getEndpointStub.returns({
  promise: () => {
    return Promise.resolve(expectedResults.endpointRes);
  }
});

//HELPER FUNCTIONS

/**
 * calls an array of stubs one at a time with a supplied callback
 * @param {array} stubArr - array of stubs
 * @param {function} cb - cb(stub) => {};
 */
function callAllStubs(stubArr, cb) {
  stubArr.forEach(stub => {
    cb(stub);
  });
}

/**
 * takes an array of stubs and resets history on all
 * @param {Array} stubArr - array of stubs
 */
function resetStubHistory(stubArr) {
  callAllStubs(stubArr, stub => {
    stub.resetHistory();
  });
}

module.exports = {
  greengrass,
  iot,
  createGroupStub,
  createCoreDefStub,
  createGroupVersionStub,
  createDeviceDefStub,
  getGroupStub,
  getGroupVersionStub,
  createDeviceDefVersionStub,
  getDeviceDefVersionStub,
  listDeviceDefinitionsStub,
  createThingStub,
  createKeysStub,
  attachPrincipalStub,
  createPolicyStub,
  attachPrincPolStub,
  getEndpointStub,
  resetStubHistory,
  callAllStubs
};
