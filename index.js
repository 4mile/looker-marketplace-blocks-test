const core = require('@actions/core');
const exec = require('@actions/exec');
const fs = require('fs')
const lookmlParser = require('lookml-parser')
// const { exec, execSync ,spawn} = require("child_process");
require('dotenv').config()
const LOOKER_BASE_URL = process.env.LOOKER_BASE_URL //process.env.LOOKER_BASE_URL - Persist in GitHub secrets;
const LOOKER_CLIENT_ID = process.env.LOOKER_CLIENT_ID //process.env.LOOKER_CLIENT_ID; - Persist in GitHub secrets;
const LOOKER_CLIENT_SECRET = process.env.LOOKER_CLIENT_SECRET //process.env.LOOKER_CLIENT_SECRET; - Persist in GitHub secrets;
// const project = '4_mile_demonstrations'
// process.chdir('../')

async function run() {
  // process.chdir('spectacles-tests')

  const cwd = process.cwd();
  const marketplace = parseMarketplace();
  const resultManifest = await parseLkml('manifest.lkml');
  const project = resultManifest.manifest.project_name
  const models = marketplace.models
  let exploresArr = []

  for (let i=0; i < models.length; i++ ) {
    let modelFolder;
    if (fs.existsSync(`${cwd}/main/${models[i].name}.model.lkml`)) modelFolder = '' 
    if (fs.existsSync(`${cwd}/main/models/${models[i].name}.model.lkml`)) modelFolder ='models/'

    const model = await parseLkml(`${modelFolder}${models[i].name}.model.lkml`)
    const includeType = typeof model.model[`${models[i].name}`].include
    const includes = includeType === 'string'
      ? [model.model[`${models[i].name}`].include.replace(/\/.*\//, '')].filter( item => item.includes('explore'))
      : model.model[`${models[i].name}`].include?.filter( item => item.includes('explore'))
    const modinc = includes?.map(item => {
      const removePrefix = item.replace(/\/.*\//, '')
      return removePrefix.slice(0, removePrefix.indexOf('.'))
    })
    modinc?.forEach( item => {
      exploresArr.push(`${models[i].name}/${item}`)
    })

    if (model.model[`${models[i].name}`].explore) {
      const inlineExp = Object.keys(model.model[`${models[i].name}`].explore).map( item => {
        return `${models[i].name}/${item}` 
      })
      exploresArr = [...exploresArr, ...inlineExp]
    }

  }
  const explores = exploresArr.join(' ')
  try {
    // process.chdir('json-tests')
    // await exec.exec(`pip install spectacles`)
    // await exec.exec(`npm test`)
    // await exec.exec(`npm install`)
    
    await exec.exec(`spectacles lookml \
      --base-url ${LOOKER_BASE_URL} \
      --client-id ${LOOKER_CLIENT_ID} \
      --client-secret ${LOOKER_CLIENT_SECRET} \
      --project ${project} \
      -v`
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
      --concurrency 20 \
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

async function parseLkml( file ) {
  const cwd = process.cwd(); 
  resultManifest = await lookmlParser.parseFiles({
    source:  `${cwd}/main/${file}`,
    fileOutput: "by-type",
    globOptions: {},
    readFileOptions: {encoding:"utf-8"},
    readFileConcurrency: 4,
    // console: console
  })
  return resultManifest
}

function parseMarketplace() {
  const cwd = process.cwd(); 
  const marketplaceRaw = fs.readFileSync(`${cwd}/main/marketplace.json`, 'utf8'); 
  try {
    var marketplace = JSON.parse(marketplaceRaw)
  } catch(e) {
    console.log('marketplace is not valid json')
  }
  return marketplace;
}

run();
