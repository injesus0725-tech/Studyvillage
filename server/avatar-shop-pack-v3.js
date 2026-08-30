import { avatarShopPackV4 } from './avatar-shop-pack-v4.js';
import { avatarShopPackV5 } from './avatar-shop-pack-v5.js';

const packV3={
  'character-boy-02':{name:'밤빛 모험가',slot:'character',price:35},
  'character-boy-03':{name:'책마루 학자',slot:'character',price:35},
  'character-boy-04':{name:'초록 정찰대',slot:'character',price:40},
  'character-boy-05':{name:'별빛 마법사',slot:'character',price:45},
  'character-boy-06':{name:'햇살 기사',slot:'character',price:45},
  'character-boy-07':{name:'숲의 레인저',slot:'character',price:45},
  'character-boy-08':{name:'보랏빛 음유시인',slot:'character',price:45},
  'character-boy-09':{name:'붉은 용사',slot:'character',price:50},
  'character-boy-10':{name:'은빛 수호자',slot:'character',price:55},
  'character-girl-02':{name:'밤빛 모험가',slot:'character',price:35},
  'character-girl-03':{name:'책마루 학자',slot:'character',price:35},
  'character-girl-04':{name:'초록 정찰대',slot:'character',price:40},
  'character-girl-05':{name:'별빛 마법사',slot:'character',price:45},
  'character-girl-06':{name:'햇살 기사',slot:'character',price:45},
  'character-girl-07':{name:'숲의 레인저',slot:'character',price:45},
  'character-girl-08':{name:'보랏빛 음유시인',slot:'character',price:45},
  'character-girl-09':{name:'붉은 용사',slot:'character',price:50},
  'character-girl-10':{name:'은빛 수호자',slot:'character',price:55},
  'hair-mohawk':{name:'모히칸 머리',slot:'hair',price:18},
  'hair-braid':{name:'긴 땋은 머리',slot:'hair',price:20},
  'hat-cat-ears':{name:'고양이 귀 머리띠',slot:'hat',price:16},
  'hat-headphones':{name:'파란 헤드폰',slot:'hat',price:22},
  'glasses-red':{name:'빨간 동그란 안경',slot:'glasses',price:14},
  'outfit-sport-yellow':{name:'노란 체육복 상의',slot:'outfit',price:20},
  'outfit-cardigan-pink':{name:'분홍 가디건',slot:'outfit',price:22},
  'bottom-jogger-gray':{name:'회색 조거팬츠',slot:'bottom',price:20},
  'shoes-sneakers-green':{name:'초록 운동화',slot:'shoes',price:18},
  'bag-school-navy':{name:'남색 책가방',slot:'bag',price:24},
  'hand-camera':{name:'작은 카메라',slot:'hand',price:22},
  'hand-microphone':{name:'마이크',slot:'hand',price:20},
  'pet-penguin':{name:'펭귄 친구',slot:'pet',price:36},
  'pet-bee':{name:'꿀벌 친구',slot:'pet',price:32},
  'pet-turtle':{name:'거북이 친구',slot:'pet',price:34}
};

export const avatarShopPackV3=Object.freeze({...packV3,...avatarShopPackV4,...avatarShopPackV5});
