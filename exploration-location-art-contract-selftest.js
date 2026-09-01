const assert=require('assert'),fs=require('fs');
const code=fs.readFileSync('assets/student-exploration-v2.js','utf8');
const files=['gymnasium','nurse-office','cafeteria','wee-class','class-3-1','teachers-office','playground','multipurpose-room','english-room'].map(name=>`assets/exploration-locations/${name}.png`);
for(const file of files){assert.ok(fs.existsSync(file),`missing location art: ${file}`);assert.ok(fs.statSync(file).size<=40*1024,`location art is too heavy: ${file}`);assert.ok(code.includes(file),`exploration does not use ${file}`)}
assert.ok(files.reduce((sum,file)=>sum+fs.statSync(file).size,0)<=320*1024,'all location art must remain lightweight');
for(const name of ['체육관','보건실','식당','Wee클래스','3-1 교실','교무실','운동장','다목적실','영어실'])assert.ok(code.includes(name),`missing school location ${name}`);
for(const oldName of ['푸른 숲길','바위 오솔길','달빛 길','반짝이는 길','버섯 길','꽃향기 길','옛 유적 길','샘물 길'])assert.ok(!code.includes(oldName),`retired path remains: ${oldName}`);
console.log('nine lightweight school exploration location art contract self-test passed');
