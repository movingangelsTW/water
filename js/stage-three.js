(function registerStageThreeModule(global) {
  const wait = ms => new Promise(resolve => global.setTimeout(resolve, ms));

  function createStageThree({ scene, element, onBack, onNext }) {
    const sound = element.querySelector('.stage-three-sound-button');
    let animationRun = 0;

    global.GameAudio?.registerButton(sound);

    element.querySelector('.stage-three-back-button').addEventListener('click', onBack);
    element.querySelector('.stage-three-next-button').addEventListener('click', onNext);

    return {
      async enter() {
        const runId = ++animationRun;
        scene.classList.add('stage-ratio');
        element.classList.add('is-active');
        element.setAttribute('aria-hidden', 'false');

        await wait(80);
        if (runId !== animationRun) return;

        // 1. BG + UI
        element.classList.add('show-bg-ui');
        await wait(900);
        if (runId !== animationRun) return;

        // 2. NPC｜阿澤
        element.classList.add('show-npc');
        await wait(760);
        if (runId !== animationRun) return;

        // 3. LittleWhite｜小白
        element.classList.add('show-littlewhite');
        await wait(760);
        if (runId !== animationRun) return;

        // 角色完成入場後開始自然擺動，再顯示兩組對話框。
        element.classList.add('characters-swaying', 'show-dialogues');
      },

      exit() {
        animationRun += 1;
        element.className = 'stage-three screen';
        element.setAttribute('aria-hidden', 'true');
        scene.classList.remove('stage-ratio');
      }
    };
  }

  global.GameModules = global.GameModules || {};
  global.GameModules.createStageThree = createStageThree;
})(window);
