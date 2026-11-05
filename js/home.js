(function registerHomeModule(global){
  function createHome({element,startButton,onStart}){
    const startCoverMusic=()=>global.GameAudio?.start();
    const officialUrl='https://www.ctci-hec.com.tw/';
    let startInProgress=false;

    element.insertAdjacentHTML('beforeend',`
      <button class="home-link-button home-official-button" type="button" aria-label="前往中鼎工程官方網站">
        <img src="assets/home-official-button.png" alt="中鼎工程官方網站">
      </button>
      <button class="home-link-button home-video-button" type="button" aria-label="從介紹影片按鈕前往中鼎工程官方網站">
        <img src="assets/home-video-button.png" alt="介紹影片與中鼎工程官方網站">
      </button>
    `);

    const openOfficialSite=()=>{
      void global.GameAudio?.playClick();
      const popup=global.open(officialUrl,'ctci-official','popup=yes,width=1200,height=800,resizable=yes,scrollbars=yes');
      popup?.focus?.();
    };

    // 首頁預設開啟音樂；若瀏覽器限制自動播放，首次操作畫面時立即啟動。
    global.GameAudio?.setMuted(false);
    startCoverMusic();
    global.addEventListener('pageshow',startCoverMusic,{once:true});
    global.addEventListener('pointerdown',startCoverMusic,{once:true,capture:true});
    global.addEventListener('keydown',startCoverMusic,{once:true,capture:true});

    startButton.addEventListener('click',async()=>{
      if(startInProgress||!element.classList.contains('is-active'))return;
      startInProgress=true;
      startButton.disabled=true;
      startCoverMusic();
      try{
        await onStart();
      }catch(error){
        console.error('遊戲啟動失敗',error);
        startInProgress=false;
        startButton.disabled=false;
        element.classList.add('is-active');
        element.setAttribute('aria-hidden','false');
        element.style.pointerEvents='auto';
      }
    });
    element.querySelectorAll('.home-link-button').forEach(button=>button.addEventListener('click',openOfficialSite));
    return{
      show(){startInProgress=false;startButton.disabled=false;startButton.removeAttribute('disabled');element.classList.add('is-active');element.setAttribute('aria-hidden','false');element.style.pointerEvents='auto';startCoverMusic()},
      hide(){element.classList.remove('is-active');element.setAttribute('aria-hidden','true');element.style.pointerEvents='none'}
    };
  }
  global.GameModules=global.GameModules||{};
  global.GameModules.createHome=createHome;
})(window);
