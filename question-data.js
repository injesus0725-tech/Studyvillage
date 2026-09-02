/* v1.9 Studyvillage question data. Keep learning content separate from game logic for safe teacher review/edit history. */
(()=>{
  const sets={
    vocabulary:{
      activityId:'vocabulary',
      subject:'국어',
      topic:'어휘',
      grade:3,semester:1,unit:'어휘 익히기',difficulty:'normal',spaces:['bookmaru','curriculum','exploration'],enabled:true,
      bookmaru:true,
      questions:[
        {category:'어휘',word:'다정하다',options:['정이 많고 친절하다','매우 빠르다','소리가 크다','마음이 급하다'],answer:0},
        {category:'어휘',word:'망설이다',options:['바로 행동하다','결정하지 못하고 주저하다','기뻐서 웃다','조용히 기다리다'],answer:1},
        {category:'어휘',type:'input',word:'보람을 느껴 매우 기쁜 마음을 나타내는 낱말은? (「뿌듯」 또는 「뿌듯하다」처럼 써도 돼요.)',answerGuide:'어간이나 기본형 모두 정답으로 인정해요.',acceptedAnswers:['뿌듯','뿌듯하다','뿌듯한']},
        {category:'어휘',word:'살피다',options:['주의 깊게 자세히 보다','큰 소리로 부르다','빨리 달리다','잠깐 쉬다'],answer:0},
        {category:'어휘',word:'격려하다',options:['잘못을 꾸짖다','힘내도록 용기와 힘을 북돋우다','모르는 척하다','혼자 해결하다'],answer:1}
      ]
    },
    curriculumKorean:{activityId:'curriculum-korean',subject:'국어',topic:'문장과 낱말',grade:3,semester:1,unit:'1단원 재미가 톡톡톡',difficulty:'normal',spaces:['curriculum','exploration'],enabled:true,questions:[
      {question:'시에서 같은 말이나 비슷한 말이 되풀이되면 어떤 느낌을 줄까요?',options:['리듬감이 생긴다','내용이 모두 사라진다','글자가 작아진다','제목이 없어진다'],answer:0,explanation:'말을 되풀이하면 운율과 리듬감을 느낄 수 있어요.'},
      {question:'흉내 내는 말을 사용하면 좋은 점은 무엇인가요?',options:['모습이나 소리를 생생하게 나타낸다','문장을 무조건 짧게 만든다','글쓴이를 숨긴다','시간 순서를 없앤다'],answer:0,explanation:'의성어와 의태어는 소리나 모습을 생생하게 표현해요.'},
      {question:'‘졸졸’이 가장 잘 어울리는 것은 무엇인가요?',options:['시냇물이 흐르는 소리','천둥이 치는 소리','문이 세게 닫히는 소리','사자가 우는 소리'],answer:0,explanation:'졸졸은 적은 양의 물이 부드럽게 흐르는 소리를 나타내요.'},
      {question:'글을 읽고 중심 생각을 찾을 때 먼저 살필 것은 무엇인가요?',options:['반복되거나 중요하게 다룬 내용','글자 색깔만','종이의 크기','문장의 개수만'],answer:0,explanation:'반복되거나 중요하게 설명한 내용을 살피면 중심 생각을 찾기 쉬워요.'},
      {question:'친구의 발표를 들을 때 알맞은 태도는 무엇인가요?',options:['끝까지 듣고 궁금한 점을 묻는다','중간에 큰 소리로 끼어든다','다른 일을 한다','발표를 보지 않는다'],answer:0,explanation:'발표를 존중하며 끝까지 듣고 알맞게 질문해요.'}
    ]},
    curriculumMath:{activityId:'curriculum-math',subject:'수학',topic:'덧셈과 뺄셈',grade:3,semester:1,unit:'1단원 덧셈과 뺄셈',difficulty:'normal',spaces:['curriculum','exploration'],enabled:true,questions:[
      {question:'324 + 215의 값은?',options:['539','529','549','439'],answer:0,explanation:'백, 십, 일의 자리끼리 더하면 539예요.'},{question:'672 - 241의 값은?',options:['431','421','441','531'],answer:0,explanation:'각 자리에서 차례로 빼면 431이에요.'},{question:'덧셈에서 두 수의 순서를 바꾸어 더하면 합은 어떻게 될까요?',options:['같다','항상 1 커진다','항상 1 작아진다','0이 된다'],answer:0,explanation:'덧셈은 더하는 순서를 바꾸어도 합이 같아요.'},{question:'500에서 275를 빼면?',options:['225','235','325','215'],answer:0,explanation:'500-275=225예요.'},{question:'248 + 152를 어림하면 약 얼마인가요?',options:['400','300','500','200'],answer:0,explanation:'248은 약 250, 152는 약 150이므로 약 400이에요.'}
    ]},
    curriculumSocial:{activityId:'curriculum-social',subject:'사회',topic:'우리 고장의 모습',grade:3,semester:1,unit:'1단원 우리 고장의 모습',difficulty:'normal',spaces:['curriculum','exploration'],enabled:true,questions:[
      {question:'고장의 여러 장소를 위에서 내려다본 것처럼 나타낸 것은?',options:['지도','일기','동화','편지'],answer:0,explanation:'지도는 장소의 위치와 모습을 위에서 본 것처럼 나타내요.'},{question:'지도에서 방위를 나타낼 때 주로 위쪽은 어느 방향인가요?',options:['북쪽','남쪽','동쪽','서쪽'],answer:0,explanation:'일반적인 지도는 위쪽을 북쪽으로 나타내요.'},{question:'고장의 모습을 조사하는 방법으로 알맞은 것은?',options:['직접 관찰하고 사진을 찍는다','상상한 내용만 쓴다','아무에게도 묻지 않는다','한 장소만 보고 모두 같다고 한다'],answer:0,explanation:'직접 관찰하거나 사진, 면담 등 여러 방법으로 조사해요.'},{question:'장소에 대한 생각과 느낌이 사람마다 다른 까닭은?',options:['경험과 이용 목적이 다르기 때문','모든 사람이 같은 경험을 해서','장소 이름이 없어서','지도에 색이 없어서'],answer:0,explanation:'사람마다 장소에서 겪은 일과 이용하는 목적이 달라요.'},{question:'지도에서 건물이나 시설을 간단한 그림으로 나타낸 것은?',options:['기호','제목','축척','사진첩'],answer:0,explanation:'지도 기호는 장소나 시설을 간단하고 알아보기 쉽게 나타내요.'}
    ]},
    curriculumScience:{activityId:'curriculum-science',subject:'과학',topic:'물질의 성질',grade:3,semester:1,unit:'1단원 물질의 성질',difficulty:'normal',spaces:['curriculum','exploration'],enabled:true,questions:[
      {question:'물체를 만드는 재료를 무엇이라고 하나요?',options:['물질','온도','무게','빛'],answer:0,explanation:'나무, 금속, 플라스틱처럼 물체를 만드는 재료를 물질이라고 해요.'},{question:'금속으로 만든 물체의 공통적인 성질로 알맞은 것은?',options:['단단하고 광택이 나는 것이 많다','모두 물에 뜬다','손으로 쉽게 찢어진다','모두 투명하다'],answer:0,explanation:'금속은 대체로 단단하고 표면에 광택이 있어요.'},{question:'유리컵 대신 플라스틱 컵을 쓰면 좋은 상황은?',options:['깨질 위험을 줄이고 싶을 때','불에 직접 가열할 때','칼날을 만들 때','자석에 붙이고 싶을 때'],answer:0,explanation:'플라스틱은 유리보다 잘 깨지지 않아 안전하게 쓸 수 있어요.'},{question:'물질의 성질을 비교하는 방법으로 알맞은 것은?',options:['만져 보고 구부려 보고 관찰한다','이름만 보고 정한다','색 하나만 본다','친구의 답을 그대로 쓴다'],answer:0,explanation:'여러 방법으로 직접 관찰하고 시험해 성질을 비교해요.'},{question:'고무가 타이어 재료로 알맞은 까닭은?',options:['탄성이 있고 잘 미끄러지지 않아서','물에 녹아서','쉽게 깨져서','빛을 완전히 통과시켜서'],answer:0,explanation:'고무는 탄성이 있고 마찰이 커서 타이어에 알맞아요.'}
    ]},
    curriculumArts:{activityId:'curriculum-arts',subject:'예체능',topic:'표현과 감상',grade:3,semester:1,unit:'표현과 감상 기초',difficulty:'normal',spaces:['curriculum','exploration'],enabled:true,questions:[
      {question:'노래의 빠르기를 나타내는 말은?',options:['빠르기말','가사','음이름','제목'],answer:0,explanation:'빠르기말은 곡을 어느 정도 빠르게 연주할지 알려 줘요.'},{question:'미술 작품을 감상할 때 알맞은 태도는?',options:['느낌과 근거를 함께 말한다','정답 하나만 있다고 생각한다','작품을 함부로 만진다','친구의 느낌을 틀렸다고 한다'],answer:0,explanation:'작품에서 본 것을 근거로 자신의 느낌을 자유롭게 나눌 수 있어요.'},{question:'운동 전 준비 운동을 하는 가장 중요한 까닭은?',options:['몸을 풀어 다칠 위험을 줄이려고','더 빨리 지치려고','물을 마시지 않으려고','규칙을 없애려고'],answer:0,explanation:'준비 운동은 근육과 관절을 풀어 부상을 예방해요.'},{question:'여럿이 함께 경기할 때 지켜야 할 태도는?',options:['규칙을 지키고 서로 배려한다','이기기 위해 반칙한다','친구를 탓한다','혼자만 공을 가진다'],answer:0,explanation:'규칙과 배려를 지키면 모두가 안전하고 즐겁게 참여할 수 있어요.'},{question:'색을 섞거나 선을 다르게 사용해 나타낼 수 있는 것은?',options:['느낌과 생각','정답 번호만','소리의 크기만','시간표만'],answer:0,explanation:'색과 선의 특징을 활용해 느낌과 생각을 표현할 수 있어요.'}
    ]},
    explorationRiddles:{
      activityId:'exploration-riddle',
      subject:'창의적 사고',
      topic:'수수께끼 탐험',
      grade:3,semester:1,unit:'재미 수수께끼',difficulty:'mixed',spaces:['exploration'],enabled:true,
      bookmaru:false,
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
  const extraRiddles=[
    ['비가 올 때 펴고 그치면 접는 것은?','우산'],['이를 닦아 주지만 자기 이는 없는 것은?','칫솔'],['추울수록 입에서 잘 보이는 것은?','입김'],['밤하늘에서 모양이 날마다 조금씩 달라지는 것은?','달'],['비 온 뒤 하늘에 일곱 빛깔로 나타나는 것은?','무지개'],['문은 문인데 여닫을 수 없는 문은?','질문'],['차는 차인데 마실 수 없는 차는?','자동차'],['자는 자인데 잠을 자지 못하는 자는?','글자'],['사과는 사과인데 먹을 수 없는 사과는?','용서를 구하는 사과'],['다리는 네 개지만 걷지 못하고 사람이 공부할 때 쓰는 것은?','책상'],
    ['한 장씩 넘길수록 이야기가 앞으로 가는 것은?','책'],['아침에는 길고 한낮에는 짧아지는 것은?','그림자'],['물건을 넣을수록 배가 불러지는 것은?','가방'],['손을 씻겨 주며 자기는 점점 작아지는 것은?','비누'],['입구는 여럿이고 작은 방이 아주 많은 곤충의 집은?','벌집'],['날마다 날짜를 알려 주는 것은?','달력'],['소리는 내지만 입이 없고 시간을 알려 주는 것은?','알람시계'],['눈앞의 모습을 똑같이 보여 주는 것은?','거울'],['불을 붙여 쓰면 점점 짧아지는 것은?','초'],['땅속에서 나와 하늘을 향해 자라는 것은?','새싹'],
    ['집 안을 돌아다니며 먼지를 먹는 기계는?','청소기'],['몸에 구멍이 많지만 물을 잘 머금는 것은?','스펀지'],['손가락은 들어가지만 손 전체는 들어갈 수 없는 것은?','장갑'],['바람이 불면 빙글빙글 돌며 노는 것은?','바람개비'],['손으로 잡을 수 없지만 창문을 흔드는 것은?','바람'],['자기 몸을 녹여 어둠을 밝히는 것은?','양초'],['물 위에 떠다니며 사람이 타고 건너는 것은?','배'],['동서남북을 알려 주는 것은?','나침반'],['누르면 글자가 나타나지만 연필은 아닌 것은?','키보드'],['빨강·노랑·초록으로 길의 약속을 알려 주는 것은?','신호등'],
    ['겨울에 하얀 옷을 입고 봄이면 사라지는 사람은?','눈사람'],['목소리를 크게 만들어 주지만 자기는 말하지 못하는 것은?','마이크'],['하얀 종이를 먹고 글자를 뱉는 기계는?','프린터'],['종이 위의 잘못을 먹어 없애는 것은?','지우개'],['봄에는 초록 옷, 가을에는 울긋불긋한 옷을 입는 것은?','나무'],['날개가 돌지만 날지 못하고 바람을 만드는 것은?','선풍기'],['얼굴 앞에 쓰면 세상이 더 또렷해지는 것은?','안경'],['멀리 있는 사람의 목소리를 귀 가까이 가져오는 것은?','전화기'],['동그란 몸에 숫자가 있고 두 손으로 시간을 가리키는 것은?','시계'],['비 온 길에 생겼다가 해가 나면 사라지는 작은 호수는?','물웅덩이'],
    ['알록달록한 몸으로 종이 위에 길을 그리는 것은?','색연필'],['신으면 발이 따뜻하고 벗으면 납작해지는 것은?','양말'],['입으로 불면 커지고 놓치면 날아가는 것은?','풍선'],['빛이 있어야 태어나고 어둠 속에서 사라지는 것은?','그림자'],['먹을 것을 차갑게 지켜 주지만 자기는 먹지 않는 것은?','냉장고'],['바람을 먹고 하늘 높이 올라가는 것은?','연'],['비 오는 날 자동차 앞에서 좌우로 춤추는 것은?','와이퍼'],['물속에서 살지만 물을 마시면 죽는 것은?','소금'],['하늘을 날며 실에 매여 있는 것은?','연'],['종이를 접어 만들고 바람을 타고 나는 것은?','종이비행기'],
    ['둥근 몸을 발로 차도 화내지 않는 것은?','공'],['아무리 뛰어도 운동장을 벗어나지 않는 것은?','줄넘기 줄'],['머리를 빗어 주지만 손가락이 없는 것은?','빗'],['음식을 담지만 한입도 먹지 못하는 것은?','그릇'],['입은 크지만 말하지 않고 쓰레기를 먹는 것은?','쓰레기통'],['아침마다 울지만 눈물은 흘리지 않는 것은?','알람'],['길을 따라 달리지만 발이 없는 것은?','기차'],['숲에 서 있지만 한 발짝도 걷지 않는 것은?','나무'],['겨울에는 길에 뿌리고 음식에도 넣는 하얀 것은?','소금'],['물에 넣으면 사라지지만 물맛은 달라지는 것은?','설탕'],
    ['잘라도 아프지 않고 다시 자라는 것은?','머리카락'],['두 눈을 감아야 볼 수 있는 것은?','꿈'],['아무리 빨리 뛰어도 앞설 수 없는 것은?','자기 그림자'],['세상에서 가장 쉬운 숫자는?','190000(십구만)'],['세상에서 가장 억울한 도형은?','원통'],['세상에서 가장 뜨거운 전화는?','화상 전화'],['세상에서 가장 뜨거운 복숭아는?','천도복숭아'],['세상에서 가장 급하게 만든 떡은?','헐레벌떡'],['세상에서 가장 뜨거운 국은?','천국'],['세상에서 가장 차가운 국은?','외국'],
    ['세상에서 가장 무서운 비는?','낭비'],['세상에서 가장 반가운 비는?','단비'],['세상에서 가장 뜨거운 비는?','갈비'],['세상에서 가장 뜨거운 오리는?','회오리'],['오리가 얼면 무엇이 될까?','언덕'],['자동차가 놀라면 무엇이라고 할까?','카놀라유'],['왕이 넘어지면 무엇이라고 할까?','킹콩'],['개가 사람을 가르치면 무엇일까?','개인지도'],['소가 웃으면 어떤 소리가 날까?','우하하'],['소가 계단을 오르면 무엇일까?','소오름'],
    ['바나나가 웃으면 무엇일까?','바나나킥'],['아몬드가 죽으면 무엇일까?','다이아몬드'],['도둑이 가장 싫어하는 아이스크림은?','누가바'],['도둑이 가장 좋아하는 아이스크림은?','보석바'],['펭귄이 다니는 중학교는?','냉방중'],['펭귄이 다니는 고등학교는?','냉장고'],['곰이 목욕하는 곳은?','곰탕'],['세상에서 가장 뜨거운 산은?','화산'],['세상에서 가장 뜨거운 감은?','대감'],['세상에서 가장 뜨거운 닭은?','불닭'],
    ['세상에서 가장 뜨거운 바다는?','열받아'],['세상에서 가장 차가운 바다는?','썰렁해'],['세상에서 가장 쉬운 문은?','소문'],['세상에서 가장 뜨거운 개는?','안개'],['세상에서 가장 뜨거운 숫자는?','오(5)'],['세상에서 가장 뜨거운 글자는?','불 화(火)'],['신발이 화가 나면 하는 말은?','신발끈'],['왕이 궁에 가기 싫을 때 하는 말은?','궁시렁궁시렁'],['세상에서 가장 오래 사는 벌레는?','무당벌레'],['세상에서 가장 잔인한 운동은?','피구'],
    ['손이 둘이지만 박수를 못 치고 시간을 가리키는 것은?','시계'],['목은 있지만 머리가 없고 물을 담는 것은?','병'],['귀가 둘 있지만 듣지 못하고 음식을 끓이는 것은?','냄비'],['눈이 하나지만 보지 못하고 실을 데리고 다니는 것은?','바늘'],['이가 많지만 음식을 먹지 못하는 것은?','빗'],['혀는 있지만 맛을 보지 못하고 발에 신는 것은?','신발'],['등은 있지만 눕지 못하고 사람이 기대는 것은?','의자'],['머리와 꼬리는 있지만 몸이 없는 것은?','동전'],['입이 있지만 말하지 못하고 강물이 흐르는 곳은?','강 어귀'],['하루 종일 서 있지만 밤이 되면 길을 밝히는 것은?','가로등'],
    ['얼굴은 하나인데 표정이 숫자마다 다른 것은?','이모티콘'],['항상 따라오지만 앞에서는 볼 수 없는 것은?','뒤통수'],['오를 때는 가볍고 내려올 때는 무거운 것은?','양동이'],['구멍이 하나씩 늘수록 쓸 수 있는 칸이 줄어드는 것은?','공책'],['말하지 않아도 마음을 전할 수 있는 종이는?','편지'],['물 없이도 헤엄치고 하늘 없이도 나는 것은?','상상 속 물고기'],['다리가 많지만 한곳에 서서 사람들이 오르내리는 것은?','계단'],['밤에는 나타나고 낮에는 보이지 않는 작은 불빛은?','별'],['하늘에서 떨어져도 다치지 않고 손에서 녹는 것은?','눈송이'],['먹을 수는 없지만 생일마다 하나씩 더 받는 것은?','나이'],
    ['갈수록 가까워지지만 도착하면 이름이 바뀌는 날은?','내일'],['문을 닫아도 들어오고 눈을 감으면 더 잘 들리는 것은?','소리'],['아무리 나누어도 줄지 않고 오히려 커지는 것은?','기쁨'],['사람마다 하나씩 있지만 다른 사람 것이 더 자주 불리는 것은?','이름'],['앞으로만 가고 뒤로는 절대 돌아오지 않는 것은?','시간'],['한 번 입 밖으로 나오면 다시 담을 수 없는 것은?','말'],['가질수록 다른 사람에게 더 많이 줄 수 있는 것은?','지식'],['답을 찾으면 사라지는 것은?','궁금증'],['보이지 않지만 약속을 지킬수록 쌓이는 것은?','믿음'],['나누면 나눌수록 많아지는 것은?','사랑']
  ];
  const answerPool=extraRiddles.map(row=>row[1]);
  extraRiddles.forEach(([question,correct],index)=>{const wrong=[];for(let step=1;wrong.length<3;step++){const candidate=answerPool[(index+step*37)%answerPool.length];if(candidate!==correct&&!wrong.includes(candidate))wrong.push(candidate)}sets.explorationRiddles.questions.push({id:`riddle-${String(index+31).padStart(3,'0')}`,difficulty:index<60?'easy':'challenge',question,options:[correct,...wrong],answer:0,explanation:`정답은 ‘${correct}’이에요.`})});
  for(const set of Object.values(sets))set.questions=set.questions.map((question,index)=>({id:question.id||`${set.activityId}-${String(index+1).padStart(3,'0')}`,subject:question.subject||set.subject,grade:Number(question.grade||set.grade)||3,semester:Number(question.semester||set.semester)||1,unit:question.unit||set.unit,subunit:question.subunit||set.topic,difficulty:question.difficulty||set.difficulty||'normal',spaces:Array.isArray(question.spaces)?question.spaces:[...(set.spaces||[])],enabled:question.enabled!==false,...question}));
  window.StudyVillageQuestionSets=sets;
})();
