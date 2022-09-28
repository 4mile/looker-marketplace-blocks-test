const core = require('@actions/core');
const exec = require('@actions/exec');
// const { exec, execSync ,spawn} = require("child_process");
require('dotenv').config()
const LOOKER_BASE_URL = process.env.LOOKER_BASE_URL //process.env.LOOKER_BASE_URL - Persist in GitHub secrets;
const LOOKER_CLIENT_ID = process.env.LOOKER_CLIENT_ID //process.env.LOOKER_CLIENT_ID; - Persist in GitHub secrets;
const LOOKER_CLIENT_SECRET = process.env.LOOKER_CLIENT_SECRET //process.env.LOOKER_CLIENT_SECRET; - Persist in GitHub secrets;
const project = '4_mile_demonstrations'
const explores = '4_mile_demonstrations/order_items'

// need names of model/view, etc... to feed spectacles
/* Next Steps

 * 1. Import marketplace.json file
 * 2. Extract model name
 * 3. Import manifest.lkml file
 * 4. Extract project name 
 * 5. Inject project name into child process that runs spectacles 
 * 6. Inject model/explore into child process that runs spectacles

*/

async function run() {
  try {
    // process.chdir('json-tests')
    // await exec.exec(`pip install spectacles`)
    // await exec.exec(`npm test`)
    await exec.exec(`npm install`)
    
    await exec.exec(`spectacles lookml \
      --base-url ${LOOKER_BASE_URL} \
      --client-id ${LOOKER_CLIENT_ID} \
      --client-secret ${LOOKER_CLIENT_SECRET} \
      --project ${project}`
      )
    await exec.exec(`spectacles content \
      --base-url ${LOOKER_BASE_URL} \
      --client-id ${LOOKER_CLIENT_ID} \
      --client-secret ${LOOKER_CLIENT_SECRET} \
      --project ${project}`
      )
    await exec.exec(`spectacles sql \
      --base-url ${LOOKER_BASE_URL} \
      --client-id ${LOOKER_CLIENT_ID} \
      --client-secret ${LOOKER_CLIENT_SECRET} \
      --project ${project} \
      --explores ${explores}`
      )
    await exec.exec(`spectacles assert \
    --base-url ${LOOKER_BASE_URL} \
    --client-id ${LOOKER_CLIENT_ID} \
    --client-secret ${LOOKER_CLIENT_SECRET} \
    --project ${project}`
    )
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
