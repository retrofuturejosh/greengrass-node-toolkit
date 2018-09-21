# AWS Greengrass Node.js Toolkit

#### Prerequisites

- Node.js
- AWS account (with admin IAM permissions)
- AWS CLI with credentials properly configured

## Install dependencies

```
npm install
```
---

# Simple Start

## Bootstrapping Greengrass Service

The following steps will create the necessary entities for a Greengrass Group and start the Greengrass service.

#### Step One: Name Group / Core

Inside `src/params.js`, set desired the names of your Greengrass Group, IoT Core, and IAM Policy.

#### Step Two: Run script

```
npm run bootstrap-greengrass
```
---

# Toolkit


## Create a Greengrass Group with Core

The following steps will create and attach the necessary AWS entities for a Greengrass Group:

- Greengrass Group
- IoT Thing Core
- Keys/Certificate
- IAM policy

#### Step One: Name Group / Core

Inside `src/params.js`, set desired the names of your Greengrass Group, IoT Core, and IAM Policy.

#### Step Two: Run script
```
npm run create-group
```
Group will be created. Metadata will be saved in `groupInfo.json`, certificates will be saved in `/certs`, and `config.json` will be created in root folder.

---

## Start Greengrass Service

Before executing this section, you must first create a Greengrass Group. The following script is completed under the assumption that `npm run create-group` has already created necessary certificates in `/certs` folder and added `config.json` in root folder.

If you created your group in the AWS console, you can add your certificates to the `certs` folder with the following logical names:

- `root-ca-pem` (AWS IoT root CA)
- `cloud-pem-crt` (Greengrass core certificate)
- `cloud-pem-key` (Greengrass core private key)

Also note: the Greengrass software provided in the `/downloads` folder is for an Amazon Linux environment. If you are installing the service on different architecture, add the necessary Greengrass software to the `downloads` folder and change line 14 in `src/scripts/start_greengrass.sh` to point to the correct file name.

```
tar -xzf $CWD/downloads/<FILENAME>tar.gz -C /
```

#### Run script

```
npm run start-greengrass
```

