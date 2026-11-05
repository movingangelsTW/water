(function registerStageSixModule(global) {
  const ROOT = 'assets/stage6';
  const STEPS = [
    { id: 1, label: '說明會與簽署', photo: 'photo1_06_v2.png', position: 'upper-right' },
    { id: 2, label: '施工現場放樣', photo: 'photo2_06_v3.png', position: 'lower-left' },
    { id: 3, label: '改管佈設', photo: 'photo3_06_v3.png', position: 'lower-center-left' },
    { id: 4, label: '銜接與試水', photo: 'photo4_06_v2.png', position: 'lower-center-right' },
    { id: 5, label: '化糞池清理', photo: 'photo5_06_v2.png', position: 'lower-right' }
  ];

  function layer(file, className, alt = '') {
    const hidden = alt ? '' : ' aria-hidden="true"';
    return `<img class="s6-layer ${className}" src="${ROOT}/${file}" alt="${alt}"${hidden}>`;
  }

  function chromeMarkup() {
    return `
      <div class="s6-chrome" aria-hidden="true">
        <img class="s6-common-frame" src="assets/common/all_ui.png" alt="">
      </div>`;
  }

  function markup() {
    return `
      <div class="s6-view">
        ${layer('BG_06.png', 's6-background', '地上道路施工與地下污水管線工程場景')}
        ${chromeMarkup()}
        ${layer('ui1_06.png', 's6-title s6-title-main', '發現看不見的努力')}
        ${layer('ui1_06.png', 's6-title s6-title-subtitle', '來自地面下的汗水')}
        ${layer('ui2_06.png', 's6-stage-count', '階段 6/9')}
        ${layer('LittleWhite_06.png', 's6-littlewhite', '小白')}
        <span class="s6-dialogue-bubble" aria-hidden="true"></span>
        ${layer('talking_06.png', 's6-talking', '地下的工程雖然看不見，卻能讓生活越來越好。')}
        ${layer('ui3_06_v3.png', 's6-notice', '工程期間可能帶來不便，請大家多多包涵。施工時間為上午9點至下午4點；彈性調整時段為上午8點至下午8點。')}

        <div class="s6-npc-layer" aria-live="polite">
          ${STEPS.map(step => layer(`NPC${step.id}_06.png`, `s6-npc s6-npc-${step.id}`, `${step.label}完成`)).join('')}
        </div>

        <button class="s6-touch-target" type="button" aria-label="點擊查看說明會與簽署">
          <img src="${ROOT}/touch_6_v2.png" alt="點擊提示">
          <span>1.點擊查看</span>
        </button>

        <p class="s6-footer-caption">短暫的不便，是為了長久的便利與安全。</p>
        <button class="s6-back" type="button" aria-label="返回階段五"><img src="assets/common/previous_ui.png" alt="返回階段五"></button>
        <span id="s6-skip-hint" class="s6-visually-hidden">完成五個工程互動後可直接前往下一階段；若要略過本階段，請在短時間內連續按三下。</span>
        <span id="s6-skip-status" class="s6-visually-hidden" aria-live="polite"></span>
        <button class="s6-next" type="button" aria-label="完成五個工程互動後進入下一階段；或連續按三下略過本階段" aria-describedby="s6-skip-hint s6-skip-status" title="尚未完成時，快速連按三下可跳至階段 7"><img src="assets/common/next_ui.png" alt="下一階段"></button>
        <button class="s6-sound" type="button" aria-label="切換音效" aria-pressed="true"><img src="assets/common/sound_ui.png" alt="音效"></button>
        <div class="s6-photo-modal" aria-hidden="true">
          <div class="s6-photo-dialog" role="dialog" aria-modal="true" aria-labelledby="s6-photo-title">
            <h2 id="s6-photo-title"></h2>
            <button class="s6-photo-close" type="button" aria-label="關閉示意圖片">×</button>
            <button class="s6-photo-surface" type="button" aria-label="關閉示意圖片並繼續">
              <img src="" alt="">
            </button>
            <p>點擊圖片或關閉按鈕繼續，3 秒後也會自動關閉。</p>
          </div>
        </div>
      </div>`;
  }

  function createStageSix({ scene, element, onBack, onNext }) {
    element.innerHTML = markup();
    const touch = element.querySelector('.s6-touch-target');
    const next = element.querySelector('.s6-next');
    const modal = element.querySelector('.s6-photo-modal');
    const dialogTitle = element.querySelector('#s6-photo-title');
    const photo = element.querySelector('.s6-photo-surface img');
    const close = element.querySelector('.s6-photo-close');
    const sound = element.querySelector('.s6-sound');
    const skipStatus = element.querySelector('#s6-skip-status');
    let currentStep = 0;
    let modalTimer = 0;
    let modalStep = null;
    let skipClickCount = 0;
    let skipResetTimer = 0;

    const preloadFiles = [
      'BG_06.png', 'LittleWhite_06.png', 'talking_06.png', 'ui1_06.png', 'ui2_06.png', 'ui3_06_v3.png',
      'NPC1_06.png', 'NPC2_06.png', 'NPC3_06.png', 'NPC4_06.png', 'NPC5_06.png', 'touch_6_v2.png',
      ...STEPS.map(step => step.photo)
    ];
    const preloadMap = new Map(preloadFiles.map(file => {
      const image = new Image();
      const ready = new Promise(resolve => {
        image.addEventListener('load', resolve, { once: true });
        image.addEventListener('error', resolve, { once: true });
      });
      image.src = `${ROOT}/${file}`;
      return [file, { image, ready: image.complete ? Promise.resolve() : ready }];
    }));

    function resetSceneViewport() {
      scene.scrollLeft = 0;
      scene.scrollTop = 0;
    }

    function configureTouch() {
      const step = STEPS[currentStep];
      if (!step) {
        touch.hidden = true;
        next.classList.add('is-unlocked');
        next.setAttribute('aria-label', '進入下一階段');
        next.removeAttribute('aria-describedby');
        next.removeAttribute('title');
        resetSkipCounter();
        global.GameAudio?.playZoneComplete();
        return;
      }
      touch.hidden = false;
      touch.dataset.position = step.position;
      touch.setAttribute('aria-label', `${step.id}.點擊查看${step.label}`);
      touch.querySelector('span').textContent = `${step.id}.點擊查看`;
    }

    function resetSkipCounter(message = '') {
      global.clearTimeout(skipResetTimer);
      skipResetTimer = 0;
      skipClickCount = 0;
      skipStatus.textContent = message;
    }

    function handleNextClick() {
      if (next.classList.contains('is-unlocked')) {
        resetSkipCounter();
        onNext();
        return;
      }

      global.clearTimeout(skipResetTimer);
      skipClickCount += 1;
      next.classList.remove('is-skip-pressed');
      void next.offsetWidth;
      next.classList.add('is-skip-pressed');
      global.GameAudio?.playClick();

      if (skipClickCount >= 3) {
        resetSkipCounter('已略過本階段，正前往階段七。');
        onNext();
        return;
      }

      const remaining = 3 - skipClickCount;
      skipStatus.textContent = `再按 ${remaining} 下即可略過本階段。`;
      skipResetTimer = global.setTimeout(() => {
        resetSkipCounter('連按已逾時，請重新連按三下。');
      }, 1400);
    }

    function finishModal() {
      if (!modalStep) return;
      global.clearTimeout(modalTimer);
      modalTimer = 0;
      const completed = modalStep;
      modalStep = null;
      modal.classList.remove('is-visible');
      modal.setAttribute('aria-hidden', 'true');
      element.querySelector(`.s6-npc-${completed.id}`).classList.add('is-visible');
      currentStep = completed.id;
      configureTouch();
      if (!touch.hidden) touch.focus({ preventScroll: true });
    }

    async function openCurrentStep() {
      const step = STEPS[currentStep];
      if (!step || modalStep) return;
      modalStep = step;
      touch.hidden = true;
      global.GameAudio?.playClick();
      await preloadMap.get(step.photo).ready;
      if (modalStep !== step) return;
      dialogTitle.textContent = step.label;
      photo.src = `${ROOT}/${step.photo}`;
      photo.alt = `${step.label}示意圖片`;
      modal.classList.add('is-visible');
      modal.setAttribute('aria-hidden', 'false');
      close.focus({ preventScroll: true });
      modalTimer = global.setTimeout(finishModal, 3000);
    }

    function reset() {
      global.clearTimeout(modalTimer);
      modalTimer = 0;
      modalStep = null;
      currentStep = 0;
      modal.classList.remove('is-visible');
      modal.setAttribute('aria-hidden', 'true');
      photo.removeAttribute('src');
      element.querySelectorAll('.s6-npc').forEach(npc => npc.classList.remove('is-visible'));
      next.classList.remove('is-unlocked');
      next.classList.remove('is-skip-pressed');
      next.setAttribute('aria-label', '完成五個工程互動後進入下一階段；或連續按三下略過本階段');
      next.setAttribute('aria-describedby', 's6-skip-hint s6-skip-status');
      next.setAttribute('title', '尚未完成時，快速連按三下可跳至階段 7');
      resetSkipCounter();
      configureTouch();
    }

    touch.addEventListener('click', openCurrentStep);
    close.addEventListener('click', finishModal);
    element.querySelector('.s6-photo-surface').addEventListener('click', finishModal);
    element.querySelector('.s6-back').addEventListener('click', onBack);
    next.addEventListener('click', handleNextClick);
    global.GameAudio?.registerButton(sound);

    return {
      enter() {
        reset();
        scene.classList.add('stage-ratio');
        element.classList.add('is-active', 'is-entering');
        element.setAttribute('aria-hidden', 'false');
        resetSceneViewport();
        global.requestAnimationFrame(resetSceneViewport);
        global.GameAudio?.start();
        global.setTimeout(() => element.classList.remove('is-entering'), 650);
      },
      exit() {
        global.clearTimeout(modalTimer);
        global.clearTimeout(skipResetTimer);
        modalTimer = 0;
        skipResetTimer = 0;
        skipClickCount = 0;
        modalStep = null;
        element.className = 'stage-six screen';
        element.setAttribute('aria-hidden', 'true');
        modal.classList.remove('is-visible');
        modal.setAttribute('aria-hidden', 'true');
        scene.classList.remove('stage-ratio');
      }
    };
  }

  global.GameModules = global.GameModules || {};
  global.GameModules.createStageSix = createStageSix;
})(window);
