(function startGameSystem(global){
  const {createHome,createStageOne,createStageTwo,createStageThree,createStageFour,createStageFive,createStageSix,createStageSeven,createStageEight,createStageNine,createStageTen}=global.GameModules||{};
  if(!createHome||!createStageOne||!createStageTwo||!createStageThree||!createStageFour||!createStageFive||!createStageSix||!createStageSeven||!createStageEight||!createStageNine||!createStageTen){console.error('遊戲模組載入失敗');return;}
  const scene=document.querySelector('#scene');
  const loading=document.querySelector('#loadingScreen');
  const delay=ms=>new Promise(resolve=>global.setTimeout(resolve,ms));
  let home;
  let stageTwo;
  let stageThree;
  let stageFour;
  let stageFive;
  let stageSix;
  let stageSeven;
  let stageEight;
  let stageNine;
  let stageTen;
  const returnToHome=()=>{
    [stageOne,stageTwo,stageThree,stageFour,stageFive,stageSix,stageSeven,stageEight,stageNine,stageTen]
      .forEach(stage=>stage?.exit?.());
    loading.classList.remove('is-active');
    loading.setAttribute('aria-hidden','true');
    document.querySelectorAll('#scene > .screen').forEach(screen=>{
      if(screen.id==='homeScreen')return;
      screen.classList.remove('is-active','is-entering','is-ready');
      screen.setAttribute('aria-hidden','true');
    });
    scene.classList.remove('stage-ratio');
    scene.scrollLeft=0;
    scene.scrollTop=0;
    home.show();
  };
  const stageOne=createStageOne({
    scene,
    element:document.querySelector('#stageOne'),
    onBack:()=>{stageOne.exit();home.show()},
    onNext:()=>{stageOne.exit();stageTwo.enter()}
  });
  stageTwo=createStageTwo({
    scene,
    element:document.querySelector('#stageTwo'),
    onBack:()=>{stageTwo.exit();stageOne.enter()},
    onNext:()=>{stageTwo.exit();stageThree.enter()}
  });
  stageThree=createStageThree({
    scene,
    element:document.querySelector('#stageThree'),
    onBack:()=>{stageThree.exit();stageTwo.enter()},
    onNext:()=>{stageThree.exit();stageFour.enter()}
  });
  stageFour=createStageFour({
    scene,
    element:document.querySelector('#stageFour'),
    onBack:()=>{stageFour.exit();stageThree.enter()},
    onNext:()=>{stageFour.exit();stageFive.enter()}
  });
  stageFive=createStageFive({
    scene,
    element:document.querySelector('#stageFive'),
    onBack:()=>{stageFive.exit();stageFour.enter()},
    onNext:()=>{stageFive.exit();stageSix.enter()}
  });
  stageSix=createStageSix({
    scene,
    element:document.querySelector('#stageSix'),
    onBack:()=>{stageSix.exit();stageFive.enter()},
    onNext:()=>{stageSix.exit();stageSeven.enter()}
  });
  stageSeven=createStageSeven({
    scene,
    element:document.querySelector('#stageSeven'),
    onBack:()=>{stageSeven.exit();stageSix.enter()},
    onNext:()=>{stageSeven.exit();stageEight.enter()}
  });
  stageEight=createStageEight({
    scene,
    element:document.querySelector('#stageEight'),
    onBack:()=>{stageEight.exit();stageSeven.enter()},
    onNext:()=>{stageEight.exit();stageNine.enter()}
  });
  stageNine=createStageNine({
    scene,
    element:document.querySelector('#stageNine'),
    onBack:()=>{stageNine.exit();stageEight.enter()},
    onNext:()=>{stageNine.exit();stageTen.enter()}
  });
  stageTen=createStageTen({
    scene,
    element:document.querySelector('#stageTen'),
    onBack:()=>{stageTen.exit();stageNine.enter()},
    // 結尾影片播放完毕后，统一清除全部关卡状态再返回首页，
    // 避免先前残留的关卡（例如 Stage 4）覆盖在首页上。
    onFinish:returnToHome
  });
  home=createHome({
    element:document.querySelector('#homeScreen'),
    startButton:document.querySelector('#startButton'),
    onStart:async()=>{home.hide();loading.classList.add('is-active');loading.setAttribute('aria-hidden','false');await delay(900);loading.classList.remove('is-active');loading.setAttribute('aria-hidden','true');await stageOne.enter()}
  });
})(window);
