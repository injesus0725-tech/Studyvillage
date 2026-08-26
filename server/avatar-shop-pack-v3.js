import { avatarShopPackV4 } from './avatar-shop-pack-v4.js';

const packV3={
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

export const avatarShopPackV3=Object.freeze({...packV3,...avatarShopPackV4});
