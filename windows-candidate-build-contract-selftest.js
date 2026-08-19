const fs=require('fs'),assert=require('assert');
const workflow=fs.readFileSync('.github/workflows/build-windows.yml','utf8');
assert.ok(workflow.includes('- stabilization-audit-20260818'),'Windows candidate must build on stabilization branch pushes');
assert.ok(workflow.includes('node release-package-runtime-contract-selftest.js'),'Windows build must verify packaged runtime completeness before EXE build');
assert.ok(workflow.includes('npm run dist:win'),'Windows workflow must build the portable EXE');
assert.ok(workflow.includes('STABILIZATION_DEVICE_CHECKLIST.md'),'Windows classroom artifact must include the device checklist');
assert.ok(workflow.includes('if-no-files-found: error'),'missing EXE/guides must fail the build');
assert.ok(workflow.includes('Studyvillage-Windows-${{ github.ref_name }}'),'candidate artifacts must be distinguishable by branch/tag');
console.log('windows candidate build contract self-test passed');
