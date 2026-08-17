// Grade 3 semester 1 review generators.
// These are intentionally bounded to concepts already learned before semester 2.
const pick=a=>a[Math.floor(Math.random()*a.length)];
const rand=(min,max)=>Math.floor(Math.random()*(max-min+1))+min;
const shuffle=a=>[...a].sort(()=>Math.random()-.5);
const mc=(prompt,answer,wrong)=>({prompt,answer:String(answer),choices:shuffle([String(answer),...wrong.map(String)]).slice(0,4)});
const distinct=(answer,values)=>[...new Set(values)].filter(v=>String(v)!==String(answer)).slice(0,3);

function addSub(){
  const add=Math.random()<.5;
  if(add){const a=rand(101,899),b=rand(101,999-a),answer=a+b;return mc(`${a} + ${b} = ?`,answer,distinct(answer,[answer+10,answer-10,answer+100,answer-100,answer+1]));}
  const a=rand(201,999),b=rand(101,a-1),answer=a-b;return mc(`${a} - ${b} = ?`,answer,distinct(answer,[answer+10,answer-10,answer+100,Math.abs(answer-100),answer+1]));
}
function division(){const divisor=rand(2,9),q=rand(1,9),n=divisor*q;return mc(`${n} ÷ ${divisor} = ?`,q,distinct(q,[q+1,Math.max(1,q-1),divisor,n]));}
function multiplication(){const oneDigit=Math.random()<.5?rand(2,9):rand(2,9),tens=rand(1,9)*10+rand(0,9),answer=tens*oneDigit;return mc(`${tens} × ${oneDigit} = ?`,answer,distinct(answer,[answer+oneDigit,Math.max(oneDigit,answer-oneDigit),tens+oneDigit,answer+10]));}
function length(){const mode=rand(0,2);if(mode===0){const cm=rand(1,30),mm=rand(1,9),answer=cm*10+mm;return mc(`${cm} cm ${mm} mm는 모두 몇 mm인가요?`,answer,distinct(answer,[cm+mm,cm*10,answer+10,answer-1]));}if(mode===1){const km=rand(1,8),m=rand(1,999),answer=km*1000+m;return mc(`${km} km ${m} m는 모두 몇 m인가요?`,answer,distinct(answer,[km*100+m,km+m,answer+1000,Math.max(1,answer-1000)]));}const a=rand(1,8)*1000+rand(0,999),b=rand(100,a),answer=a-b;return mc(`${a} m에서 ${b} m를 빼면 몇 m인가요?`,answer,distinct(answer,[answer+100,Math.max(1,answer-100),a+b,answer+10]));}
function time(){const h=rand(1,11),m=rand(0,11)*5,elapsed=rand(1,10)*5,total=h*60+m+elapsed,ah=Math.floor(total/60),am=total%60,display=`${ah>12?ah-12:ah}시 ${am}분`;return mc(`${h}시 ${m}분부터 ${elapsed}분 후의 시각은?`,display,distinct(display,[`${h}시 ${Math.max(0,m-elapsed)}분`,`${h}시 ${m}분`,`${ah>12?ah-12:ah}시 ${(am+10)%60}분`]));}
function fraction(){const denominator=rand(2,10),mode=rand(0,2);if(mode===0){const numerator=rand(1,denominator-1);return mc(`전체를 똑같이 ${denominator}부분으로 나눈 것 중 ${numerator}부분을 나타내는 분수는?`,`${numerator}/${denominator}`,distinct(`${numerator}/${denominator}`,[`${denominator}/${numerator}`,`1/${denominator}`,`${numerator}/${denominator+1}`,`${numerator+1}/${denominator}`]));}if(mode===1){const a=rand(1,denominator-1),b=rand(1,denominator-1),answer=a===b?'=':a>b?'>':'<';return mc(`${a}/${denominator}  □  ${b}/${denominator}에서 □에 알맞은 기호는?`,answer,distinct(answer,['>','<','=']));}const a=rand(2,9),b=rand(2,9);const answer=a===b?'=':a<b?'>':'<';return mc(`1/${a}  □  1/${b}에서 □에 알맞은 기호는?`,answer,distinct(answer,['>','<','=']));}
function decimal(){const whole=rand(0,9),tenth=rand(1,9),answer=`${whole}.${tenth}`;return mc(`${whole}와 0.${tenth}을 합한 수는?`,answer,distinct(answer,[`${tenth}.${whole}`,`${whole}.${Math.max(0,tenth-1)}`,`${whole+1}.${tenth}`,`${whole}${tenth}`]));}

export const GRADE3_REVIEW_CATEGORIES=Object.freeze([
  {id:'g3-add-sub',name:'3학년 복습 · 세 자리 수 덧셈과 뺄셈',dailyLimit:3,generate:addSub},
  {id:'g3-division',name:'3학년 복습 · 나눗셈',dailyLimit:3,generate:division},
  {id:'g3-multiplication',name:'3학년 복습 · 곱셈',dailyLimit:3,generate:multiplication},
  {id:'g3-length',name:'3학년 복습 · 길이',dailyLimit:3,generate:length},
  {id:'g3-time',name:'3학년 복습 · 시간',dailyLimit:3,generate:time},
  {id:'g3-fraction',name:'3학년 복습 · 분수',dailyLimit:3,generate:fraction},
  {id:'g3-decimal',name:'3학년 복습 · 소수',dailyLimit:3,generate:decimal}
]);
export function generateGrade3Review(categoryId,count=5){const c=GRADE3_REVIEW_CATEGORIES.find(x=>x.id===categoryId);if(!c)return null;return Array.from({length:Math.max(1,Math.min(20,count))},()=>c.generate());}
