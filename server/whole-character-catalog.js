export const wholeCharacterCatalog=Object.freeze([
  {id:'student-boy',name:'기본 남자 캐릭터',gender:'boy',builtIn:true,price:0},
  {id:'student-girl',name:'기본 여자 캐릭터',gender:'girl',builtIn:true,price:0}
]);

export const purchasableWholeCharacters=Object.freeze(wholeCharacterCatalog.filter(character=>!character.builtIn));
export const wholeCharacterIds=new Set(wholeCharacterCatalog.map(character=>character.id));
