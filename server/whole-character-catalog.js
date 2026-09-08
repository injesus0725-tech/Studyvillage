export const wholeCharacterCatalog=Object.freeze([
  {id:'student-boy',name:'새 탐험가 남자 캐릭터',gender:'boy',builtIn:true,price:0},
  {id:'student-girl',name:'새 탐험가 여자 캐릭터',gender:'girl',builtIn:true,price:0},
  {id:'character-peter-pan-boy',name:'피터팬 남자 캐릭터',gender:'boy',builtIn:false,price:48},
  {id:'character-peter-pan-girl',name:'피터팬 여자 캐릭터',gender:'girl',builtIn:false,price:48},
  {id:'character-hello-kitty-boy',name:'헬로키티 남자 캐릭터',gender:'boy',builtIn:false,price:48},
  {id:'character-hello-kitty-girl',name:'헬로키티 여자 캐릭터',gender:'girl',builtIn:false,price:48},
  {id:'character-kuromi',name:'쿠로미 캐릭터',gender:'girl',builtIn:false,price:48},
  {id:'character-my-melody',name:'마이멜로디 캐릭터',gender:'girl',builtIn:false,price:48},
  {id:'character-cinnamoroll',name:'시나모롤 캐릭터',gender:'boy',builtIn:false,price:48},
  {id:'character-pompompurin',name:'폼폼푸린 캐릭터',gender:'boy',builtIn:false,price:48},
  {id:'character-hanbok-princess',name:'한복 공주 캐릭터',gender:'girl',builtIn:false,price:58},
  {id:'character-sailor-school',name:'세일러 스쿨 캐릭터',gender:'girl',builtIn:false,price:48},
  {id:'character-pastel-lovely',name:'파스텔 러블리 캐릭터',gender:'girl',builtIn:false,price:52},
  {id:'character-mechanic',name:'정비사 캐릭터',gender:'boy',builtIn:false,price:45},
  {id:'character-camping-brother',name:'캠핑 브라더 캐릭터',gender:'boy',builtIn:false,price:48},
  {id:'character-pilot',name:'파일럿 캐릭터',gender:'boy',builtIn:false,price:55},
  {id:'character-art-girl',name:'예술 소녀 캐릭터',gender:'girl',builtIn:false,price:48},
  {id:'character-forest-fairy',name:'숲의 요정 캐릭터',gender:'girl',builtIn:false,price:52},
  {id:'character-cheerleader',name:'치어리더 캐릭터',gender:'girl',builtIn:false,price:48},
  {id:'character-street-hero',name:'스트리트 히어로 캐릭터',gender:'boy',builtIn:false,price:52},
  {id:'character-scholar',name:'학자 캐릭터',gender:'boy',builtIn:false,price:45},
  {id:'character-guitar-teacher-suit',name:'기타 선생님 정장 캐릭터',gender:'boy',builtIn:false,price:58},
  {id:'character-guitar-teacher-casual',name:'기타 선생님 캐주얼 캐릭터',gender:'boy',builtIn:false,price:52},
  {id:'character-chef',name:'요리사 캐릭터',gender:'boy',builtIn:false,price:45}
]);

export const purchasableWholeCharacters=Object.freeze(wholeCharacterCatalog.filter(character=>!character.builtIn));
export const wholeCharacterIds=new Set(wholeCharacterCatalog.map(character=>character.id));
