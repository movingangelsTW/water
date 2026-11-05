(function registerStageTenModule(global) {
  const ROOT = 'assets/stage10';
  const ZONES = [
    {
      name: '第一區',
      photos: [
        ['photos/zone1-1.png', '站前都會街景'],
        ['photos/zone1-2.png', '埤塘與城市'],
        ['photos/zone1-3.png', '溪岸綠地']
      ]
    },
    {
      name: '第二區',
      photos: [
        ['photos/zone2-1.png', '通勤街景'],
        ['photos/zone2-2.png', '農田與水圳'],
        ['photos/zone2-3.png', '社區日常']
      ]
    },
    {
      name: '第三區',
      photos: [
        ['photos/zone3-1.png', '老城商街'],
        ['photos/zone3-2.png', '老街溪水岸'],
        ['photos/zone3-3.png', '歷史街屋庭院']
      ]
    },
    {
      name: '第四區',
      photos: [
        ['photos/zone4-1.png', '滇緬市場生活'],
        ['photos/zone4-2.png', '米干飲食文化'],
        ['photos/zone4-3.png', '眷村巷弄']
      ]
    }
  ];

  const LAYERS = [
    'BG_10.png', 'ui1_10.png', 'ui2_10.png', 'ui3_10.png', 'talking_10.png',
    'button1_10.png', 'button2_10_v2.png', 'button3_10_v2.png', 'button4_10.png',
    'Ze_10.png', 'LittleWhite_10.png', 'Ending.png'
  ];

  function layer(file, className, alt = '') {
    const hidden = alt ? '' : ' aria-hidden="true"';
    return `<img class="s10-layer ${className}" src="${ROOT}/${file}" alt="${alt}"${hidden}>`;
  }

  function markup() {
    return `
      <div class="s10-view">
        ${layer('BG_10.png', 's10-background', '恢復乾淨的中壢河川')}
        <img class="s10-littlewhite" src="${ROOT}/LittleWhite_10.png" alt="開心的小白">
        <span class="s10-talk-bubble s10-talk-bubble-left" aria-hidden="true"></span>
        <span class="s10-talk-bubble s10-talk-bubble-right" aria-hidden="true"></span>
        ${layer('button1_10.png', 's10-map-art s10-map-art-1')}
        ${layer('button2_10_v2.png', 's10-map-art s10-map-art-2')}
        ${layer('button3_10_v2.png', 's10-map-art s10-map-art-3')}
        ${layer('button4_10.png', 's10-map-art s10-map-art-4')}
        ${layer('Ze_10.png', 's10-worker', '阿澤')}
        <img class="s10-layer s10-common-frame" src="assets/common/all_ui.png" alt="" aria-hidden="true">
        ${layer('ui1_10.png', 's10-title', '中壢水境觀看；點亮中壢，生態共存')}
        ${layer('ui2_10.png', 's10-stage-count', '階段 結尾')}
        ${layer('talking_10.png', 's10-talking', '讓我們一起讓中壢變得更美好，小白也回到了他的家園。乾淨的水環境，讓生態與生活都更美好。')}
        ${layer('ui3_10.png', 's10-progress-card', '收集進度：點亮所有區域，收集中壢地區的美麗回憶吧！')}

        <div class="s10-zone-buttons" aria-label="中壢四區地圖">
          ${ZONES.map((zone, index) => `<button class="s10-zone s10-zone-${index + 1}" type="button" data-zone="${index}" aria-label="查看${zone.name}照片"><span aria-hidden="true">✓</span></button>`).join('')}
        </div>

        <strong class="s10-progress-count" aria-live="polite">0／4</strong>
        <p class="s10-footer-caption">點擊不同區域，看看中壢地區的美麗風景。</p>
        <button class="s10-back" type="button" aria-label="返回階段九"><img src="assets/common/previous_ui.png" alt="返回階段九"></button>
        <button class="s10-sound" type="button" aria-label="切換音效" aria-pressed="true"><img src="assets/common/sound_ui.png" alt="音效"></button>
        <div class="s10-live-status sr-only" role="status" aria-live="polite"></div>
      </div>

      <section class="s10-gallery" aria-hidden="true" aria-label="區域照片">
        <button class="s10-gallery-close" type="button" aria-label="關閉照片並返回結尾地圖">×</button>
        <button class="s10-gallery-advance" type="button" aria-label="播放下一張照片">
          <img src="" alt="">
        </button>
        <div class="s10-gallery-meta">
          <strong class="s10-gallery-title"></strong>
          <span class="s10-gallery-counter"></span>
          <small>點擊照片播放下一張</small>
        </div>
      </section>

      <section class="s10-video-panel" aria-hidden="true" aria-label="小白在乾淨河川開心抓魚">
        <video class="s10-ending-video" playsinline preload="metadata" disablepictureinpicture controlslist="nodownload nofullscreen noremoteplayback">
          <source src="${ROOT}/ending.mp4" type="video/mp4">
        </video>
        <p class="s10-video-message" aria-live="assertive"></p>
        <button class="s10-video-return" type="button">返回遊戲首頁</button>
      </section>

      <button class="s10-ending-card" type="button" aria-label="歡迎蒞臨中壢水資源回收中心，點擊返回遊戲首頁" aria-hidden="true">
        <img src="${ROOT}/Ending.png" alt="歡迎蒞臨中壢水資源回收中心">
      </button>
    `;
  }

  function createStageTen({ scene, element, onBack, onFinish }) {
    element.innerHTML = markup();

    const zoneButtons = Array.from(element.querySelectorAll('.s10-zone'));
    const progressCount = element.querySelector('.s10-progress-count');
    const liveStatus = element.querySelector('.s10-live-status');
    const gallery = element.querySelector('.s10-gallery');
    const galleryImage = element.querySelector('.s10-gallery-advance img');
    const galleryTitle = element.querySelector('.s10-gallery-title');
    const galleryCounter = element.querySelector('.s10-gallery-counter');
    const galleryClose = element.querySelector('.s10-gallery-close');
    const galleryAdvance = element.querySelector('.s10-gallery-advance');
    const videoPanel = element.querySelector('.s10-video-panel');
    const video = element.querySelector('.s10-ending-video');
    const videoMessage = element.querySelector('.s10-video-message');
    const videoReturn = element.querySelector('.s10-video-return');
    const endingCard = element.querySelector('.s10-ending-card');
    const soundButton = element.querySelector('.s10-sound');

    let active = false;
    let activeZone = -1;
    let photoIndex = 0;
    let completedZones = new Set();
    let audioWasMuted = false;
    let endingTimerId = 0;
    let finishing = false;

    LAYERS.forEach(file => {
      const image = new Image();
      image.src = `${ROOT}/${file}`;
    });
    ZONES.flatMap(zone => zone.photos).forEach(([file]) => {
      const image = new Image();
      image.src = `${ROOT}/${file}`;
    });

    function updateProgress() {
      progressCount.textContent = `${completedZones.size}／4`;
      zoneButtons.forEach((button, index) => {
        const complete = completedZones.has(index);
        button.classList.toggle('is-complete', complete);
        button.setAttribute('aria-label', `${complete ? '重新觀看' : '查看'}${ZONES[index].name}照片${complete ? '，已收集完成' : ''}`);
      });
    }

    function renderPhoto() {
      const zone = ZONES[activeZone];
      const [file, title] = zone.photos[photoIndex];
      galleryImage.src = `${ROOT}/${file}`;
      galleryImage.alt = `${zone.name}：${title}`;
      galleryTitle.textContent = `${zone.name}｜${title}`;
      galleryCounter.textContent = `${photoIndex + 1}／${zone.photos.length}`;
      galleryAdvance.setAttribute('aria-label', photoIndex === zone.photos.length - 1 ? '完成本區照片瀏覽並返回地圖' : '播放下一張照片');
      liveStatus.textContent = `${zone.name}第 ${photoIndex + 1} 張照片，共 ${zone.photos.length} 張：${title}`;
    }

    function openGallery(zoneIndex) {
      if (!active || videoPanel.classList.contains('is-visible')) return;
      activeZone = zoneIndex;
      photoIndex = 0;
      renderPhoto();
      gallery.classList.add('is-visible');
      gallery.setAttribute('aria-hidden', 'false');
      galleryClose.focus({ preventScroll: true });
    }

    function closeGallery(complete = false) {
      gallery.classList.remove('is-visible');
      gallery.setAttribute('aria-hidden', 'true');
      galleryImage.removeAttribute('src');
      galleryImage.alt = '';

      if (complete && activeZone >= 0) {
        completedZones.add(activeZone);
        updateProgress();
        global.GameAudio?.playZoneComplete();
        liveStatus.textContent = `${ZONES[activeZone].name}照片收集完成，目前完成 ${completedZones.size} 個區域。`;
      }

      const finishedAllZones = complete && completedZones.size === ZONES.length;
      const returnTarget = activeZone;
      activeZone = -1;
      photoIndex = 0;

      if (finishedAllZones) {
        playEndingVideo();
      } else if (active && returnTarget >= 0) {
        zoneButtons[returnTarget].focus({ preventScroll: true });
      }
    }

    function advanceGallery() {
      if (activeZone < 0) return;
      const zone = ZONES[activeZone];
      if (photoIndex < zone.photos.length - 1) {
        photoIndex += 1;
        renderPhoto();
      } else {
        closeGallery(true);
      }
    }

    function restoreGameAudio() {
      global.GameAudio?.setMuted(audioWasMuted);
    }

    function finishToHome() {
      if (!active || finishing) return;
      finishing = true;
      global.clearTimeout(endingTimerId);
      endingTimerId = 0;
      endingCard.classList.remove('is-visible');
      endingCard.setAttribute('aria-hidden', 'true');
      restoreGameAudio();
      onFinish();
    }

    function showEndingCard() {
      if (!active) return;
      videoPanel.classList.remove('is-visible');
      videoPanel.setAttribute('aria-hidden', 'true');
      endingCard.classList.add('is-visible');
      endingCard.setAttribute('aria-hidden', 'false');
      endingCard.focus({ preventScroll: true });
      global.clearTimeout(endingTimerId);
      endingTimerId = global.setTimeout(finishToHome, 5000);
    }

    function playEndingVideo() {
      audioWasMuted = global.GameAudio?.isMuted?.() ?? false;
      global.GameAudio?.setMuted(true);
      videoPanel.classList.add('is-visible');
      videoPanel.setAttribute('aria-hidden', 'false');
      videoMessage.textContent = '';
      videoReturn.classList.remove('is-visible');
      video.currentTime = 0;
      const playback = video.play();
      if (playback?.catch) {
        playback.catch(() => {
          videoMessage.textContent = '請按下影片中央的播放鍵觀看結尾影片。';
        });
      }
    }

    function reset() {
      global.clearTimeout(endingTimerId);
      endingTimerId = 0;
      finishing = false;
      completedZones = new Set();
      activeZone = -1;
      photoIndex = 0;
      gallery.classList.remove('is-visible');
      gallery.setAttribute('aria-hidden', 'true');
      videoPanel.classList.remove('is-visible');
      videoPanel.setAttribute('aria-hidden', 'true');
      video.pause();
      video.currentTime = 0;
      videoMessage.textContent = '';
      videoReturn.classList.remove('is-visible');
      endingCard.classList.remove('is-visible');
      endingCard.setAttribute('aria-hidden', 'true');
      updateProgress();
    }

    zoneButtons.forEach(button => {
      button.addEventListener('click', () => openGallery(Number(button.dataset.zone)));
    });
    galleryClose.addEventListener('click', () => closeGallery(false));
    galleryAdvance.addEventListener('click', advanceGallery);
    video.addEventListener('ended', showEndingCard);
    video.addEventListener('error', () => {
      videoMessage.textContent = '影片暫時無法播放，可以返回遊戲首頁。';
      videoReturn.classList.add('is-visible');
    });
    videoReturn.addEventListener('click', finishToHome);
    endingCard.addEventListener('click', finishToHome);
    element.querySelector('.s10-back').addEventListener('click', () => {
      if (!gallery.classList.contains('is-visible') && !videoPanel.classList.contains('is-visible')) onBack();
    });
    element.addEventListener('keydown', event => {
      if (event.key === 'Escape' && gallery.classList.contains('is-visible')) {
        event.preventDefault();
        closeGallery(false);
      }
    });
    global.GameAudio?.registerButton(soundButton);

    return {
      enter() {
        active = true;
        reset();
        scene.classList.add('stage-ratio');
        element.className = 'stage-ten screen is-active is-entering';
        element.setAttribute('aria-hidden', 'false');
        scene.scrollLeft = 0;
        scene.scrollTop = 0;
        global.requestAnimationFrame(() => {
          scene.scrollLeft = 0;
          scene.scrollTop = 0;
        });
        global.setTimeout(() => {
          if (!active) return;
          element.classList.remove('is-entering');
          element.classList.add('is-ready');
        }, 720);
      },
      exit() {
        active = false;
        global.clearTimeout(endingTimerId);
        endingTimerId = 0;
        if (videoPanel.classList.contains('is-visible')) restoreGameAudio();
        video.pause();
        gallery.classList.remove('is-visible');
        videoPanel.classList.remove('is-visible');
        endingCard.classList.remove('is-visible');
        element.className = 'stage-ten screen';
        element.setAttribute('aria-hidden', 'true');
        scene.classList.remove('stage-ratio');
      }
    };
  }

  global.GameModules = global.GameModules || {};
  global.GameModules.createStageTen = createStageTen;
})(window);
