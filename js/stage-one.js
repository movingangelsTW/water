(function registerStageOneModule(global){
  const wait = ms => new Promise(resolve => global.setTimeout(resolve, ms));

  function createStageOne({scene,element,onBack,onNext}){
    const sound = element.querySelector('.sound-button');
    const caption = element.querySelector('#stageCaption');
    let animationRun = 0;

    async function typeCaption(runId) {
      const fullText = caption.dataset.text;
      caption.textContent = '';
      caption.classList.remove('is-finished');

      for (const character of fullText) {
        if (runId !== animationRun) return;
        caption.textContent += character;
        await wait(55);
      }

      caption.classList.add('is-finished');
    }

    global.GameAudio?.registerButton(sound);

    element.querySelector('.back-button').addEventListener('click',onBack);
    element.querySelector('.next-button').addEventListener('click',onNext);

    return {
      async enter() {
        const runId = ++animationRun;

        scene.classList.add('stage-ratio');
        element.classList.add('is-active');
        element.setAttribute('aria-hidden', 'false');

        await wait(80);
        if (runId !== animationRun) return;
        element.classList.add('show-bg');

        await wait(950);
        if (runId !== animationRun) return;
        element.classList.add('show-npc');

        await wait(900);
        if (runId !== animationRun) return;
        element.classList.add('show-bird');

        await wait(900);
        if (runId !== animationRun) return;
        element.classList.add('show-dialogue');
        element.classList.add('characters-swaying');
        typeCaption(runId);
      },

      exit() {
        animationRun += 1;
        caption.textContent = '';
        caption.classList.remove('is-finished');
        element.className = 'stage-one screen';
        element.setAttribute('aria-hidden', 'true');
        scene.classList.remove('stage-ratio');
      }
    };
  }

  global.GameModules = global.GameModules || {};
  global.GameModules.createStageOne = createStageOne;
})(window);
