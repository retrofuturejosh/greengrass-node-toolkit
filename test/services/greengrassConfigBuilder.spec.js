const { expect } = require('chai');

const { GreengrassConfigBuilder } = require('../../src/services/ggConfig');

let configOutline = {
  coreThing: {
    caPath: 'root-ca-pem',
    certPath: 'cloud-pem-crt',
    keyPath: 'cloud-pem-key',
    thingArn: 'thing-arn',
    iotHost: 'host-prefix.iot.aws-region.amazonaws.com',
    ggHost: 'greengrass.iot.us-east-1.amazonaws.com',
    keepAlive: 600,
    mqttMaxConnectionRetryInterval: 60
  },
  runtime: { cgroup: { useSystemd: 'yes' } },
  managedRespawn: true,
  writeDirectory: '/write-directory'
};

describe('GreenGrassConfigBuilder class', () => {
  let configBuilder = new GreengrassConfigBuilder();

  it(`has a method 'getConfig' that returns outline for greengrass config.json`, () => {
    let config = configBuilder.getConfig()
    expect(config).to.deep.equal(configOutline);
  });

  it(`has method 'addThingArn' that works`, () => {
    configBuilder.addThingArn('1234');
    let config = configBuilder.getConfig()
    expect(config.coreThing.thingArn).to.equal('1234');
  })

  it(`has a method 'addCaPath' that works`, () => {
    configBuilder.addCaPath('myCaPath');
    let config = configBuilder.getConfig()
    expect(config.coreThing.caPath).to.equal('myCaPath');
  })

  it(`has a method 'addCertPath' that works`, () => {
    configBuilder.addCertPath('myCertPath');
    let config = configBuilder.getConfig()
    expect(config.coreThing.certPath).to.equal('myCertPath');
  })

  it(`has a method 'addKeyPath' that works`, () => {
    configBuilder.addKeyPath('myKeyPath');
    let config = configBuilder.getConfig()
    expect(config.coreThing.keyPath).to.equal('myKeyPath');
  })

  it(`has a method 'addIotHost' that works`, () => {
    configBuilder.addIotHost('myIotHost');
    let config = configBuilder.getConfig()
    expect(config.coreThing.iotHost).to.equal('myIotHost');
  })

  it(`has a method 'addGgHost' that works`, () => {
    configBuilder.addGgHost('myGgHost');
    let config = configBuilder.getConfig()
    expect(config.coreThing.ggHost).to.equal('myGgHost');
  })

  it(`has a method 'changeWriteDirectory' that works`, () => {
    configBuilder.changeWriteDirectory('/new/path');
    let config = configBuilder.getConfig()
    expect(config.writeDirectory).to.equal('/new/path');
  })
});
