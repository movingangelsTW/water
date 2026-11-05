(function registerGameAudio(global) {
  const AudioContextClass = global.AudioContext || global.webkitAudioContext;
  const buttons = new Set();
  const MUSIC_STEP_SECONDS = 0.46;
  const MUSIC_LOOKAHEAD_SECONDS = 0.5;
  const MUSIC_NOTES = [
    261.63, 329.63, 392.00, 329.63,
    293.66, 349.23, 440.00, 349.23,
    246.94, 329.63, 392.00, 329.63,
    220.00, 293.66, 349.23, 293.66
  ];
  const BASS_NOTES = [130.81, 146.83, 123.47, 110.00];

  let context = null;
  let masterGain = null;
  let musicGain = null;
  let effectsGain = null;
  let musicStarted = false;
  let muted = false;
  let schedulerId = 0;
  let musicStep = 0;
  let nextMusicTime = 0;

  function ensureContext() {
    if (!AudioContextClass) return null;
    if (context) return context;

    context = new AudioContextClass();
    masterGain = context.createGain();
    musicGain = context.createGain();
    effectsGain = context.createGain();

    masterGain.gain.value = muted ? 0 : 0.82;
    musicGain.gain.value = 0.72;
    effectsGain.gain.value = 0.9;
    musicGain.connect(masterGain);
    effectsGain.connect(masterGain);
    masterGain.connect(context.destination);
    return context;
  }

  function createTone(frequency, startTime, duration, volume, destination, type = 'sine') {
    if (!context || !destination) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startTime);
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), startTime + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    oscillator.connect(gain);
    gain.connect(destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.05);
  }

  function scheduleMusic() {
    if (!context || !musicStarted) return;
    while (nextMusicTime < context.currentTime + MUSIC_LOOKAHEAD_SECONDS) {
      const note = MUSIC_NOTES[musicStep % MUSIC_NOTES.length];
      createTone(note, nextMusicTime, 0.42, 0.032, musicGain, 'sine');
      createTone(note * 2, nextMusicTime + 0.02, 0.25, 0.009, musicGain, 'triangle');

      if (musicStep % 4 === 0) {
        const bass = BASS_NOTES[Math.floor(musicStep / 4) % BASS_NOTES.length];
        createTone(bass, nextMusicTime, MUSIC_STEP_SECONDS * 3.7, 0.026, musicGain, 'sine');
      }

      musicStep += 1;
      nextMusicTime += MUSIC_STEP_SECONDS;
    }
  }

  function startMusic() {
    if (!context || musicStarted) return;
    musicStarted = true;
    musicStep = 0;
    nextMusicTime = context.currentTime + 0.06;
    scheduleMusic();
    schedulerId = global.setInterval(scheduleMusic, 120);
  }

  async function start() {
    const audioContext = ensureContext();
    if (!audioContext) return false;
    if (audioContext.state === 'suspended') {
      try { await audioContext.resume(); } catch (_) { return false; }
    }
    startMusic();
    return true;
  }

  function syncButtons() {
    buttons.forEach(button => {
      button.setAttribute('aria-pressed', String(!muted));
      button.setAttribute('aria-label', muted ? '開啟遊戲音樂與音效' : '關閉遊戲音樂與音效');
      button.classList.toggle('is-muted', muted);
    });
  }

  function setMuted(value) {
    muted = Boolean(value);
    if (masterGain && context) {
      const now = context.currentTime;
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setTargetAtTime(muted ? 0 : 0.82, now, 0.025);
    }
    syncButtons();
    global.dispatchEvent(new CustomEvent('gameaudio:statechange', { detail: { muted } }));
    return !muted;
  }

  async function toggle() {
    await start();
    return setMuted(!muted);
  }

  function registerButton(button) {
    if (!button || buttons.has(button)) return;
    buttons.add(button);
    button.addEventListener('click', toggle);
    syncButtons();
  }

  function createNoiseBuffer(duration) {
    if (!context) return null;
    const length = Math.max(1, Math.floor(context.sampleRate * duration));
    const buffer = context.createBuffer(1, length, context.sampleRate);
    const data = buffer.getChannelData(0);
    let previous = 0;
    for (let index = 0; index < length; index += 1) {
      const white = Math.random() * 2 - 1;
      previous = previous * 0.965 + white * 0.035;
      data[index] = previous * 3.1;
    }
    return buffer;
  }

  async function playThunder() {
    if (!(await start()) || muted || !context) return;
    const now = context.currentTime;

    const crackBuffer = createNoiseBuffer(0.22);
    const crack = context.createBufferSource();
    const crackFilter = context.createBiquadFilter();
    const crackGain = context.createGain();
    crack.buffer = crackBuffer;
    crackFilter.type = 'highpass';
    crackFilter.frequency.value = 1100;
    crackGain.gain.setValueAtTime(0.0001, now);
    crackGain.gain.exponentialRampToValueAtTime(0.52, now + 0.006);
    crackGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    crack.connect(crackFilter);
    crackFilter.connect(crackGain);
    crackGain.connect(effectsGain);
    crack.start(now);

    const rumbleBuffer = createNoiseBuffer(2.6);
    const rumble = context.createBufferSource();
    const rumbleFilter = context.createBiquadFilter();
    const rumbleGain = context.createGain();
    rumble.buffer = rumbleBuffer;
    rumbleFilter.type = 'lowpass';
    rumbleFilter.frequency.setValueAtTime(210, now);
    rumbleFilter.frequency.exponentialRampToValueAtTime(70, now + 2.5);
    rumbleGain.gain.setValueAtTime(0.0001, now);
    rumbleGain.gain.exponentialRampToValueAtTime(0.5, now + 0.08);
    rumbleGain.gain.exponentialRampToValueAtTime(0.18, now + 0.75);
    rumbleGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.55);
    rumble.connect(rumbleFilter);
    rumbleFilter.connect(rumbleGain);
    rumbleGain.connect(effectsGain);
    rumble.start(now + 0.035);

    const lowOscillator = context.createOscillator();
    const lowGain = context.createGain();
    lowOscillator.type = 'sine';
    lowOscillator.frequency.setValueAtTime(62, now);
    lowOscillator.frequency.exponentialRampToValueAtTime(34, now + 2.2);
    lowGain.gain.setValueAtTime(0.0001, now);
    lowGain.gain.exponentialRampToValueAtTime(0.24, now + 0.06);
    lowGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.3);
    lowOscillator.connect(lowGain);
    lowGain.connect(effectsGain);
    lowOscillator.start(now);
    lowOscillator.stop(now + 2.35);
  }

  async function playPersonnelDrop() {
    if (!(await start()) || muted || !context) return;
    const now = context.currentTime;
    createTone(196, now, 0.12, 0.08, effectsGain, 'sine');
    createTone(523.25, now + 0.035, 0.22, 0.13, effectsGain, 'sine');
    createTone(659.25, now + 0.11, 0.24, 0.11, effectsGain, 'sine');
    createTone(783.99, now + 0.19, 0.3, 0.09, effectsGain, 'triangle');
  }

  async function playClick() {
    if (!(await start()) || muted || !context) return;
    const now = context.currentTime;
    createTone(520, now, 0.075, 0.055, effectsGain, 'sine');
    createTone(760, now + 0.035, 0.105, 0.045, effectsGain, 'triangle');
  }

  async function playCorrectFeedback() {
    if (!(await start()) || muted || !context) return;
    const now = context.currentTime;
    createTone(523.25, now, 0.18, 0.105, effectsGain, 'sine');
    createTone(659.25, now + 0.07, 0.2, 0.1, effectsGain, 'sine');
    createTone(783.99, now + 0.14, 0.26, 0.09, effectsGain, 'triangle');
  }

  async function playIncorrectFeedback() {
    if (!(await start()) || muted || !context) return;
    const now = context.currentTime;
    createTone(246.94, now, 0.17, 0.09, effectsGain, 'triangle');
    createTone(174.61, now + 0.13, 0.24, 0.1, effectsGain, 'triangle');
  }

  async function playTimeoutFeedback() {
    if (!(await start()) || muted || !context) return;
    const now = context.currentTime;
    createTone(392, now, 0.11, 0.075, effectsGain, 'sine');
    createTone(293.66, now + 0.12, 0.14, 0.075, effectsGain, 'sine');
    createTone(196, now + 0.26, 0.24, 0.09, effectsGain, 'triangle');
  }

  async function playZoneComplete() {
    if (!(await start()) || muted || !context) return;
    const now = context.currentTime;
    createTone(392.00, now, 0.28, 0.1, effectsGain, 'sine');
    createTone(523.25, now + 0.1, 0.34, 0.13, effectsGain, 'sine');
    createTone(659.25, now + 0.2, 0.42, 0.12, effectsGain, 'triangle');
    createTone(783.99, now + 0.31, 0.56, 0.1, effectsGain, 'sine');
    createTone(1046.50, now + 0.43, 0.7, 0.075, effectsGain, 'triangle');
  }

  function destroy() {
    global.clearInterval(schedulerId);
    musicStarted = false;
    context?.close();
    context = null;
  }

  global.GameAudio = {
    start,
    toggle,
    setMuted,
    isMuted: () => muted,
    registerButton,
    playClick,
    playCorrectFeedback,
    playIncorrectFeedback,
    playTimeoutFeedback,
    playThunder,
    playPersonnelDrop,
    playZoneComplete,
    destroy
  };
})(window);
