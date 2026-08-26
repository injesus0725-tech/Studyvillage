const fs=require('fs'),assert=require('assert');
const pack=fs.readFileSync('question-guide-packs.js','utf8'),index=fs.readFileSync('index.html','utf8'),template=fs.readFileSync('QUESTION_SET_TEMPLATE.md','utf8');
for(const token of ['GUIDE_PACKS','StudyVillageInstallGuideQuestionPacks','StudyVillageGuideQuestionPackStatus','allowedSubjects','allowedSpaces','validQuestionId','duplicate guide question pack skipped'])assert.ok(pack.includes(token),`guide pack registry missing ${token}`);
for(const token of ['activityId','subject','grade','semester','unit','subunit','difficulty','spaces','explanation'])assert.ok(pack.includes(token),`guide pack metadata missing ${token}`);
assert.ok(index.indexOf('question-data.js')<index.indexOf('question-guide-packs.js')&&index.indexOf('question-guide-packs.js')<index.indexOf('assets/student-question-overrides.js'),'guide question packs must load after bundled data and before teacher filtering');
for(const token of ['question-guide-packs.js','지도안/지도서 문제 팩','고유 ID','spaces'])assert.ok(template.includes(token),`guide pack template missing ${token}`);
console.log('question guide pack contract selftest: ok');
