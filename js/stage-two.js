(function registerStageTwoModule(global) {
  const wait = ms => new Promise(resolve => global.setTimeout(resolve, ms));

  function createStageTwo({ scene, element, onBack, onNext }) {
    const sound = element.querySelector('.stage-two-sound-button');
    const caption = element.querySelector('#stageTwoCaption');
    const hotspots = [...element.querySelectorAll('.stage-two-hotspot')];
    const infos = [...element.querySelectorAll('.stage-two-info')];
    let animationRun = 0;

    async function typeCaption(runId) {
      caption.textContent = '';
      caption.classList.remove('is-finished');
      for (const character of caption.dataset.text) {
        if (runId !== animationRun) return;
        caption.textContent += character;
        await wait(55);
      }
      caption.classList.add('is-finished');
    }

    hotspots.forEach(hotspot => {
      hotspot.addEventListener('click', () => {
        global.GameAudio?.playClick();
        const target = hotspot.dataset.target;
        element.querySelector(`[data-info="${target}"]`)?.classList.add('is-visible');
        hotspot.classList.add('is-open');
        hotspot.setAttribute('aria-pressed', 'true');
      });
    });

    global.GameAudio?.registerButton(sound);
    element.querySelector('.stage-two-back-button').addEventListener('click', onBack);
    element.querySelector('.stage-two-next-button').addEventListener('click', onNext);

    return {
      async enter() {
        const runId = ++animationRun;
        scene.classList.add('stage-ratio');
        element.classList.add('is-active');
        element.setAttribute('aria-hidden', 'false');
        await wait(80);
        if (runId !== animationRun) return;
        element.classList.add('show-bg');
        await wait(900);
        if (runId !== animationRun) return;
        element.classList.add('show-content', 'characters-swaying');
        typeCaption(runId);
      },
      exit() {
        animationRun += 1;
        caption.textContent = '';
        caption.classList.remove('is-finished');
        infos.forEach(info => info.classList.remove('is-visible'));
        hotspots.forEach(hotspot => {
          hotspot.classList.remove('is-open');
          hotspot.setAttribute('aria-pressed', 'false');
        });
        element.className = 'stage-two screen';
        element.setAttribute('aria-hidden', 'true');
        scene.classList.remove('stage-ratio');
      }
    };
  }

  global.GameModules = global.GameModules || {};
  global.GameModules.createStageTwo = createStageTwo;
})(window);
