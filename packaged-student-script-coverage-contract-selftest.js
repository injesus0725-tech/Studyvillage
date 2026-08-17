const fs=require('fs'),assert=require('assert');
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const packaged=new Set(pkg.build?.files||[]);
const htmlFiles=['index.html','admin.html','connect.html'],localResources=[];
for(const htmlFile of htmlFiles){const html=fs.readFileSync(htmlFile,'utf8');for(const match of html.matchAll(/(?:src|href)="([^"]+)"/g)){const path=match[1];if(path.startsWith('http')||path.startsWith('#')||path.startsWith('data:')||path.includes('${')||path.includes('/')||path.includes('?'))continue;localResources.push({htmlFile,path})}}
const missing=localResources.filter(({path})=>!packaged.has(path));
assert.deepStrictEqual(missing,[],`Windows package is missing HTML resources: ${missing.map(x=>`${x.htmlFile}:${x.path}`).join(', ')}`);
for(const {htmlFile,path} of localResources)assert.ok(fs.existsSync(path),`${htmlFile} references a missing local file: ${path}`);
console.log('packaged HTML resource coverage contract self-test passed');
