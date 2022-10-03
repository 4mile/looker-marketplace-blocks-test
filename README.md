# Marketplace Automation Test Repo

This repository contains information and tests meant to streamline the validation of Looker Marketplace projects submitted by third party developers of Custom Visualiztions, Blocks and other Looker custom projects. This testing repo uses Spectacles CLI to validate Looker content, models, sql and assertions.

## Tools

1. Spectacles CLI
2. GitHub Actions CI - Will run tests on PR or Push

## What will be Tested

### Spectacles Validators
1. Looker Content
2. LookML
3. Model/explore SQL
4. Data test assertions

## Setup

1. Add the folder named `/.github/workflows` to the Looker repo to be tested. This tells GitHub you have a workflow to run.

2. Upload `spectacles_tests.yml` from this repo to `/.github/workflows` folder of the target Looker repo to be tested. The workflow yml will contain a reference to this action (please verify the latest version)

3. Commit and PR to GitHub.

4. On GitHub Actions tab, see the CI execution flow and results of tests.

5. On your Looker target repo (repo to be tested), you must add the following GitHub Secrets to tell the Action how to access your Looker instance:
    - LOOKER_BASE_URL: 'https://4mile.looker.com'
    - LOOKER_CLIENT_ID: <<Looker client id>>
    - LOOKER_CLIENT_SECRET: <<Looker client secret>>

6. Note: please ensure GitHub Actions are enabled on the repository to be tested by going to the settings of the repository and enabling permissions.

## Compiling Action

### If you need to make changes to this action:
- After making changes to index.js file and/or any other asset (for example, tests)
- run
```
ncc build index.js -o dist --source-map --license licenses.txt
```
- If `ncc` returns an error, you may need to install `@vercel/ncc` globally by running this first:
```
npm install -g @vercel/ncc
```
