(function registerStageFourModule(global) {
  const wait = ms => new Promise(resolve => global.setTimeout(resolve, ms));
  const TOTAL_TIME = 180;
  const WORK_REQUIRED = 15;
  const ZONE_UNLOCKS = [0, 15, 30, 45];
  const NARRATION_INTERVAL = 6;

  const ROLE_DATA = {
    traffic: { label: '交通義工', short: '義工', icon: 'NPC1icon_04.png', sprite: 'NPC1_04.png', className: 's4-person-traffic' },
    worker: { label: '接管工人', short: '接管', icon: 'NPC2icon_04.png', sprite: 'NPC2_04.png', className: 's4-person-worker' },
    eco: { label: '民眾', short: '民眾', icon: 'NPC3icon_04_v2.png', sprite: 'NPC3_3_04_v2.png', className: 's4-person-eco' }
  };

  const ROLE_NARRATIONS = {
    traffic: [
      '🚦 幫忙顧路口，讓大家安全通過！',
      '🚗 車子慢行，前方路口我來指揮！',
      '🛣️ 施工別擔心，交通有人顧！',
      '👷 路口有點忙，來幫大家疏導！',
      '⚠️ 前方施工，記得減速慢行！'
    ],
    worker: [
      '🔧 地下管線交給接管工人處理！',
      '🚰 管線有問題，趕快來檢查看看！',
      '🛠️ 把水管接好，工程繼續前進！',
      '👷 在你家巷子施工中，管路快修好了！',
      '💧 水管檢修完成，用水更順暢！'
    ],
    eco: [
      '♻️ 工程要做，環境也要顧！',
      '🌱 一起了解下水道工程！',
      '🧹 施工不髒亂，環境更舒服！',
      '🌿 支持工程，期待更好的生活環境！',
      '💚 大家共同參與，一起愛環境！'
    ]
  };

  const ZONE_DATA = [
    { title: '第一區', subtitle: '高速鐵路桃園車站\n特定區計畫' },
    { title: '第二區', subtitle: '中壢及內壢交流道附近\n特定區計畫' },
    { title: '第三區', subtitle: '中壢鎮都市\n擴大修定計畫' },
    { title: '第四區', subtitle: '中壢（龍岡地區）\n都市計畫' }
  ];

  function characterSprite(asset, className, alt = '') {
    return `<span class="s4-character-crop ${className}" role="img" aria-label="${alt}"><img src="assets/stage4-new/${asset}" alt=""></span>`;
  }

  function createMarkup() {
    const zones = ZONE_DATA.map((zone, index) => `
      <article class="s4-zone s4-zone-${index + 1}" data-zone="${index}" data-unlocked="${index === 0}" tabindex="0" role="button" aria-label="${zone.title}${index ? `，${ZONE_UNLOCKS[index]} 秒後解鎖` : '，已解鎖'}">
        <span class="s4-zone-lock"><b>${zone.title}</b><span>🔒 ${ZONE_UNLOCKS[index]} 秒後解鎖</span></span>
        <span class="s4-zone-progress">
          <span class="s4-progress-line"><small>義交</small><i><b data-progress="traffic"></b></i><em data-seconds="traffic">0/15</em></span>
          <span class="s4-progress-line"><small>接管</small><i><b data-progress="worker"></b></i><em data-seconds="worker">0/15</em></span>
        </span>
        <span class="s4-zone-tokens" aria-label="已配置人員"></span>
        <span class="s4-zone-complete">工程完成！</span>
      </article>
    `).join('');

    return `
      <div class="s4-background"></div>
      <img class="s4-common-frame" src="assets/common/all_ui.png" alt="" aria-hidden="true">
      <img class="s4-stage-art" src="assets/stage4-new/Ui5_04.png" alt="階段 4/9">

      <div class="s4-new-art" aria-hidden="true">
        <img src="assets/stage4-new/BG2_04.png" alt="">
        <img src="assets/stage4-new/BG3_04_v2.png" alt="">
        <img src="assets/stage4-new/Ui1_04.png" alt="">
        <img class="s4-staff-art s4-staff-art-eco" src="assets/stage4-new/Ui1_1_04_v2.png" alt="">
        <img class="s4-staff-art s4-staff-art-worker" src="assets/stage4-new/Ui1_2_04.png" alt="">
        <img class="s4-staff-art s4-staff-art-traffic" src="assets/stage4-new/Ui1_3_04.png" alt="">
        <img class="s4-art-time" src="assets/stage4-new/Ui2_04.png" alt="">
        <img class="s4-art-objective" src="assets/stage4-new/Ui3_04_v2.png" alt="">
        <img class="s4-art-progress" src="assets/stage4-new/Ui4_04.png" alt="">
      </div>

      <div class="s4-ui-layer">
        <span class="s4-stage-count" role="img" aria-label="階段 4/9">
          <svg class="s4-stage-drop" viewBox="0 0 100 120" aria-hidden="true">
            <path class="s4-stage-drop-shadow" d="M50 5C44 25 14 49 14 77a36 36 0 0 0 72 0C86 49 56 25 50 5Z"></path>
            <path class="s4-stage-drop-body" d="M50 10C45 28 20 51 20 77a30 30 0 0 0 60 0C80 51 55 28 50 10Z"></path>
            <path class="s4-stage-drop-glint" d="M35 53c-8 10-10 20-7 29"></path>
          </svg>
          <strong>階段 4/9</strong>
        </span>
        <span class="s4-stage-title" role="img" aria-label="大家共同參與！共同參與下水道工程"><strong>大家共同參與！</strong><small>共同參與下水道工程</small></span>
        <button class="s4-icon-button s4-sound-button" type="button" aria-label="切換音效" aria-pressed="true"><img src="assets/common/sound_ui.png" alt="音效"></button>
        <button class="s4-icon-button s4-settings-button" type="button" aria-label="開啟遊戲設定"><span aria-hidden="true">⚙</span></button>
        <button class="s4-back-button" type="button" aria-label="返回階段三"><img src="assets/common/previous_ui.png" alt="返回"></button>
      </div>

      <aside class="s4-staff-panel" aria-label="工作人員區">
        <div class="s4-energy-card">
          <span>💧 水滴能量</span>
          <i><b data-energy-bar></b></i>
          <strong data-time>03:00</strong>
        </div>
        <h2>拖曳人員到地圖上！</h2>
        <button class="s4-staff-source" type="button" data-role="traffic" aria-pressed="false">
          <span class="s4-staff-copy"><b>交通義工</b><small>指揮交通，保持道路順暢！</small><em data-role-count="traffic">可用 1／1</em></span>
        </button>
        <button class="s4-staff-source" type="button" data-role="worker" aria-pressed="false">
          <span class="s4-staff-copy"><b>接管工人</b><small>檢修管線，解決排水問題！</small><em data-role-count="worker">可用 1／1</em></span>
        </button>
        <button class="s4-staff-source" type="button" data-role="eco" aria-pressed="false">
          <span class="s4-staff-copy"><b>民眾</b><small>共同參與，支持工程！</small><em data-role-count="eco">可用 1／1</em></span>
        </button>
      </aside>

      <section class="s4-objective" aria-label="任務目標">
        <div><b>目標：</b>交通義工與接管工人各工作滿 15 秒；民眾共同參與、支持工程。</div>
        <div class="s4-unlock-road" aria-label="工程區解鎖進度">
          ${ZONE_DATA.map((zone, index) => `<span data-road="${index}" class="${index === 0 ? 'is-open' : ''}"><i>${index === 0 ? '⚓' : '🔒'}</i><small>${index + 1}區</small></span>`).join('')}
        </div>
      </section>

      <section class="s4-map-board" aria-label="四個施工區域">${zones}</section>

      <div class="s4-cloud-layer" aria-hidden="true">
        ${ZONE_DATA.map((zone, index) => `<span class="s4-global-cloud s4-global-cloud-${index + 1}" data-cloud-zone="${index}"><span class="s4-cloud-sprite"><img src="assets/stage4-new/ChatGPT Image 2026年8月28日 下午04_23_03.png" alt=""></span></span>`).join('')}
      </div>

      <div class="s4-littlewhite" aria-hidden="true"></div>
      <div class="s4-dialogue" aria-live="polite"><p data-guide>小心烏雲！它會拖累工程進度！合理安排人員，讓每個地區都變乾淨吧！</p></div>

      <button class="s4-pause-button" type="button" aria-label="略過階段四並前往階段五"><img src="assets/common/next_ui.png" alt="下一階段"></button>
      <button class="s4-next-button" type="button" aria-label="進入下一階段"><img src="assets/common/next_ui.png" alt="下一階段"></button>

      <div class="s4-intro" role="dialog" aria-modal="true" aria-labelledby="s4-intro-title" aria-describedby="s4-intro-copy" aria-hidden="true">
        <div class="s4-intro-card">
          <span class="s4-intro-kicker">本關為遊戲關卡</span>
          <h2 id="s4-intro-title">分工完成四區工程</h2>
          <p id="s4-intro-copy">安排交通義工與接管工人到已解鎖區域，各工作滿 15 秒即可完成工程。邀請民眾共同參與、支持工程；民眾不需執行施工工作。</p>
          <button class="s4-intro-start" type="button">開始遊戲</button>
        </div>
      </div>

      <div class="s4-settings-panel" aria-hidden="true">
        <div>
          <h2>遊戲說明</h2>
          <p>拖曳或點選工作人員，再放到已解鎖的施工區。義交與接管工人都完成 15 秒工作即可完成該區；民眾參與支持，不執行施工工作，烏雲則會減速。</p>
          <button type="button" data-action="resume">繼續遊戲</button>
          <button type="button" data-action="restart">重新開始</button>
        </div>
      </div>

      <div class="s4-result-panel" aria-hidden="true" aria-live="assertive">
        <div>
          <h2 data-result-title>工程完成！</h2>
          <p data-result-copy>大家共同參與，中壢變得更乾淨了！</p>
          <button type="button" data-result-action="restart">重新挑戰</button>
          <button type="button" data-result-action="next">下一階段</button>
        </div>
      </div>
    `;
  }

  function createStageFour({ scene, element, onBack, onNext }) {
    element.innerHTML = createMarkup();

    const sources = [...element.querySelectorAll('.s4-staff-source')];
    const zoneElements = [...element.querySelectorAll('.s4-zone')];
    const globalCloudElements = [...element.querySelectorAll('.s4-global-cloud')];
    const timeOutput = element.querySelector('[data-time]');
    const energyBar = element.querySelector('[data-energy-bar]');
    const guide = element.querySelector('[data-guide]');
    const pauseButton = element.querySelector('.s4-pause-button');
    const settingsPanel = element.querySelector('.s4-settings-panel');
    const resultPanel = element.querySelector('.s4-result-panel');
    const soundButton = element.querySelector('.s4-sound-button');
    const nextButton = element.querySelector('.s4-next-button');
    const intro = element.querySelector('.s4-intro');
    const introStartButton = element.querySelector('.s4-intro-start');

    let animationRun = 0;
    let frameId = 0;
    let isActive = false;
    let isPlaying = false;
    let isPaused = false;
    let settingsPausedGame = false;
    let elapsed = 0;
    let lastTimestamp = 0;
    let nextCloudAt = 14;
    let selectedRole = null;
    let renderAccumulator = 0;
    let suppressSourceClick = false;
    let nextNarrationAt = 0;
    let lastNarration = '';

    let rolePools;
    let zoneStates;

    const randomCloudDelay = () => 12 + Math.random() * 6;
    const formatTime = seconds => {
      const safe = Math.max(0, Math.ceil(seconds));
      return `${String(Math.floor(safe / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`;
    };

    function showIntro() {
      intro.classList.add('is-visible');
      intro.setAttribute('aria-hidden', 'false');
      introStartButton.focus({ preventScroll: true });
    }

    function hideIntro() {
      intro.classList.remove('is-visible');
      intro.setAttribute('aria-hidden', 'true');
    }

    function resetState() {
      global.cancelAnimationFrame(frameId);
      isPlaying = false;
      isPaused = false;
      settingsPausedGame = false;
      elapsed = 0;
      lastTimestamp = 0;
      nextCloudAt = randomCloudDelay();
      selectedRole = null;
      renderAccumulator = 0;
      nextNarrationAt = NARRATION_INTERVAL;
      lastNarration = '';
      rolePools = {
        traffic: [{ id: 'traffic-1', zone: null }],
        worker: [{ id: 'worker-1', zone: null }],
        eco: [{ id: 'eco-1', zone: null }]
      };
      zoneStates = ZONE_DATA.map((_, index) => ({
        unlocked: index === 0,
        complete: false,
        traffic: 0,
        worker: 0,
        cloudUntil: 0
      }));

      sources.forEach(source => source.setAttribute('aria-pressed', 'false'));
      settingsPanel.classList.remove('is-visible');
      settingsPanel.setAttribute('aria-hidden', 'true');
      resultPanel.classList.remove('is-visible');
      resultPanel.setAttribute('aria-hidden', 'true');
      hideIntro();
      nextButton.classList.remove('is-visible');
      guide.textContent = '小心烏雲！它會拖累工程進度！合理安排人員，讓每個地區都變乾淨吧！';
      render(false);
    }

    function totalForRole(role) {
      if (role === 'traffic' || role === 'worker') return zoneStates[0].complete ? 2 : 1;
      return zoneStates[1].complete ? 2 : 1;
    }

    function syncRolePools() {
      Object.keys(rolePools).forEach(role => {
        const target = totalForRole(role);
        while (rolePools[role].length < target) {
          rolePools[role].push({ id: `${role}-${rolePools[role].length + 1}`, zone: null });
        }
      });
    }

    function roleAssignedToZone(role, zoneIndex) {
      return rolePools[role].some(person => person.zone === zoneIndex);
    }

    function releaseZoneStaff(zoneIndex) {
      Object.values(rolePools).flat().forEach(person => {
        if (person.zone === zoneIndex) person.zone = null;
      });
    }

    function completeZone(index) {
      const state = zoneStates[index];
      if (state.complete) return;
      state.complete = true;
      state.cloudUntil = 0;
      global.GameAudio?.playZoneComplete();
      releaseZoneStaff(index);
      syncRolePools();
      guide.textContent = `${ZONE_DATA[index].title}工程完成！工作人員已回到待命區。`;
      nextNarrationAt = elapsed + NARRATION_INTERVAL;

      if (zoneStates.every(zone => zone.complete)) finishGame(true);
    }

    function assignRole(role, zoneIndex) {
      const zone = zoneStates[zoneIndex];
      if (!isPlaying || isPaused || !zone?.unlocked || zone.complete) {
        guide.textContent = zone?.complete ? '這一區已經完成，請把人員安排到其他施工區！' : '這個施工區還沒解鎖！';
        return;
      }
      if (roleAssignedToZone(role, zoneIndex)) {
        guide.textContent = `${ROLE_DATA[role].label}已經在${ZONE_DATA[zoneIndex].title}參與了！`;
        return;
      }

      const person = rolePools[role].find(item => item.zone === null) || rolePools[role][0];
      person.zone = zoneIndex;
      global.GameAudio?.playPersonnelDrop();
      selectedRole = null;
      sources.forEach(source => source.setAttribute('aria-pressed', 'false'));
      guide.textContent = `${ROLE_DATA[role].label}已前往${ZONE_DATA[zoneIndex].title}！`;
      nextNarrationAt = elapsed + NARRATION_INTERVAL;
      render(false);
    }

    function selectRole(role) {
      if (!isPlaying || isPaused) return;
      selectedRole = selectedRole === role ? null : role;
      sources.forEach(source => source.setAttribute('aria-pressed', String(source.dataset.role === selectedRole)));
      guide.textContent = selectedRole
        ? `已選擇${ROLE_DATA[selectedRole].label}，請點選或拖曳到已解鎖的施工區。`
        : '請選擇工作人員，再安排到施工區。';
    }

    function updateUnlocks() {
      zoneStates.forEach((zone, index) => {
        if (!zone.unlocked && elapsed >= ZONE_UNLOCKS[index]) {
          zone.unlocked = true;
          guide.textContent = `${ZONE_DATA[index].title}已解鎖，可以開始安排人員！`;
          nextNarrationAt = elapsed + NARRATION_INTERVAL;
        }
      });
    }

    function updateClouds() {
      if (elapsed < nextCloudAt) return;
      const activeClouds = zoneStates.filter(zone => zone.cloudUntil > elapsed).length;
      const maximum = elapsed < 60 ? 1 : 2;
      const candidates = zoneStates
        .map((zone, index) => ({ zone, index }))
        .filter(item => item.zone.unlocked && !item.zone.complete && item.zone.cloudUntil <= elapsed);

      if (activeClouds < maximum && candidates.length) {
        const target = candidates[Math.floor(Math.random() * candidates.length)];
        target.zone.cloudUntil = elapsed + 14;
        global.GameAudio?.playThunder();
        guide.textContent = `烏雲正在影響${ZONE_DATA[target.index].title}，工程速度下降了！`;
        nextNarrationAt = elapsed + NARRATION_INTERVAL;
      }
      nextCloudAt = elapsed + randomCloudDelay();
    }

    function updateWork(deltaSeconds) {
      zoneStates.forEach((zone, index) => {
        if (!zone.unlocked || zone.complete) return;
        const cloudMultiplier = zone.cloudUntil > elapsed ? 0.55 : 1;
        const ecoMultiplier = 1;
        const speed = cloudMultiplier * ecoMultiplier;
        if (roleAssignedToZone('traffic', index)) zone.traffic = Math.min(WORK_REQUIRED, zone.traffic + deltaSeconds * speed);
        if (roleAssignedToZone('worker', index)) zone.worker = Math.min(WORK_REQUIRED, zone.worker + deltaSeconds * speed);
        if (zone.traffic >= WORK_REQUIRED && zone.worker >= WORK_REQUIRED) completeZone(index);
      });
    }

    function updateNarration() {
      if (selectedRole || elapsed < nextNarrationAt) return;

      const assignedRoles = Object.keys(rolePools).filter(role =>
        rolePools[role].some(person => person.zone !== null)
      );
      if (!assignedRoles.length) {
        nextNarrationAt = elapsed + NARRATION_INTERVAL;
        return;
      }

      const role = assignedRoles[Math.floor(Math.random() * assignedRoles.length)];
      const choices = ROLE_NARRATIONS[role].filter(line => line !== lastNarration);
      const narration = choices[Math.floor(Math.random() * choices.length)];
      guide.textContent = narration;
      lastNarration = narration;
      nextNarrationAt = elapsed + NARRATION_INTERVAL;
    }

    function spawnGuideStatus() {
      if (selectedRole) return;
      const cloudIndex = zoneStates.findIndex(zone => zone.cloudUntil > elapsed);
      if (cloudIndex >= 0) {
        guide.textContent = `烏雲正在影響${ZONE_DATA[cloudIndex].title}；可先調度工作人員至其他區域。`;
        return;
      }
      const nextLocked = zoneStates.findIndex(zone => !zone.unlocked);
      if (nextLocked >= 0) {
        guide.textContent = `距離${ZONE_DATA[nextLocked].title}解鎖還有 ${Math.max(0, Math.ceil(ZONE_UNLOCKS[nextLocked] - elapsed))} 秒。`;
      } else {
        guide.textContent = '四個施工區都已開放，請合理安排人員完成工程！';
      }
    }

    function render(force = false) {
      timeOutput.textContent = formatTime(TOTAL_TIME - elapsed);
      energyBar.style.width = `${Math.max(0, (TOTAL_TIME - elapsed) / TOTAL_TIME * 100)}%`;

      Object.keys(rolePools).forEach(role => {
        const available = rolePools[role].filter(person => person.zone === null).length;
        const total = rolePools[role].length;
        element.querySelector(`[data-role-count="${role}"]`).textContent = `可用 ${available}／${total}`;
      });

      zoneElements.forEach((zoneElement, index) => {
        const state = zoneStates[index];
        zoneElement.dataset.unlocked = String(state.unlocked);
        zoneElement.classList.toggle('is-complete', state.complete);
        zoneElement.classList.toggle('has-cloud', state.cloudUntil > elapsed);
        globalCloudElements[index].classList.toggle('is-visible', state.cloudUntil > elapsed);
        zoneElement.setAttribute('aria-label', `${ZONE_DATA[index].title}${state.complete ? '，工程完成' : state.unlocked ? '，已解鎖' : `，${ZONE_UNLOCKS[index]} 秒後解鎖`}`);

        ['traffic', 'worker'].forEach(role => {
          const value = state[role];
          zoneElement.querySelector(`[data-progress="${role}"]`).style.width = `${value / WORK_REQUIRED * 100}%`;
          zoneElement.querySelector(`[data-seconds="${role}"]`).textContent = `${Math.floor(value)}/15`;
        });

        const tokens = [];
        Object.keys(rolePools).forEach(role => {
          rolePools[role].filter(person => person.zone === index).forEach(() => {
            tokens.push(`<span class="s4-zone-token" title="${ROLE_DATA[role].label}"><img src="assets/stage4-new/${ROLE_DATA[role].icon}" alt=""><small>${ROLE_DATA[role].short}</small></span>`);
          });
        });
        zoneElement.querySelector('.s4-zone-tokens').innerHTML = tokens.join('');

        const road = element.querySelector(`[data-road="${index}"]`);
        road.classList.toggle('is-open', state.unlocked);
        road.classList.toggle('is-complete', state.complete);
        road.querySelector('i').textContent = state.complete ? '✓' : state.unlocked ? '⚓' : '🔒';
      });

      if (force) spawnGuideStatus();
    }

    function tick(timestamp) {
      if (!isActive || !isPlaying) return;
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = Math.min(0.1, (timestamp - lastTimestamp) / 1000);
      lastTimestamp = timestamp;

      if (!isPaused) {
        elapsed = Math.min(TOTAL_TIME, elapsed + delta);
        updateUnlocks();
        updateClouds();
        updateWork(delta);
        updateNarration();
        renderAccumulator += delta;
        if (renderAccumulator >= 0.18) {
          renderAccumulator = 0;
          render();
        }
        if (elapsed >= TOTAL_TIME && isPlaying) finishGame(false);
      }
      frameId = global.requestAnimationFrame(tick);
    }

    function beginGame() {
      hideIntro();
      isPlaying = true;
      isPaused = false;
      lastTimestamp = global.performance.now();
      element.classList.add('is-playing');
      guide.textContent = '拖曳工作人員到第一區，讓義交與接管工人開始工作！';
      frameId = global.requestAnimationFrame(tick);
    }

    async function revealStageAndBegin(runId) {
      hideIntro();

      // 玩家先閱讀說明；確認後才讓關卡 UI 依序進場，最後啟動計時。
      element.classList.add('show-bg-ui');
      await wait(850);
      if (runId !== animationRun || !isActive) return;

      element.classList.add('show-npc');
      await wait(700);
      if (runId !== animationRun || !isActive) return;

      element.classList.add('show-littlewhite');
      await wait(650);
      if (runId !== animationRun || !isActive) return;

      element.classList.add('show-dialogue');
      await wait(800);
      if (runId !== animationRun || !isActive) return;

      beginGame();
    }

    function finishGame(success) {
      if (!isPlaying) return;
      isPlaying = false;
      global.cancelAnimationFrame(frameId);
      resultPanel.querySelector('[data-result-title]').textContent = success ? '工程完成！' : '時間到！';
      resultPanel.querySelector('[data-result-copy]').textContent = success
        ? '大家共同參與，中壢變得更乾淨了！'
        : '重新安排交通義工與接管工人，邀請民眾共同參與。';
      resultPanel.querySelector('[data-result-action="next"]').hidden = !success;
      resultPanel.classList.add('is-visible');
      resultPanel.setAttribute('aria-hidden', 'false');
      nextButton.classList.toggle('is-visible', success);
    }

    function setPaused(paused) {
      if (!isPlaying) return;
      isPaused = paused;
      guide.textContent = paused ? '遊戲已暫停。' : '遊戲繼續，請完成四個施工區！';
      lastTimestamp = global.performance.now();
    }

    function openSettings() {
      settingsPausedGame = isPlaying && !isPaused;
      if (settingsPausedGame) setPaused(true);
      settingsPanel.classList.add('is-visible');
      settingsPanel.setAttribute('aria-hidden', 'false');
    }

    function closeSettings() {
      settingsPanel.classList.remove('is-visible');
      settingsPanel.setAttribute('aria-hidden', 'true');
      if (settingsPausedGame) setPaused(false);
      settingsPausedGame = false;
    }

    function restartGame() {
      const hadEntered = isActive;
      resetState();
      element.classList.add('show-bg-ui', 'show-npc', 'show-littlewhite', 'show-dialogue', 'is-playing');
      if (hadEntered) beginGame();
    }

    function createDragGhost(role) {
      const ghost = document.createElement('div');
      ghost.className = 's4-drag-ghost';
      ghost.innerHTML = characterSprite(ROLE_DATA[role].sprite, ROLE_DATA[role].className, ROLE_DATA[role].label);
      document.body.appendChild(ghost);
      return ghost;
    }

    function installPointerDrag(source) {
      source.addEventListener('pointerdown', event => {
        if (!isPlaying || isPaused || event.button > 0) return;
        const role = source.dataset.role;
        const startX = event.clientX;
        const startY = event.clientY;
        let ghost = null;
        let dragged = false;

        const moveGhost = moveEvent => {
          const distance = Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY);
          if (!dragged && distance > 7) {
            dragged = true;
            ghost = createDragGhost(role);
          }
          if (ghost) {
            ghost.style.left = `${moveEvent.clientX}px`;
            ghost.style.top = `${moveEvent.clientY}px`;
          }
        };

        const finishDrag = upEvent => {
          global.removeEventListener('pointermove', moveGhost);
          global.removeEventListener('pointerup', finishDrag);
          global.removeEventListener('pointercancel', finishDrag);
          if (!dragged) return;
          suppressSourceClick = true;
          const zone = document.elementsFromPoint(upEvent.clientX, upEvent.clientY).find(node => node.classList?.contains('s4-zone'));
          ghost?.remove();
          if (zone) assignRole(role, Number(zone.dataset.zone));
          else guide.textContent = '請把工作人員拖曳到已解鎖的施工區。';
          global.setTimeout(() => { suppressSourceClick = false; }, 0);
        };

        global.addEventListener('pointermove', moveGhost);
        global.addEventListener('pointerup', finishDrag);
        global.addEventListener('pointercancel', finishDrag);
      });
    }

    sources.forEach(source => {
      installPointerDrag(source);
      source.addEventListener('click', () => {
        if (!suppressSourceClick) selectRole(source.dataset.role);
      });
    });

    zoneElements.forEach(zone => {
      zone.addEventListener('click', () => {
        if (selectedRole) assignRole(selectedRole, Number(zone.dataset.zone));
      });
      zone.addEventListener('keydown', event => {
        if ((event.key === 'Enter' || event.key === ' ') && selectedRole) {
          event.preventDefault();
          assignRole(selectedRole, Number(zone.dataset.zone));
        }
      });
    });

    global.GameAudio?.registerButton(soundButton);
    element.querySelector('.s4-settings-button').addEventListener('click', openSettings);
    element.querySelector('.s4-back-button').addEventListener('click', onBack);
    pauseButton.addEventListener('click', onNext);
    nextButton.addEventListener('click', onNext);
    introStartButton.addEventListener('click', () => {
      if (!isActive || isPlaying) return;
      global.GameAudio?.playClick();
      revealStageAndBegin(animationRun);
    });
    settingsPanel.querySelector('[data-action="resume"]').addEventListener('click', closeSettings);
    settingsPanel.querySelector('[data-action="restart"]').addEventListener('click', restartGame);
    resultPanel.querySelector('[data-result-action="restart"]').addEventListener('click', restartGame);
    resultPanel.querySelector('[data-result-action="next"]').addEventListener('click', onNext);

    return {
      async enter() {
        ++animationRun;
        isActive = true;
        resetState();
        scene.classList.add('stage-ratio');
        element.classList.add('is-active');
        element.setAttribute('aria-hidden', 'false');

        // 一進入關卡就先顯示玩法；背景 UI 尚未開始漸入。
        showIntro();
      },

      exit() {
        animationRun += 1;
        isActive = false;
        isPlaying = false;
        hideIntro();
        global.cancelAnimationFrame(frameId);
        document.querySelectorAll('.s4-drag-ghost').forEach(ghost => ghost.remove());
        element.className = 'stage-four screen';
        element.setAttribute('aria-hidden', 'true');
        scene.classList.remove('stage-ratio');
      }
    };
  }

  global.GameModules = global.GameModules || {};
  global.GameModules.createStageFour = createStageFour;
})(window);
