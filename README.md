# Greengrass Set Up
##### Programmatic solution for creating a Greengrass Group
This solution will create and attach the necessary AWS entities for a Greengrass Group:
- Greengrass Group
- IoT Thing Core
- Keys/Certificate
- IAM policy

## Getting Started

#### Prerequisites
- Node.js
- AWS account
- AWS CLI and credentials with admin privilege
### Install
```
npm install
```
### Name Group / Core
Inside `src/params.js`, set desired the name of your Greengrass Group and IoT Core.
### Run script
```
npm run create-group
```
Group will be created and all metadata will be saved in `groupInfo.json`

