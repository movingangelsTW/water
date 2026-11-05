(function registerStageNineModule(global) {
  const ROOT = 'assets/stage9';
  const FILES = [
    'BG_09.png', 'ui1_09_v2.png', 'ui2_09.png',
    'photo1_09.png', 'photo2_09.png', 'photo3_09.png', 'photo4_09.png'
  ];

  function layer(file, className, alt = '') {
    const hidden = alt ? '' : ' aria-hidden="true"';
    return `<img class="s9-layer ${className}" src="${ROOT}/${file}" alt="${alt}"${hidden}>`;
  }

  function markup() {
    return `
      <div class="s9-view">
        ${layer('BG_09.png', 's9-background', '乾淨河川與城市背景')}
        ${layer('photo1_09.png', 's9-card s9-card-1', '截：攔截廚房油脂')}
        ${layer('photo2_09.png', 's9-card s9-card-2', '濾：水槽加裝濾網')}
        ${layer('photo3_09.png', 's9-card s9-card-3', '避：避免丟入異物')}
        ${layer('photo4_09.png', 's9-card s9-card-4', '分：分辨可丟標示')}
        <img class="s9-layer s9-common-frame" src="assets/common/all_ui.png" alt="" aria-hidden="true">
        ${layer('ui1_09_v2.png', 's9-title', '用戶維管事項；截、濾、避、分四字訣')}
        ${layer('ui2_09.png', 's9-stage-count', '階段 9/9')}

        <p class="s9-footer-caption">維持居家污水管排水順暢，延長污水下水道使用壽命。</p>
        <button class="s9-back" type="button" aria-label="返回階段八"><img src="assets/common/previous_ui.png" alt="返回階段八"></button>
        <button class="s9-next" type="button" aria-label="進入結尾關卡"><img src="assets/common/next_ui.png" alt="下一階段"></button>
        <button class="s9-sound" type="button" aria-label="切換音效" aria-pressed="true"><img src="assets/common/sound_ui.png" alt="音效"></button>
      </div>`;
  }

  function createStageNine({ scene, element, onBack, onNext }) {
    element.innerHTML = markup();
    const soundButton = element.querySelector('.s9-sound');
    let entranceTimer = 0;

    FILES.forEach(file => {
      const image = new Image();
      image.src = `${ROOT}/${file}`;
    });

    function resetSceneViewport() {
      scene.scrollLeft = 0;
      scene.scrollTop = 0;
    }

    element.querySelector('.s9-back').addEventListener('click', onBack);
    element.querySelector('.s9-next').addEventListener('click', onNext);
    global.GameAudio?.registerButton(soundButton);

    return {
      enter() {
        global.clearTimeout(entranceTimer);
        element.className = 'stage-nine screen';
        void element.offsetWidth;
        scene.classList.add('stage-ratio');
        element.classList.add('is-active', 'is-entering');
        element.setAttribute('aria-hidden', 'false');
        resetSceneViewport();
        global.requestAnimationFrame(resetSceneViewport);
        global.GameAudio?.start();
        entranceTimer = global.setTimeout(() => {
          entranceTimer = 0;
          element.classList.remove('is-entering');
          element.classList.add('is-ready');
        }, 760);
      },
      exit() {
        global.clearTimeout(entranceTimer);
        entranceTimer = 0;
        element.className = 'stage-nine screen';
        element.setAttribute('aria-hidden', 'true');
        scene.classList.remove('stage-ratio');
      }
    };
  }

  global.GameModules = global.GameModules || {};
  global.GameModules.createStageNine = createStageNine;
})(window);
