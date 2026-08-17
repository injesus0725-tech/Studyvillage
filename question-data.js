/* v1.9 Studyvillage question data. Keep learning content separate from game logic for safe teacher review/edit history. */
(()=>{
  const sets={
    vocabulary:{
      activityId:'vocabulary',
      subject:'국어',
      topic:'어휘',
      questions:[
        {category:'어휘',word:'다정하다',options:['정이 많고 친절하다','매우 빠르다','소리가 크다','마음이 급하다'],answer:0},
        {category:'어휘',word:'망설이다',options:['바로 행동하다','결정하지 못하고 주저하다','기뻐서 웃다','조용히 기다리다'],answer:1},
        {category:'어휘',type:'input',word:'보람을 느껴 매우 기쁜 마음을 나타내는 낱말은?',acceptedAnswers:['뿌듯하다','뿌듯한']},
        {category:'어휘',word:'살피다',options:['주의 깊게 자세히 보다','큰 소리로 부르다','빨리 달리다','잠깐 쉬다'],answer:0},
        {category:'어휘',word:'격려하다',options:['잘못을 꾸짖다','힘내도록 용기와 힘을 북돋우다','모르는 척하다','혼자 해결하다'],answer:1}
      ]
    },
    explorationRiddles:{
      activityId:'exploration-riddle',
      subject:'창의적 사고',
      topic:'수수께끼 탐험',
      questions:[
        {id:'r01',difficulty:'easy',question:'먹을수록 커지고 물을 마시면 죽는 것은?',options:['불','구름','나무','그림자'],answer:0,explanation:'불은 연료를 먹으며 커지고 물을 만나면 꺼져요.'},
        {id:'r02',difficulty:'easy',question:'항상 내 앞에 있지만 볼 수 없는 것은?',options:['뒤통수','미래','거울','발자국'],answer:1,explanation:'미래는 늘 앞에 있지만 아직 볼 수 없어요.'},
        {id:'r03',difficulty:'easy',question:'다리는 네 개인데 걷지 못하는 것은?',options:['의자','강아지','말','고양이'],answer:0,explanation:'의자는 다리가 네 개지만 스스로 걷지 못해요.'},
        {id:'r04',difficulty:'easy',question:'쓰면 쓸수록 작아지는 것은?',options:['연필','공책','가방','책상'],answer:0,explanation:'연필은 사용할수록 짧아져요.'},
        {id:'r05',difficulty:'easy',question:'깨뜨려야만 사용할 수 있는 것은?',options:['달걀','유리컵','의자','연필'],answer:0,explanation:'달걀은 껍데기를 깨야 요리에 쓸 수 있어요.'},
        {id:'r06',difficulty:'easy',question:'아무리 달려도 제자리인 것은?',options:['시계','자동차','기차','자전거'],answer:0,explanation:'시계의 바늘은 계속 달리지만 시계 안에 있어요.'},
        {id:'r07',difficulty:'easy',question:'물속에 들어가도 젖지 않는 것은?',options:['그림자','수건','종이','모래'],answer:0,explanation:'그림자는 물에 비쳐도 젖지 않아요.'},
        {id:'r08',difficulty:'easy',question:'오를 때는 두 발, 내려올 때는 세 발인 것은?',options:['계단을 내려오는 사람과 지팡이','고양이','의자','자동차'],answer:0,explanation:'지팡이를 짚으면 내려올 때 세 발처럼 보여요.'},
        {id:'r09',difficulty:'easy',question:'가득 차면 오히려 가벼워지는 것은?',options:['풍선','책가방','물병','상자'],answer:0,explanation:'풍선은 공기로 가득 차면 위로 떠오를 수 있어요.'},
        {id:'r10',difficulty:'easy',question:'눈이 하나인데 볼 수 없는 것은?',options:['바늘','망원경','사람','카메라'],answer:0,explanation:'바늘에는 실을 끼우는 바늘귀가 있어요.'},
        {id:'r11',difficulty:'easy',question:'입이 하나인데 먹지 못하고 물만 뱉는 것은?',options:['분수','하마','컵','우산'],answer:0,explanation:'분수의 물 나오는 곳을 입처럼 볼 수 있어요.'},
        {id:'r12',difficulty:'easy',question:'날개 없이 하늘을 날고 눈 없이 우는 것은?',options:['구름','새','비행기','나비'],answer:0,explanation:'구름은 하늘을 떠다니고 비를 내려요.'},
        {id:'r13',difficulty:'easy',question:'잡으려고 하면 달아나고 가만히 있으면 따라오는 것은?',options:['그림자','토끼','바람','시간'],answer:0,explanation:'그림자는 움직이면 함께 움직여요.'},
        {id:'r14',difficulty:'easy',question:'세상에서 가장 큰 문은?',options:['소문','대문','교문','창문'],answer:0,explanation:'온 세상으로 퍼질 수 있는 소문을 이용한 말장난이에요.'},
        {id:'r15',difficulty:'easy',question:'계속 자라지만 절대 줄어들지 않는 것은?',options:['나이','머리카락','나무','연필'],answer:0,explanation:'나이는 시간이 지나면 계속 늘어나요.'},
        {id:'r16',difficulty:'challenge',question:'아침마다 머리를 밟고 지나가는 것은?',options:['빗','모자','신발','베개'],answer:0,explanation:'빗은 아침에 머리카락 위를 지나가요.'},
        {id:'r17',difficulty:'challenge',question:'몸은 하나인데 얼굴이 여러 개인 것은?',options:['주사위','사람','인형','거울'],answer:0,explanation:'주사위 한 개에는 여섯 면이 있어요.'},
        {id:'r18',difficulty:'challenge',question:'집은 집인데 사람이 살지 않는 집은?',options:['벌집','기와집','아파트','초가집'],answer:0,explanation:'벌집에는 사람이 아니라 벌이 살아요.'},
        {id:'r19',difficulty:'challenge',question:'매일 벗지만 옷은 아닌 것은?',options:['신발','잠옷','외투','모자'],answer:0,explanation:'집에 돌아오면 신발을 벗어요.'},
        {id:'r20',difficulty:'challenge',question:'말을 하면 할수록 줄어드는 것은?',options:['비밀','목소리','시간','공기'],answer:0,explanation:'비밀은 말할수록 비밀인 사람이 줄어들어요.'},
        {id:'r21',difficulty:'challenge',question:'항상 젖어 있으면서 다른 것을 말리는 것은?',options:['수건','비누','우산','물'],answer:0,explanation:'수건은 물기를 닦으며 스스로 젖어요.'},
        {id:'r22',difficulty:'challenge',question:'한 번도 움직이지 않지만 온 세상을 여행하는 것은?',options:['우표','의자','나무','돌'],answer:0,explanation:'우표는 편지에 붙어 여러 곳으로 여행해요.'},
        {id:'r23',difficulty:'challenge',question:'먹지는 못하지만 매일 밥을 받는 것은?',options:['밥그릇','강아지','숟가락','냉장고'],answer:0,explanation:'밥그릇은 밥을 담지만 먹지는 못해요.'},
        {id:'r24',difficulty:'challenge',question:'문을 열지 않고 방에 들어오는 것은?',options:['햇빛','친구','고양이','바람개비'],answer:0,explanation:'햇빛은 창문을 통해 방 안으로 들어와요.'},
        {id:'r25',difficulty:'challenge',question:'갈수록 뒤에 남는 것은?',options:['발자국','자동차','기차','바람'],answer:0,explanation:'걸어갈수록 발자국은 뒤에 남아요.'},
        {id:'r26',difficulty:'challenge',question:'손이 있지만 박수를 칠 수 없는 것은?',options:['시계','인형','로봇','장갑'],answer:0,explanation:'시계에는 시침과 분침이라는 손이 있어요.'},
        {id:'r27',difficulty:'challenge',question:'목은 있지만 머리가 없는 것은?',options:['병','사람','기린','셔츠'],answer:0,explanation:'병에는 병목이 있지만 머리는 없어요.'},
        {id:'r28',difficulty:'challenge',question:'귀가 있지만 듣지 못하는 것은?',options:['냄비','토끼','강아지','사람'],answer:0,explanation:'냄비 손잡이를 냄비 귀라고 부르기도 해요.'},
        {id:'r29',difficulty:'challenge',question:'한 글자인데 가장 뜨거운 것은?',options:['해','달','별','눈'],answer:0,explanation:'해는 빛과 열을 내요.'},
        {id:'r30',difficulty:'challenge',question:'매일 와도 절대 오늘이 아닌 것은?',options:['내일','아침','점심','밤'],answer:0,explanation:'내일이 오면 그날은 오늘이 되기 때문이에요.'}
      ]
    }
  };
  window.StudyVillageQuestionSets=sets;
})();
