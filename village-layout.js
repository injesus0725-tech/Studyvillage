/* v0.9.0 village layout
   Adds visual districts and roads to the expanded map without coupling them to game logic. */
(()=>{
  const map=document.querySelector('#world-map');
  if(!map)return;
  const style=document.createElement('style');
  style.textContent=`
    .village-road{position:absolute;z-index:0;background:#e7d29d;border:5px solid #d3ba7d;border-radius:30px;box-shadow:inset 0 0 0 3px #f1dfae}
    .road-h{left:8%;top:48%;width:84%;height:120px}.road-v{left:47%;top:7%;width:140px;height:86%}
    .road-nw{left:24%;top:27%;width:34%;height:90px;transform:rotate(-28deg);transform-origin:left center}
    .road-ne{left:50%;top:27%;width:29%;height:90px;transform:rotate(24deg);transform-origin:left center}
    .road-sw{left:22%;top:58%;width:36%;height:90px;transform:rotate(26deg);transform-origin:left center}
    .road-se{left:50%;top:58%;width:35%;height:90px;transform:rotate(-25deg);transform-origin:left center}
    .village-plaza{position:absolute;left:50%;top:52%;width:310px;height:250px;transform:translate(-50%,-50%);z-index:1;border-radius:48%;background:#f2dfa9;border:10px solid #d7bd7c;box-shadow:0 10px 24px #56733d2c,inset 0 0 0 8px #f8ebc8}
    .village-plaza:after{content:'🌳 마을 광장';position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);padding:10px 18px;border-radius:18px;background:#ffffffe8;color:#426044;font-weight:900;white-space:nowrap}
    .district-sign{position:absolute;z-index:3;padding:8px 13px;border-radius:14px;background:#fffdf0e8;border:3px solid #fff;color:#3c5b41;font-weight:900;box-shadow:0 6px 12px #34513925;pointer-events:none}
    .sign-school{left:8%;top:5%}.sign-library{right:7%;top:7%}.sign-shop{left:8%;bottom:5%}.sign-quiz{right:7%;bottom:5%}
    .shop-zone{position:absolute;left:10%;bottom:12%;z-index:2;font-size:72px;text-align:center}.shop-zone span{display:block;margin-top:-8px;padding:5px 10px;border-radius:13px;background:#ffffffe8;color:#31513a;font-size:14px;font-weight:900}
    .flower{position:absolute;z-index:1;font-size:30px;opacity:.9}.f1{left:36%;top:40%}.f2{left:61%;top:66%}.f3{left:19%;top:70%}.f4{right:20%;top:35%}
  `;
  document.head.appendChild(style);
  const add=(cls,html='')=>{const el=document.createElement('div');el.className=cls;el.innerHTML=html;map.appendChild(el);return el};
  add('village-road road-h');add('village-road road-v');add('village-road road-nw');add('village-road road-ne');add('village-road road-sw');add('village-road road-se');add('village-plaza');
  add('district-sign sign-school','🏫 배움터 구역');add('district-sign sign-library','📚 책마루 구역');add('district-sign sign-shop','🏪 상점 구역');add('district-sign sign-quiz','❓ 도전 구역');
  add('shop-zone obstacle','🏪<span>꾸미기 상점</span>');
  add('flower f1','🌼');add('flower f2','🌷');add('flower f3','🌻');add('flower f4','🌸');
})();