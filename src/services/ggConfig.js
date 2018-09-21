class GreengrassConfigBuilder {
  constructor() {
    this.config = {
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
  }

  getConfig() {
    return JSON.parse(JSON.stringify(this.config));
  }

  addThingArn(thingArn) {
    this.config.coreThing.thingArn = thingArn;
  }

  addCaPath(caPath) {
    this.config.coreThing.caPath = caPath;
  }

  addCertPath(certPath) {
    this.config.coreThing.certPath = certPath;
  }

  addKeyPath(keyPath) {
    this.config.coreThing.keyPath = keyPath;
  }

  addIotHost(iotHost) {
    this.config.coreThing.iotHost = iotHost;
  }

  addGgHost(ggHost) {
    this.config.coreThing.ggHost = ggHost;
  }

  changeWriteDirectory(writeDirectory) {
    this.config.writeDirectory = writeDirectory;
  }
}

module.exports = {
  GreengrassConfigBuilder
};
