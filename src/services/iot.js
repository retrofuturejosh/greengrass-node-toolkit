const { logGreenDim, logRed } = require('../utils/chalk.js');
const { CorePolicyCreator } = require('./corePolicyCreator');

class IoTService {
  constructor(iot) {
    this.iot = iot;
  }

  /**
   * creates an iot thing
   * @param {string} thingName - name of thing to be created
   * @param {object}  attributes - (optional) object of attributes for thing. e.g. { watts: '100', lumens: '1100' }
   */
  createThing(thingName, attributes) {
    let thingParams = {
      thingName
    };

    if (attributes) {
      thingParams.attributePayload = { attributes };
    }

    return this.iot
      .createThing(thingParams)
      .promise()
      .then(res => {
        logGreenDim(`Successfully created thing: ${JSON.stringify(res)}`);
        return res;
      })
      .catch(err => {
        logRed(`failed to create thing: \n ${err} \n ${err.stack}`);
      });
  }

  /**
   * creates iot keys and certificate
   * @param {boolean} active - setAsActive prop
   */
  createKeysCert(active) {
    const params = {
      setAsActive: active
    };
    return this.iot
      .createKeysAndCertificate(params)
      .promise()
      .then(res => {
        logGreenDim(`Successfully created keys: ${JSON.stringify(res)}`);
        return res;
      })
      .catch(err => {
        logRed(`failed to create keys: \n ${err} \n ${err.stack}`);
      });
  }

  /**
   * Attaches certificate to thing
   * @param {string} principal - certificate arn
   * @param {string} thingName - name of thing
   */
  attachThingPrincipal(principal, thingName) {
    const params = {
      principal,
      thingName
    };
    return this.iot
      .attachThingPrincipal(params)
      .promise()
      .then(res => {
        logGreenDim(
          `Successfully attached Thing Principal: ${JSON.stringify(res)}`
        );
        return res;
      })
      .catch(err => {
        logRed(`failed to attach thing principal: \n ${err} \n ${err.stack}`);
      });
  }

  /**
   * Creates necessary iot policy
   * @param {string} policyName - optional: name of policy
   * @param {object} policyDoc - optional: JSON policy document
   * @param {array} thingArray - optional: an Array<string> with the names of devices you want permissions to connect/get/update
   */
  async createPolicy(policyName, policyDoc, thingArray) {
    let policy;
    if (policyDoc) policy = policyDoc;
    else {
      const policyCreator = new CorePolicyCreator();
      if (thingArray)
        policy = await policyCreator.greenlightThingArr(thingArray);
      policy = policyCreator.getPolicy();
    }
    let hash = (Math.random() + 1).toString(36).substring(7);
    let params = {
      policyDocument: JSON.stringify(policy) /* required */,
      policyName: `greengrassPolicy${hash}` /* required */
    };

    if (policyDoc) params.policyDocument = JSON.stringify(policyDoc);
    if (policyName) params.policyName = policyName;

    return this.iot
      .createPolicy(params)
      .promise()
      .then(res => {
        logGreenDim(`Successfully Created Policy: ${JSON.stringify(res)}`);
        return res;
      })
      .catch(err => {
        logRed(`failed to create policy: \n ${err} \n ${err.stack}`);
      });
  }

  /**
   *
   * @param {service} iot - instance of aws.iot()
   * @param {string} policyName - name of IAM policy
   * @param {strint} principal - arn of principal cert
   */
  attachPrincipalPolicy(policyName, principal) {
    const params = {
      policyName,
      principal
    };
    return this.iot
      .attachPrincipalPolicy(params)
      .promise()
      .then(res => {
        logGreenDim(
          `Successfully Attached principal policy: ${JSON.stringify(res)}`
        );
        return res;
      })
      .catch(err => {
        logRed(`failed to attach principal policy: \n ${err} \n ${err.stack}`);
      });
  }

  /**
   * returns endpoint for aws iot communication
   * @param {string} type - endpoint type, one of: `iot:Data`, `iot:CredentialProvider` and `iot:Jobs`
   */
  getIoTEndpoint(type = 'iot:Data') {
    var params = {
      endpointType: type
    };
    return this.iot
      .describeEndpoint(params)
      .promise()
      .then(res => {
        logGreenDim(`got endpoint: ${JSON.stringify(res)}`);
        return res;
      })
      .catch(err => {
        logRed(`failed to get endpoing: \n ${err} \n ${err.stack}`);
      });
  }

  /**
   * creates a new policy version
   * @param {object} policyDoc
   * @param {string} policyName
   * @param {boolean} setAsDefault default is true
   */
  async createPolicyVersion(policyDoc, policyName, setAsDefault = true) {
    const params = {
      policyDocument: JSON.stringify(policyDoc),
      policyName,
      setAsDefault
    };
    return await this.iot
      .createPolicyVersion(params)
      .promise()
      .then(res => {
        logGreenDim(`created policy version: ${JSON.stringify(res)}`);
        return res;
      })
      .catch(err => {
        console.log(err);
      });
  }

  /**
   * returns info about policy
   * @param {string} policyName
   */
  async getPolicy(policyName) {
    const params = {
      policyName
    };
    return await this.iot
      .getPolicy(params)
      .promise()
      .then(res => {
        logGreenDim(`got policy info: ${JSON.stringify(res)}`);
        return res;
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = {
  IoTService
};
