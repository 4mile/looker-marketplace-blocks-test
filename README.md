# looker-marketplace-blocks-test

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