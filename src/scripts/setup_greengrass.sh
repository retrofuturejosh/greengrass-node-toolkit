#!/bin/bash
sudo su

export CWD=$(pwd)

# get CA root
wget -O $CWD/certs/root-ca-pem http://www.symantec.com/content/en/us/enterprise/verisign/roots/VeriSign-Class%203-Public-Primary-Certification-Authority-G5.pem

# Copy greengrass binaries
tar -xzf $CWD/downloads/greengrass-linux-x86-64-1.6.0.tar.gz -C /

# Copy certs
cp $CWD/certs/* /greengrass/certs

# Copy config
/bin/cp $CWD/config.json /greengrass/config
