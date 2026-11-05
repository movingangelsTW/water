(function registerStageSevenModule(global) {
  const ROOT = 'assets/stage7';
  const FILES = ['BG_07.png', 'people_07_v4.png', 'photo_07.png', 'ui1_07_v4.png', 'ui2_07.png', 'ui3_07_v3.png'];

  function layer(file, className, alt = '') {
    const hidden = alt ? '' : ' aria-hidden="true"';
    return `<img class="s7-layer ${className}" src="${ROOT}/${file}" alt="${alt}"${hidden}>`;
  }

  function chromeMarkup() {
    return `
      <div class="s7-chrome" aria-hidden="true">
        <img class="s7-common-frame" src="assets/common/all_ui.png" alt="">
      </div>`;
  }

  function markup() {
    return `
      <div class="s7-view">
        ${layer('BG_07.png', 's7-background', '淺藍色背景')}
        ${layer('people_07_v4.png', 's7-people s7-sequence-layer s7-sequence-1', '撥打通報電話的民眾')}
        ${layer('photo_07.png', 's7-photo s7-sequence-layer s7-sequence-2', '人孔堵塞情形')}
        ${chromeMarkup()}
        <h1 class="s7-text-title">人孔冒水怎麼辦</h1>
        ${layer('ui1_07_v4.png', 's7-title s7-title-subtitle', '提供24小時通報服務')}
        ${layer('ui2_07.png', 's7-stage-count', '階段 7/9')}
        ${layer('ui3_07_v3.png', 's7-hotline-card s7-sequence-layer s7-sequence-3', '人孔堵塞可撥打24小時通報電話：0800-812-100')}

        <p class="s7-hotline-copy">人孔堵塞不用擔心，<br>立即撥打專線，<br>我們隨時為您服務！</p><p class="s7-footer-caption">本單位有24小時通報電話，如遇人孔堵塞問題可即時通報求助。</p>
        <button class="s7-back" type="button" aria-label="返回階段六"><img src="assets/common/previous_ui.png" alt="返回階段六"></button>
        <button class="s7-next" type="button" aria-label="進入下一階段"><img src="assets/common/next_ui.png" alt="下一階段"></button>
        <button class="s7-sound" type="button" aria-label="切換音效" aria-pressed="true"><img src="assets/common/sound_ui.png" alt="音效"></button>
      </div>`;
  }

  function createStageSeven({ scene, element, onBack, onNext }) {
    element.innerHTML = markup();
    const sound = element.querySelector('.s7-sound');
    let entranceTimer = 0;

    FILES.forEach(file => {
      const image = new Image();
      image.src = `${ROOT}/${file}`;
    });

    function resetSceneViewport() {
      scene.scrollLeft = 0;
      scene.scrollTop = 0;
    }

    element.querySelector('.s7-back').addEventListener('click', onBack);
    element.querySelector('.s7-next').addEventListener('click', onNext);
    global.GameAudio?.registerButton(sound);

    return {
      enter() {
        global.clearTimeout(entranceTimer);
        element.className = 'stage-seven screen';
        void element.offsetWidth;
        scene.classList.add('stage-ratio');
        element.classList.add('is-active', 'is-entering');
        element.setAttribute('aria-hidden', 'false');
        resetSceneViewport();
        global.requestAnimationFrame(resetSceneViewport);
        global.GameAudio?.start();
        entranceTimer = global.setTimeout(() => {
          element.classList.add('is-ready');
          element.classList.remove('is-entering');
        }, 950);
      },
      exit() {
        global.clearTimeout(entranceTimer);
        entranceTimer = 0;
        element.className = 'stage-seven screen';
        element.setAttribute('aria-hidden', 'true');
        scene.classList.remove('stage-ratio');
      }
    };
  }

  global.GameModules = global.GameModules || {};
  global.GameModules.createStageSeven = createStageSeven;
})(window);
