/**
* (c) Copyright [2017] Micro Focus or one of its affiliates
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*  http://www.apache.org/licenses/LICENSE-2.0
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License.
*/

// npm install swagger-client esm request dotenv
/**
 * An example "main" application script for invoking restClient .
 */
 "use strict";
import RestClient from './restClient';
const restClient = new RestClient();

if (process.env.DisableSSLSecurity) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

var argv = require('yargs/yargs')(process.argv.slice(2))
    .usage('Usage $0 [createVersion|copyVersion] -name [string] -appName [string] -copyFrom [string]')
    .command('createVersion', 'Create a new application version')
    .command('copyVersion', 'Create a new application version by copying from an existing version')
    .string(['appName'])
    .string(['verName'])
    .string('copyFrom')
    .argv;

main(argv)
  .then(data => console.log(data))
  .catch(err => console.error(err));

async function main(argv) {

    // initialize restClient
    await restClient.initialize().then((data) => {
        console.log("initialization status: " + data);
        return data;
    }).catch((err) => { 
        console.log("initialization failed", err);
        return err;
    });
    const appName = argv.appName;
    const verName = argv.verName;

    // check if application exists
    let pResponse = await restClient.testProject(appName).then((data) => {
        return data;
    }).catch((err) => { 
        console.log("Failed to retrieve application", err);
        return err;
    });
    if (pResponse.found) {
        console.log(`Application "${appName}" found.`);
    } else {
        console.log(`Application "${appName}" does not exist!`);
        return `Application "${appName}" does not exist!`;
    }

    // get application id
    let appId = await restClient.getProject(appName).then((data) => {
        return (data.length ? data[0].id : 0);
    }).catch((err) => { 
        console.log("Failed to retrieve application", err);
        return err;
    });
    if (appId) {
        console.log(`Application "${appName}" id is: ${appId}.`);
    }  

    //
    // create a new blank application version
    //
    if ((argv._.indexOf('createVersion') > -1)) {
        console.log("Not yet implemented");
    }    

    //
    // copy an existing application version
    //
    let copyVerId = -1;
    if ((argv._.indexOf('copyVersion') > -1)) {

        // check if version already exists
        // TODO: getProjectVersion is inaccurate because it checks "description" as well
        let existingVerId = await restClient.getProjectVersion(appId, verName).then((data) => {
            return (data.length ? data[0].id : 0);
        }).catch((err) => {
            console.log("Failed to retrieve application version", err);
            return err;
        });
        if (existingVerId) {
            console.log(`Application version ${verName} already exists in ${appName} not creating`);
            return "success";
        } 

        // get existing application version id
        copyVerId = await restClient.getProjectVersion(appId, argv.copyFrom).then((data) => {
            return (data.length ? data[0].id : 0);
        }).catch((err) => { 
            console.log("failed to retrieve application version", err);
            return err;
        });
        if (copyVerId) {
            console.log(`Application Version "${argv.copyFrom}" id is: ${copyVerId}`);
        }   

        // copy the version
        await restClient.copyVersion({
            name: verName,
            description: verName,
            appName: appName,
            appId: appId,
            issueTemplateId: "Prioritized-HighRisk-Project-Template",
            copyVersionId: copyVerId,
        }).then((version) => {
            console.log(`Successfully created Application Version: "${version.name}`);
            return "Successfully created version: " + version.name;
        }).catch((err) => {
            console.log("error creating version ", err);
            return err;
        });  
    }
    
    return "success"
   
}    
 