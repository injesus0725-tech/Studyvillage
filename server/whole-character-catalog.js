export const wholeCharacterCatalog=Object.freeze([
  {id:'student-boy',name:'기본 남자 캐릭터',gender:'boy',builtIn:true,price:0},
  {id:'character-boy-02',name:'씩씩한 밤색 머리',gender:'boy',price:35},
  {id:'character-boy-03',name:'차분한 단발 머리',gender:'boy',price:35},
  {id:'character-boy-04',name:'활기찬 묶음 머리',gender:'boy',price:40},
  {id:'character-boy-05',name:'별빛 파란 머리',gender:'boy',price:45},
  {id:'character-boy-06',name:'햇살 금빛 머리',gender:'boy',price:45},
  {id:'character-boy-07',name:'초록 숲빛 머리',gender:'boy',price:45},
  {id:'character-boy-08',name:'보랏빛 단발 머리',gender:'boy',price:45},
  {id:'character-boy-09',name:'붉은 모험가 머리',gender:'boy',price:50},
  {id:'character-boy-10',name:'은빛 영웅 머리',gender:'boy',price:55},
  {id:'student-girl',name:'기본 여자 캐릭터',gender:'girl',builtIn:true,price:0},
  {id:'character-girl-02',name:'씩씩한 밤색 머리',gender:'girl',price:35},
  {id:'character-girl-03',name:'차분한 단발 머리',gender:'girl',price:35},
  {id:'character-girl-04',name:'활기찬 묶음 머리',gender:'girl',price:40},
  {id:'character-girl-05',name:'별빛 파란 머리',gender:'girl',price:45},
  {id:'character-girl-06',name:'햇살 금빛 머리',gender:'girl',price:45},
  {id:'character-girl-07',name:'초록 숲빛 머리',gender:'girl',price:45},
  {id:'character-girl-08',name:'보랏빛 단발 머리',gender:'girl',price:45},
  {id:'character-girl-09',name:'붉은 모험가 머리',gender:'girl',price:50},
  {id:'character-girl-10',name:'은빛 영웅 머리',gender:'girl',price:55}
]);

export const purchasableWholeCharacters=Object.freeze(wholeCharacterCatalog.filter(character=>!character.builtIn));
export const wholeCharacterIds=new Set(wholeCharacterCatalog.map(character=>character.id));
