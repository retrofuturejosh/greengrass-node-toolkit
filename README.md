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

The following steps will create the necessary entities for a Greengrass Group and set up the Greengrass service in 'us-east-1'.

#### Run Scripts
To create group and set up Greengrass:

```
GROUP_NAME=<YOUR_GROUP_NAME> CORE_NAME=<YOUR CORE NAME> npm run bootstrap-greengrass
```
To start Greengrass service:
```
npm run start-greengrass
```

---

# Toolkit

## TOOL: Create a Greengrass Group with Core

The following script will create and attach the necessary AWS entities for a Greengrass Group:

- Greengrass Group
- IoT Thing Core
- Keys/Certificate
- IAM policy

#### Run script
```
GROUP_NAME=<YOUR_GROUP_NAME> CORE_NAME=<YOUR CORE NAME> npm run create-group
```
Group will be created. Metadata will be saved in `groupInfo.json`, certificates will be saved in `/certs`, and `config.json` (for Greengrass) will be created in root folder.

---

## TOOL: Set Up and Start Greengrass Service

Before executing this section, you must first create a Greengrass Group. The following script is completed under the assumption that `npm run create-group` has already created necessary certificates in `/certs` folder and added `config.json` in root folder.

If you created your group in the AWS console, you can add `config.json` to the root folder and the certificates to the `certs` folder.

Also note: the Greengrass software provided in the `/downloads` folder is for an Amazon Linux environment. If you are installing the service on different architecture, add the necessary Greengrass software to the `downloads` folder and change line 14 in `src/scripts/start_greengrass.sh` to point to the correct file name.

```
tar -xzf $CWD/downloads/<FILENAME>tar.gz -C /
```

#### Run scripts

For Set Up
```
npm run setup-greengrass
```
To Start Service
```
npm run start-greengrass
```

___

## TOOL: Add a device to your group

The following script will create a new `Thing` with attached certificates, add it to your Greengrass Group as a device, and update your Greengrass Core's IAM policy to allow connecting to the device, publishing/subscribing to the device's topics, and getting/updating/deleting the device's thing shadow.

The following script is completed under the assumption that `npm run create-group` or `npm run bootstrap-greengrass` has already created the file `./groupInfo/groupInfoV1.json`.

#### Run script
```
DEVICE_NAME=<YOUR_DEVICE_NAME> npm run add-device
```
Metadata will be saved in `./addedDevices/<DEVICE_NAME>`, including certificates

---
