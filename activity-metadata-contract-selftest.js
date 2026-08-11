import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { activityMetadataMap } from './server/activity-metadata.js';

const source=fs.readFileSync(new URL('./activity-taxonomy.js',import.meta.url),'utf8');
const context={window:{StudyVillageQuestionSets:{}}};
vm.createContext(context);
vm.runInContext(source,context,{filename:'activity-taxonomy.js'});

const browserMap=context.window.StudyVillageActivityTaxonomy||{};
for(const [id,server] of Object.entries(activityMetadataMap)){
  const browser=browserMap[id];
  assert.ok(browser,`browser metadata missing: ${id}`);
  assert.equal(browser.subject,server.subject,`subject mismatch: ${id}`);
  assert.equal(browser.topic,server.topic,`topic mismatch: ${id}`);
  assert.equal(browser.name,server.name,`name mismatch: ${id}`);
}
for(const id of Object.keys(browserMap))assert.ok(activityMetadataMap[id],`server metadata missing: ${id}`);
console.log('activity metadata contract selftest: ok');
