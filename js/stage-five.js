(function registerStageFiveModule(global) {
  const ROOT = 'assets/stage5/layers';
  const MAIN_BUTTONS = {
    environment: 'button2_5_v2.png',
    process: 'button3_5_v2.png',
    phases: 'button4_5_v2.png',
    schedule: 'button5_5_v2.png'
  };

  function parseSearchSource(source) {
    const districts = {};
    let currentVillage = null;
    let currentProject = null;

    String(source || '').split(/\r?\n/).forEach(rawLine => {
      const line = rawLine.trim();
      const heading = line.match(/^(.+區) ‧ (.+里)$/u);
      if (heading) {
        currentVillage = { name: heading[2], projects: [] };
        (districts[heading[1]] ||= []).push(currentVillage);
        currentProject = null;
        return;
      }
      if (!currentVillage) return;
      if (line.startsWith('工程期別：')) {
        currentProject = { phase: line.slice(5), schedule: '', state: '' };
        currentVillage.projects.push(currentProject);
      } else if (currentProject && line.startsWith('預定工期：')) {
        currentProject.schedule = line.slice(5);
      } else if (currentProject && line.startsWith('目前狀態：')) {
        currentProject.state = line.slice(5);
      }
    });

    const preferredOrder = ['中壢區', '平鎮區', '大園區', '八德區'];
    return Object.fromEntries(
      [...preferredOrder, ...Object.keys(districts).filter(name => !preferredOrder.includes(name))]
        .filter(name => districts[name])
        .map(name => [name, districts[name]])
    );
  }

  const SEARCH_DISTRICTS = parseSearchSource(global.STAGE5_SEARCH_SOURCE);
  const SEARCH_NOTE = '資料為工程圖形與里界的空間比對結果，非官方逐里工程清單；† 為小於 1,000 平方公尺的小面積交界，里別歸屬仍待確認。實際施工資訊請以桃園市政府公告為準。';

  function stateClassName(value) {
    if (value.includes('施工中')) return 'is-progress';
    if (value.includes('規劃中')) return 'is-planning';
    return 'is-unverified';
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>\"]/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;'
    })[character]);
  }

  function layer(path, className, alt = '') {
    const hidden = alt ? '' : ' aria-hidden="true"';
    return `<img class="s5-layer ${className}" src="${ROOT}/${path}" alt="${alt}"${hidden}>`;
  }

  function chromeMarkup() {
    return `
      <div class="s5-chrome" aria-hidden="true">
        <img class="s5-common-frame" src="assets/common/all_ui.png" alt="">
      </div>
    `;
  }

  function mainMarkup() {
    return `
      <div class="s5-main-view" aria-label="階段五：計畫相關資訊導覽">
        ${layer('BG_5.png', 's5-main-bg', '計畫相關資訊導覽')}
        ${chromeMarkup()}
        ${layer('ui1_05.png', 's5-main-title')}
        ${layer('ui2_05.png', 's5-main-stage')}
        ${layer('ui3_05_v3.png', 's5-main-topics')}
        <span class="s5-main-bubble s5-main-bubble-left" aria-hidden="true"></span>
        <span class="s5-main-bubble s5-main-bubble-right" aria-hidden="true"></span>
        ${layer('ui4_05.png', 's5-main-people s5-person-left')}
        ${layer('ui4_05.png', 's5-main-people s5-person-right')}
        ${layer('ui5_05.png', 's5-main-speech')}
        ${layer('ui6_05.png', 's5-main-speech')}

        <button class="s5-detail-button s5-environment-button" type="button" data-detail="environment" aria-label="查看便民服務詳情">
          <img src="${ROOT}/${MAIN_BUTTONS.environment}" alt="查看便民服務詳情">
        </button>
        <button class="s5-detail-button s5-process-button" type="button" data-detail="process" aria-label="查看污水處理流程詳情">
          <img src="${ROOT}/${MAIN_BUTTONS.process}" alt="查看污水處理流程詳情">
        </button>
        <button class="s5-detail-button s5-phases-button" type="button" data-detail="phases" aria-label="查看接管分期詳情">
          <img src="${ROOT}/${MAIN_BUTTONS.phases}" alt="查看接管分期詳情">
        </button>
        <button class="s5-detail-button s5-schedule-button" type="button" data-detail="schedule" aria-label="查看詳細工期搜尋詳情">
          <img src="${ROOT}/${MAIN_BUTTONS.schedule}" alt="查看詳細工期搜尋詳情">
        </button>

        <p class="s5-main-footer-caption">點選按鈕，觀看計畫說明介紹</p>
        <button class="s5-main-back s5-nav-button" type="button" aria-label="返回階段四"><img src="assets/common/previous_ui.png" alt="返回階段四"></button>
        <button class="s5-main-next s5-nav-button" type="button" aria-label="進入下一階段"><img src="assets/common/next_ui.png" alt="下一階段"></button>
        <button class="s5-main-sound s5-round-button" type="button" aria-label="切換音效" aria-pressed="true"><img src="assets/common/sound_ui.png" alt="音效"></button>
      </div>
    `;
  }

  function environmentMarkup() {
    return `
      ${layer('FireLane_5/BG_FireLane.png', 's5-detail-bg', '便民服務與住家巷弄改善')}
      ${chromeMarkup()}
      ${layer('FireLane_5/ui1_FireLane.png', 's5-detail-title s5-environment-title-main', '水利規劃介紹')}
      ${layer('FireLane_5/ui1_FireLane.png', 's5-detail-title s5-environment-title-subtitle', '施工福利提供您')}
      ${layer('FireLane_5/ui2_FireLane.png', 's5-detail-stage')}
      ${layer('FireLane_5/text1_FireLane.png', 's5-detail-text')}
      ${layer('FireLane_5/text2_FireLane.png', 's5-detail-text')}
      ${layer('FireLane_5/text3_FireLane.png', 's5-detail-text')}
      ${layer('FireLane_5/icon1_FireLane.png', 's5-detail-icon')}
      ${layer('FireLane_5/icon2_FireLane.png', 's5-detail-icon')}
      ${layer('FireLane_5/icon3_FireLane.png', 's5-detail-icon')}
    `;
  }

  function processMarkup() {
    return `
      <img class="s5-process-art s5-native-ratio" src="${ROOT}/Process_5/BG_Process_v2.gif" alt="污水從住家收集、進入處理廠淨化，再放流回歸自然的動態流程">
      ${chromeMarkup()}
      ${layer('Process_5/ui1_Process.png', 's5-detail-title s5-process-title-main s5-native-ratio')}
      ${layer('Process_5/ui1_Process.png', 's5-detail-title s5-process-title-subtitle s5-native-ratio')}
      ${layer('Process_5/ui2_Process.png', 's5-detail-stage s5-native-ratio')}
      <p class="s5-process-footer-caption">讓生活污水經過處理後，變乾淨再回到自然環境</p>
    `;
  }

  function phasesMarkup() {
    return `
      ${layer('Timeline_5/BG_Timeline_v2.png', 's5-detail-bg s5-native-ratio', '污水下水道系統與中壢分期規劃')}
      ${chromeMarkup()}
      ${layer('Timeline_5/ui1_Timeline.png', 's5-detail-title s5-phases-title-main s5-native-ratio')}
      ${layer('Timeline_5/ui1_Timeline.png', 's5-detail-title s5-phases-title-subtitle s5-native-ratio')}
      ${layer('Timeline_5/ui2_Timeline.png', 's5-detail-stage s5-native-ratio')}
      <span class="s5-talk-bubble s5-talk-bubble-left" aria-hidden="true"></span>
      <span class="s5-talk-bubble s5-talk-bubble-right" aria-hidden="true"></span>
      ${layer('Timeline_5/people_Timeline_v2.png', 's5-detail-people s5-person-left s5-native-ratio')}
      ${layer('Timeline_5/people_Timeline_v2.png', 's5-detail-people s5-person-right s5-native-ratio')}
      ${layer('Timeline_5/talking_Timeline_v2.png', 's5-detail-speech s5-native-ratio', '我們的計畫包含：污水收集、處理淨化、放流回歸自然。讓每一滴水都能乾淨再生，打造更美好的中壢。')}
      ${layer('Timeline_5/Timeline.gif', 's5-water-diagram s5-timeline-gif s5-native-ratio', '污水從住家接管、進入水資源回收中心處理並排入河川的動態示意圖')}
      <p class="s5-phases-footer-caption">污水回收再利用，環境整潔又環保。</p>
    `;
  }

  function scheduleMarkup() {
    return `
      ${layer('Timeline_5/BG_Timeline_v2.png', 's5-detail-bg s5-native-ratio', '工期時程與住家施工位置查詢')}
      ${chromeMarkup()}
      ${layer('Search_5/ui1_Search.png', 's5-detail-title s5-schedule-title-main s5-native-ratio', '水利規劃介紹')}
      ${layer('Search_5/ui1_Search.png', 's5-detail-title s5-schedule-title-subtitle s5-native-ratio', '守護中壢地區環境未來')}
      ${layer('Search_5/ui2_Search.png', 's5-detail-stage s5-native-ratio')}
      <span class="s5-talk-bubble s5-talk-bubble-left" aria-hidden="true"></span>
      <span class="s5-talk-bubble s5-talk-bubble-right" aria-hidden="true"></span>
      ${layer('Timeline_5/people_Timeline_v2.png', 's5-detail-people s5-person-left s5-native-ratio')}
      ${layer('Timeline_5/people_Timeline_v2.png', 's5-detail-people s5-person-right s5-native-ratio')}
      ${layer('Timeline_5/talking_Timeline_v2.png', 's5-detail-speech s5-native-ratio', '我們的計畫包含：污水收集、處理淨化、放流回歸自然。讓每一滴水都能乾淨再生，打造更美好的中壢。')}

      <form class="s5-search-form" aria-label="施工區域查詢">
        <label for="s5-district">行政區</label>
        <select id="s5-district" name="district">
          ${Object.keys(SEARCH_DISTRICTS).map(name => `<option value="${name}">${name}</option>`).join('')}
        </select>
        <fieldset>
          <legend>請選擇里別</legend>
          <div class="s5-area-grid"></div>
        </fieldset>
      </form>

      <section class="s5-search-result" aria-live="polite" aria-label="查詢結果">
        <p class="s5-result-location"></p>
        <div class="s5-result-projects"></div>
        <p class="s5-result-note"></p>
      </section>
      <p class="s5-search-footer-caption">施工前將會再次通知，並協助接管位置施工安排。</p>
    `;
  }

  function detailMarkup() {
    return `
      <div class="s5-detail-view" aria-hidden="true">
        <div class="s5-detail-layers"></div>
        <button class="s5-detail-back s5-nav-button" type="button" aria-label="回到上一頁"><img src="assets/common/previous_ui.png" alt="回到上一頁"></button>
        <button class="s5-detail-sound s5-round-button" type="button" aria-label="切換音效" aria-pressed="true"><img src="assets/common/sound_ui.png" alt="音效"></button>
        <button class="s5-detail-settings s5-round-button" type="button" aria-label="開啟設定"></button>
      </div>
    `;
  }

  function settingsMarkup() {
    return `
      <div class="s5-settings-panel" aria-hidden="true">
        <div role="dialog" aria-modal="true" aria-labelledby="s5-settings-title">
          <h2 id="s5-settings-title">遊戲設定</h2>
          <p>可使用右上角音效按鈕開啟或關閉遊戲音樂與音效。</p>
          <button type="button">返回畫面</button>
        </div>
      </div>
    `;
  }

  function createMarkup() {
    return `${mainMarkup()}${detailMarkup()}${settingsMarkup()}`;
  }

  function createStageFive({ scene, element, onBack, onNext }) {
    element.innerHTML = createMarkup();
    const mainView = element.querySelector('.s5-main-view');
    const detailView = element.querySelector('.s5-detail-view');
    const detailLayers = element.querySelector('.s5-detail-layers');
    const detailBack = element.querySelector('.s5-detail-back');
    const settingsPanel = element.querySelector('.s5-settings-panel');
    const mainSound = element.querySelector('.s5-main-sound');
    const detailSound = element.querySelector('.s5-detail-sound');

    const preloadPaths = [
      'BG_5.png', 'ui1_05.png', 'ui2_05.png', 'ui3_05_v3.png', 'ui4_05.png', 'ui5_05.png', 'ui6_05.png',
      'Process_5/BG_Process_v2.gif', 'Process_5/ui1_Process.png', 'Process_5/ui2_Process.png',
      ...Object.values(MAIN_BUTTONS),
      'FireLane_5/BG_FireLane.png', 'FireLane_5/ui1_FireLane.png', 'FireLane_5/ui2_FireLane.png',
      'FireLane_5/text1_FireLane.png', 'FireLane_5/text2_FireLane.png', 'FireLane_5/text3_FireLane.png',
      'FireLane_5/icon1_FireLane.png', 'FireLane_5/icon2_FireLane.png', 'FireLane_5/icon3_FireLane.png',
      'Timeline_5/BG_Timeline.png', 'Timeline_5/ui1_Timeline.png', 'Timeline_5/ui2_Timeline.png',
      'Timeline_5/people_Timeline.png', 'Timeline_5/Timeline.gif',
      'Search_5/BG_Search.png', 'Search_5/ui1_Search.png', 'Search_5/ui2_Search.png',
      'Search_5/ZeandLittleWhite_Search.png', 'Search_5/talking_Search_v2.png'
    ];
    const preloadMap = new Map(preloadPaths.map(path => {
      const image = new Image();
      const ready = new Promise(resolve => {
        image.addEventListener('load', resolve, { once: true });
        image.addEventListener('error', resolve, { once: true });
      });
      image.src = `${ROOT}/${path}`;
      if (image.complete) return [path, { image, ready: Promise.resolve() }];
      return [path, { image, ready }];
    }));

    const detailAssetPaths = {
      environment: [
        'FireLane_5/BG_FireLane.png', 'FireLane_5/ui1_FireLane.png', 'FireLane_5/ui2_FireLane.png',
        'FireLane_5/text1_FireLane.png', 'FireLane_5/text2_FireLane.png', 'FireLane_5/text3_FireLane.png',
        'FireLane_5/icon1_FireLane.png', 'FireLane_5/icon2_FireLane.png', 'FireLane_5/icon3_FireLane.png'
      ],
      process: ['Process_5/BG_Process_v2.gif', 'Process_5/ui1_Process.png', 'Process_5/ui2_Process.png'],
      phases: [
        'Timeline_5/BG_Timeline.png', 'Timeline_5/ui1_Timeline.png', 'Timeline_5/ui2_Timeline.png',
        'Timeline_5/people_Timeline.png', 'Search_5/talking_Search_v2.png', 'Timeline_5/Timeline.gif'
      ],
      schedule: [
        'Search_5/BG_Search.png', 'Search_5/ui1_Search.png', 'Search_5/ui2_Search.png',
        'Search_5/ZeandLittleWhite_Search.png', 'Search_5/talking_Search_v2.png'
      ]
    };
    let detailRequest = 0;

    function resetSceneViewport() {
      scene.scrollLeft = 0;
      scene.scrollTop = 0;
    }

    function showMain() {
      detailRequest += 1;
      mainView.classList.add('is-visible');
      mainView.setAttribute('aria-hidden', 'false');
      detailView.classList.remove('is-visible');
      detailView.setAttribute('aria-hidden', 'true');
      detailView.removeAttribute('data-detail');
      detailLayers.replaceChildren();
      resetSceneViewport();
      global.requestAnimationFrame(resetSceneViewport);
    }

    function bindSearch() {
      const result = detailLayers.querySelector('.s5-search-result');
      const districtSelect = detailLayers.querySelector('#s5-district');
      const areaGrid = detailLayers.querySelector('.s5-area-grid');
      if (!result || !districtSelect || !areaGrid) return;

      function updateResult(button) {
        const rows = SEARCH_DISTRICTS[districtSelect.value] || [];
        const data = rows.find(row => row.name === button.dataset.area);
        if (!data) return;
        result.querySelector('.s5-result-location').textContent = `${districtSelect.value}・${button.dataset.area}`;
        result.querySelector('.s5-result-projects').innerHTML = data.projects.map(project => `
          <article class="s5-project-card">
            <h3>${escapeHtml(project.phase)}</h3>
            <dl>
              <div><dt>預定工期</dt><dd>${escapeHtml(project.schedule)}</dd></div>
              <div><dt>目前狀態</dt><dd><span class="s5-result-state ${stateClassName(project.state)}">${escapeHtml(project.state)}</span></dd></div>
            </dl>
          </article>
        `).join('');
        result.querySelector('.s5-result-note').textContent = SEARCH_NOTE;
      }

      function selectArea(button) {
        const buttons = [...areaGrid.querySelectorAll('[data-area]')];
        buttons.forEach(item => {
          const selected = item === button;
          item.classList.toggle('is-selected', selected);
          item.setAttribute('aria-pressed', selected ? 'true' : 'false');
        });
        updateResult(button);
        resetSceneViewport();
        global.requestAnimationFrame(resetSceneViewport);
      }

      function renderAreas() {
        const rows = SEARCH_DISTRICTS[districtSelect.value] || [];
        areaGrid.innerHTML = rows.map(({ name }, index) =>
          `<button type="button" data-area="${name}" aria-pressed="${index === 0 ? 'true' : 'false'}"${index === 0 ? ' class="is-selected"' : ''}>${name}</button>`
        ).join('');
        const first = areaGrid.querySelector('[data-area]');
        if (first) updateResult(first);
        resetSceneViewport();
        global.requestAnimationFrame(resetSceneViewport);
      }

      areaGrid.addEventListener('click', event => {
        const button = event.target.closest('[data-area]');
        if (!button || !areaGrid.contains(button)) return;
        global.GameAudio?.playClick();
        selectArea(button);
      });

      districtSelect.addEventListener('change', () => {
        renderAreas();
      });

      renderAreas();
    }

    async function showDetail(key) {
      const markup = {
        environment: environmentMarkup,
        process: processMarkup,
        phases: phasesMarkup,
        schedule: scheduleMarkup
      }[key];
      if (!markup) return;

      const request = ++detailRequest;
      await Promise.all((detailAssetPaths[key] || []).map(path => preloadMap.get(path)?.ready));
      if (request !== detailRequest) return;

      detailView.dataset.detail = key;
      detailLayers.innerHTML = markup();
      if (key === 'schedule') bindSearch();
      mainView.classList.remove('is-visible');
      mainView.setAttribute('aria-hidden', 'true');
      detailView.classList.add('is-visible');
      detailView.setAttribute('aria-hidden', 'false');
      detailBack.focus({ preventScroll: true });
      resetSceneViewport();
      global.requestAnimationFrame(resetSceneViewport);
    }

    element.querySelectorAll('[data-detail]').forEach(button => {
      button.addEventListener('click', () => { void showDetail(button.dataset.detail); });
    });
    element.querySelector('.s5-main-back').addEventListener('click', onBack);
    element.querySelector('.s5-main-next').addEventListener('click', onNext);
    detailBack.addEventListener('click', showMain);
    element.querySelector('.s5-detail-settings').addEventListener('click', () => {
      settingsPanel.classList.add('is-visible');
      settingsPanel.setAttribute('aria-hidden', 'false');
      settingsPanel.querySelector('button').focus({ preventScroll: true });
    });
    settingsPanel.querySelector('button').addEventListener('click', () => {
      settingsPanel.classList.remove('is-visible');
      settingsPanel.setAttribute('aria-hidden', 'true');
      detailView.querySelector('.s5-detail-settings').focus({ preventScroll: true });
    });

    global.GameAudio?.registerButton(mainSound);
    global.GameAudio?.registerButton(detailSound);

    return {
      enter() {
        void preloadMap;
        scene.classList.add('stage-ratio');
        element.classList.add('is-active', 'is-entering');
        element.setAttribute('aria-hidden', 'false');
        showMain();
        resetSceneViewport();
        global.GameAudio?.start();
        global.setTimeout(() => element.classList.remove('is-entering'), 650);
      },
      exit() {
        detailRequest += 1;
        element.className = 'stage-five screen';
        element.setAttribute('aria-hidden', 'true');
        settingsPanel.classList.remove('is-visible');
        settingsPanel.setAttribute('aria-hidden', 'true');
        scene.classList.remove('stage-ratio');
      }
    };
  }

  global.GameModules = global.GameModules || {};
  global.GameModules.createStageFive = createStageFive;
})(window);
