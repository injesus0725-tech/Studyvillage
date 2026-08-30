export const wholeCharacterCatalog=Object.freeze([
  {id:'student-boy',name:'기본 남자 캐릭터',gender:'boy',builtIn:true,price:0},
  {id:'student-girl',name:'기본 여자 캐릭터',gender:'girl',builtIn:true,price:0},
  {id:'character-boy-02',name:'남자 기본 캐릭터 2',gender:'boy',builtIn:false,price:24},
  {id:'character-boy-03',name:'남자 기본 캐릭터 3',gender:'boy',builtIn:false,price:26},
  {id:'character-boy-04',name:'남자 기본 캐릭터 4',gender:'boy',builtIn:false,price:28},
  {id:'character-boy-05',name:'남자 기본 캐릭터 5',gender:'boy',builtIn:false,price:30},
  {id:'character-girl-02',name:'여자 기본 캐릭터 2',gender:'girl',builtIn:false,price:24},
  {id:'character-girl-03',name:'여자 기본 캐릭터 3',gender:'girl',builtIn:false,price:26},
  {id:'character-girl-04',name:'여자 기본 캐릭터 4',gender:'girl',builtIn:false,price:28},
  {id:'character-girl-05',name:'여자 기본 캐릭터 5',gender:'girl',builtIn:false,price:30}
]);

export const purchasableWholeCharacters=Object.freeze(wholeCharacterCatalog.filter(character=>!character.builtIn));
export const wholeCharacterIds=new Set(wholeCharacterCatalog.map(character=>character.id));
