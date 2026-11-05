(function registerStageEightModule(global) {
  const ROOT = 'assets/stage8';
  const QUESTION_MS = 3000;
  const FEEDBACK_MS = 700;
  const TOTAL_QUESTIONS = 10;

  const DESTINATIONS = {
    toilet: '馬桶',
    sink: '水槽',
    trash: '垃圾桶',
    drain: '水溝'
  };

  const ITEMS = [
    { name: '衛生紙', file: '衛生紙.png', answer: 'toilet', tip: '適量、可溶的衛生紙可以沖入馬桶。' },
    { name: '濕紙巾', file: '濕紙巾.png', answer: 'trash', tip: '濕紙巾不易分解，請丟垃圾桶。' },
    { name: '尿布', file: '尿布.png', answer: 'trash', tip: '尿布會吸水膨脹，請丟垃圾桶。' },
    { name: '油脂', file: '油脂.png', answer: 'trash', tip: '油脂冷卻後妥善回收或丟棄，不可倒入排水處。' },
    { name: '塑膠袋', file: '塑膠袋.png', answer: 'trash', tip: '塑膠袋不會分解，請丟垃圾桶。' },
    { name: '衛生棉', file: '衛生棉.png', answer: 'trash', tip: '衛生棉會造成堵塞，請丟垃圾桶。' },
    { name: '頭髮', file: '頭髮.png', answer: 'trash', tip: '頭髮容易纏結堵塞，請丟垃圾桶。' },
    { name: '廚餘', file: '廚餘.png', answer: 'trash', tip: '廚餘應優先回收；四個去向中請選垃圾桶。' }
  ];

  const LAYER_FILES = [
    'BG_08.png', 'ui1_08.png', 'ui2_08.png', 'ui3_08.png', 'ui4_08.png', 'ui5_08.png',
    'talking_08.png', 'button1_08.png', 'button2_08.png', 'button3_08.png', 'button4_08.png'
  ];

  function layer(file, className, alt = '') {
    const hidden = alt ? '' : ' aria-hidden="true"';
    return `<img class="s8-layer ${className}" src="${ROOT}/${file}" alt="${alt}"${hidden}>`;
  }

  function markup() {
    return `
      <div class="s8-view">
        ${layer('BG_08.png', 's8-background', '河川與城市背景')}
        ${layer('ui3_08.png', 's8-pipe-characters', '小白、阿澤與水管堵塞值量表')}
        ${layer('talking_08.png', 's8-talking', '點擊下方，把物品放到正確的位置，守住水管不堵塞。一起守護水管，讓城市更乾淨。')}
        ${layer('button1_08.png', 's8-choice-art s8-choice-art-toilet')}
        ${layer('button2_08.png', 's8-choice-art s8-choice-art-sink')}
        ${layer('button3_08.png', 's8-choice-art s8-choice-art-trash')}
        ${layer('button4_08.png', 's8-choice-art s8-choice-art-drain')}
        ${layer('ui4_08.png', 's8-question-panel')}
        ${layer('ui5_08.png', 's8-status-panel')}
        <img class="s8-layer s8-common-frame" src="assets/common/all_ui.png" alt="" aria-hidden="true">
        ${layer('ui1_08.png', 's8-title s8-title-main', '什麼可以丟馬桶？')}
        ${layer('ui1_08.png', 's8-title s8-title-subtitle', '接管後續維護宣導')}
        ${layer('ui2_08.png', 's8-stage-count', '階段 8/9')}

        <div class="s8-round" aria-hidden="true">第 <span class="s8-round-current">1</span>／${TOTAL_QUESTIONS} 題</div>
        <div class="s8-item-wrap">
          <img class="s8-item-image" src="" alt="">
        </div>
        <strong class="s8-item-name" aria-live="polite"></strong>
        <strong class="s8-time-value">3.0 秒</strong>
        <strong class="s8-score-value">0 分</strong>
        <span class="s8-clog-value" aria-label="目前堵塞值">25%</span>
        <span class="s8-clog-marker" aria-hidden="true"></span>

        <div class="s8-feedback" role="status" aria-live="assertive"></div>
        <div class="s8-live-status sr-only" role="status" aria-live="polite"></div>

        <div class="s8-choices" aria-label="物品去向選擇">
          <button class="s8-choice s8-choice-toilet" type="button" data-destination="toilet" aria-label="選擇馬桶"></button>
          <button class="s8-choice s8-choice-sink" type="button" data-destination="sink" aria-label="選擇水槽"></button>
          <button class="s8-choice s8-choice-trash" type="button" data-destination="trash" aria-label="選擇垃圾桶"></button>
          <button class="s8-choice s8-choice-drain" type="button" data-destination="drain" aria-label="選擇水溝"></button>
        </div>

        <div class="s8-intro" role="dialog" aria-modal="true" aria-labelledby="s8-intro-title" aria-describedby="s8-intro-copy" aria-hidden="true">
          <div class="s8-intro-card">
            <span class="s8-intro-kicker">遊戲關卡</span>
            <h2 id="s8-intro-title">守住水管不堵塞</h2>
            <p id="s8-intro-copy">看清楚畫面中的物品，在 3 秒內選擇它應該前往馬桶、水槽、垃圾桶或水溝。</p>
            <button class="s8-intro-start" type="button">開始遊戲</button>
          </div>
        </div>

        <p class="s8-footer-caption">一起正確處理生活物品，守護水管與乾淨河川。</p>
        <button class="s8-back" type="button" aria-label="返回階段七"><img src="assets/common/previous_ui.png" alt="返回階段七"></button>
        <span id="s8-skip-hint" class="sr-only">完成十題後可直接前往下一階段；若要略過本階段，請在短時間內連續按三下。</span>
        <span id="s8-skip-status" class="sr-only" aria-live="polite"></span>
        <button class="s8-next" type="button" aria-label="完成十題後進入下一階段；或連續按三下略過本階段" aria-describedby="s8-skip-hint s8-skip-status" data-locked="true" title="尚未完成時，快速連按三下可跳至階段 9"><img src="assets/common/next_ui.png" alt="下一階段"></button>
        <button class="s8-sound" type="button" aria-label="切換音效" aria-pressed="true"><img src="assets/common/sound_ui.png" alt="音效"></button>
      </div>`;
  }

  function shuffle(source) {
    const result = source.slice();
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
    }
    return result;
  }

  function buildDeck() {
    const repeats = [
      ITEMS.find(item => item.name === '衛生紙'),
      ITEMS.find(item => item.name === '濕紙巾')
    ];
    return shuffle(ITEMS.concat(repeats)).slice(0, TOTAL_QUESTIONS);
  }

  function createStageEight({ scene, element, onBack, onNext }) {
    element.innerHTML = markup();

    const itemImage = element.querySelector('.s8-item-image');
    const itemName = element.querySelector('.s8-item-name');
    const timeValue = element.querySelector('.s8-time-value');
    const scoreValue = element.querySelector('.s8-score-value');
    const clogValue = element.querySelector('.s8-clog-value');
    const roundCurrent = element.querySelector('.s8-round-current');
    const feedback = element.querySelector('.s8-feedback');
    const liveStatus = element.querySelector('.s8-live-status');
    const choiceButtons = Array.from(element.querySelectorAll('.s8-choice'));
    const nextButton = element.querySelector('.s8-next');
    const backButton = element.querySelector('.s8-back');
    const soundButton = element.querySelector('.s8-sound');
    const skipStatus = element.querySelector('#s8-skip-status');
    const intro = element.querySelector('.s8-intro');
    const introStartButton = element.querySelector('.s8-intro-start');

    let deck = [];
    let questionIndex = 0;
    let score = 0;
    let clog = 25;
    let correctCount = 0;
    let acceptingAnswer = false;
    let active = false;
    let deadline = 0;
    let entranceTimer = 0;
    let questionTimer = 0;
    let countdownTimer = 0;
    let feedbackTimer = 0;
    let skipClickCount = 0;
    let skipResetTimer = 0;

    LAYER_FILES.forEach(file => {
      const image = new Image();
      image.src = `${ROOT}/${file}`;
    });
    ITEMS.forEach(item => {
      const image = new Image();
      image.src = `${ROOT}/objects/${item.file}`;
    });

    function resetSceneViewport() {
      scene.scrollLeft = 0;
      scene.scrollTop = 0;
    }

    function clearQuestionTimers() {
      global.clearTimeout(questionTimer);
      global.clearInterval(countdownTimer);
      questionTimer = 0;
      countdownTimer = 0;
    }

    function clearAllTimers() {
      global.clearTimeout(entranceTimer);
      global.clearTimeout(feedbackTimer);
      entranceTimer = 0;
      feedbackTimer = 0;
      clearQuestionTimers();
      global.clearTimeout(skipResetTimer);
      skipResetTimer = 0;
    }

    function resetSkipCounter(message = '') {
      global.clearTimeout(skipResetTimer);
      skipResetTimer = 0;
      skipClickCount = 0;
      skipStatus.textContent = message;
    }

    function setChoicesEnabled(enabled) {
      choiceButtons.forEach(button => {
        button.disabled = !enabled;
        button.setAttribute('aria-disabled', String(!enabled));
      });
    }

    function showIntro() {
      intro.classList.add('is-visible');
      intro.setAttribute('aria-hidden', 'false');
      liveStatus.textContent = '本關為遊戲關卡。閱讀玩法後，按下開始遊戲才會開始計時。';
      introStartButton.focus({ preventScroll: true });
    }

    function hideIntro() {
      intro.classList.remove('is-visible');
      intro.setAttribute('aria-hidden', 'true');
    }

    function clearChoiceFeedback() {
      choiceButtons.forEach(button => button.classList.remove('is-correct', 'is-wrong'));
    }

    function setClog(value) {
      clog = Math.max(0, Math.min(100, value));
      clogValue.textContent = `${clog}%`;
      element.style.setProperty('--s8-clog', `${clog}%`);
      element.style.setProperty('--s8-clog-position', `${18.9 + clog * 0.63}%`);
    }

    function updateCountdown() {
      const remaining = Math.max(0, deadline - global.performance.now());
      timeValue.textContent = `${(remaining / 1000).toFixed(1)} 秒`;
    }

    function playResultSound(result) {
      const audio = global.GameAudio;
      if (!audio) return;
      if (result === 'correct') {
        (audio.playCorrectFeedback || audio.playZoneComplete)?.call(audio);
      } else if (result === 'timeout') {
        (audio.playTimeoutFeedback || audio.playClick)?.call(audio);
      } else {
        (audio.playIncorrectFeedback || audio.playClick)?.call(audio);
      }
    }

    function finishGame() {
      clearQuestionTimers();
      acceptingAnswer = false;
      setChoicesEnabled(false);
      clearChoiceFeedback();
      itemImage.removeAttribute('src');
      itemImage.alt = '';
      itemImage.classList.add('is-hidden');
      itemName.textContent = '任務完成';
      timeValue.textContent = '完成';
      scoreValue.textContent = `${score} 分`;
      feedback.className = 's8-feedback is-visible is-complete';
      feedback.textContent = correctCount >= 8
        ? `太棒了！答對 ${correctCount}／${TOTAL_QUESTIONS} 題，你是守護水管小高手！`
        : `任務完成！答對 ${correctCount}／${TOTAL_QUESTIONS} 題；記住：馬桶只沖適量衛生紙。`;
      liveStatus.textContent = `遊戲完成，答對 ${correctCount} 題，共 ${score} 分。下一階段按鈕已開放。`;
      nextButton.removeAttribute('data-locked');
      nextButton.setAttribute('aria-label', '進入下一階段');
      nextButton.removeAttribute('aria-describedby');
      nextButton.removeAttribute('title');
      element.classList.add('is-finished');
      resetSkipCounter();
      nextButton.focus({ preventScroll: true });
    }

    function showQuestion() {
      if (!active) return;
      if (questionIndex >= deck.length) {
        finishGame();
        return;
      }

      const item = deck[questionIndex];
      clearChoiceFeedback();
      feedback.className = 's8-feedback';
      feedback.textContent = '';
      itemImage.classList.remove('is-hidden');
      itemImage.src = `${ROOT}/objects/${item.file}`;
      itemImage.alt = item.name;
      itemName.textContent = item.name;
      roundCurrent.textContent = String(questionIndex + 1);
      scoreValue.textContent = `${score} 分`;
      timeValue.textContent = '3.0 秒';
      liveStatus.textContent = `第 ${questionIndex + 1} 題，共 ${TOTAL_QUESTIONS} 題。物品是${item.name}，請在三秒內選擇去向。`;
      acceptingAnswer = true;
      setChoicesEnabled(true);
      deadline = global.performance.now() + QUESTION_MS;
      clearQuestionTimers();
      countdownTimer = global.setInterval(updateCountdown, 80);
      questionTimer = global.setTimeout(() => resolveAnswer(null), QUESTION_MS);
    }

    function resolveAnswer(destination) {
      if (!active || !acceptingAnswer) return;
      acceptingAnswer = false;
      clearQuestionTimers();
      setChoicesEnabled(false);

      const item = deck[questionIndex];
      const correctDestination = DESTINATIONS[item.answer];
      const correctButton = element.querySelector(`[data-destination="${item.answer}"]`);
      const selectedButton = destination ? element.querySelector(`[data-destination="${destination}"]`) : null;
      const result = destination === item.answer ? 'correct' : destination ? 'wrong' : 'timeout';

      correctButton?.classList.add('is-correct');
      if (selectedButton && selectedButton !== correctButton) selectedButton.classList.add('is-wrong');

      if (result === 'correct') {
        score += 10;
        correctCount += 1;
        setClog(clog - 6);
        feedback.textContent = `答對了！${item.tip}`;
      } else if (result === 'timeout') {
        setClog(clog + 12);
        feedback.textContent = `時間到！「${item.name}」應該去${correctDestination}。`;
      } else {
        setClog(clog + 12);
        feedback.textContent = `再想想！「${item.name}」應該去${correctDestination}。`;
      }

      scoreValue.textContent = `${score} 分`;
      timeValue.textContent = result === 'timeout' ? '0.0 秒' : '已作答';
      feedback.className = `s8-feedback is-visible is-${result}`;
      liveStatus.textContent = `${feedback.textContent} 目前 ${score} 分，堵塞值 ${clog}%。`;
      playResultSound(result);

      feedbackTimer = global.setTimeout(() => {
        feedbackTimer = 0;
        questionIndex += 1;
        showQuestion();
      }, FEEDBACK_MS);
    }

    function startGame() {
      clearAllTimers();
      hideIntro();
      deck = buildDeck();
      questionIndex = 0;
      score = 0;
      correctCount = 0;
      acceptingAnswer = false;
      active = true;
      element.classList.remove('is-finished');
      itemImage.classList.remove('is-hidden');
      nextButton.dataset.locked = 'true';
      nextButton.setAttribute('aria-label', '完成十題後進入下一階段；或連續按三下略過本階段');
      nextButton.setAttribute('aria-describedby', 's8-skip-hint s8-skip-status');
      nextButton.setAttribute('title', '尚未完成時，快速連按三下可跳至階段 9');
      resetSkipCounter();
      scoreValue.textContent = '0 分';
      setClog(25);
      showQuestion();
    }

    choiceButtons.forEach(button => {
      button.addEventListener('click', () => resolveAnswer(button.dataset.destination));
    });

    introStartButton.addEventListener('click', () => {
      if (!element.classList.contains('is-active')) return;
      global.GameAudio?.playClick();
      startGame();
    });

    backButton.addEventListener('click', () => {
      clearAllTimers();
      active = false;
      onBack();
    });

    nextButton.addEventListener('click', () => {
      if (element.classList.contains('is-finished')) {
        clearAllTimers();
        active = false;
        onNext();
        return;
      }

      global.clearTimeout(skipResetTimer);
      skipClickCount += 1;
      nextButton.classList.remove('is-skip-pressed');
      void nextButton.offsetWidth;
      nextButton.classList.add('is-skip-pressed');
      global.GameAudio?.playClick();

      if (skipClickCount >= 3) {
        resetSkipCounter('已略過本階段，正前往階段九。');
        clearAllTimers();
        active = false;
        onNext();
        return;
      }

      const remaining = 3 - skipClickCount;
      skipStatus.textContent = `再按 ${remaining} 下即可略過本階段。`;
      skipResetTimer = global.setTimeout(() => {
        resetSkipCounter('連按已逾時，請重新連按三下。');
      }, 1400);
    });

    global.GameAudio?.registerButton(soundButton);

    return {
      enter() {
        clearAllTimers();
        active = true;
        acceptingAnswer = false;
        setChoicesEnabled(false);
        nextButton.dataset.locked = 'true';
        nextButton.setAttribute('aria-label', '完成十題後進入下一階段；或連續按三下略過本階段');
        nextButton.setAttribute('aria-describedby', 's8-skip-hint s8-skip-status');
        nextButton.setAttribute('title', '尚未完成時，快速連按三下可跳至階段 9');
        resetSkipCounter();
        hideIntro();
        element.className = 'stage-eight screen';
        void element.offsetWidth;
        scene.classList.add('stage-ratio');
        element.classList.add('is-active', 'is-entering');
        element.setAttribute('aria-hidden', 'false');
        resetSceneViewport();
        global.requestAnimationFrame(resetSceneViewport);
        global.GameAudio?.start();
        element.classList.remove('is-finished');
        clearChoiceFeedback();
        feedback.className = 's8-feedback';
        feedback.textContent = '';
        itemImage.removeAttribute('src');
        itemImage.alt = '';
        itemImage.classList.add('is-hidden');
        itemName.textContent = '準備開始';
        timeValue.textContent = '3.0 秒';
        scoreValue.textContent = '0 分';
        roundCurrent.textContent = '1';
        setClog(25);
        entranceTimer = global.setTimeout(() => {
          entranceTimer = 0;
          element.classList.remove('is-entering');
          element.classList.add('is-ready');
          showIntro();
        }, 650);
      },
      exit() {
        active = false;
        clearAllTimers();
        hideIntro();
        resetSkipCounter();
        setChoicesEnabled(false);
        element.className = 'stage-eight screen';
        element.setAttribute('aria-hidden', 'true');
        scene.classList.remove('stage-ratio');
      }
    };
  }

  global.GameModules = global.GameModules || {};
  global.GameModules.createStageEight = createStageEight;
})(window);
