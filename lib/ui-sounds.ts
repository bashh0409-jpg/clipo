const sounds = new Map<string, HTMLAudioElement>();
const ambientTrackSources = [
  "/Gentle_ambient_hum_w_%232-1793906497566.wav",
  "/Gentle_ambient_hum_w_%232-1793906497566.wav",
];
const ambientTracks: HTMLAudioElement[] = [];
const AMBIENT_VOLUME = 0.1;
const CROSSFADE_DURATION_MS = 1_800;
const SOUND_PREFERENCE_KEY = "veyra-sounds-enabled";
const SOUND_PREFERENCE_EVENT = "veyra-sound-preference-change";
const SMALL_SCREEN_QUERY = "(max-width: 767px)";
let soundEnabled = true;
let ambientTrackIndex = 0;
let ambientPlayCount = 0;
let ambientTransitionStarted = false;
let crossfadeTimer: ReturnType<typeof setInterval> | null = null;

function getAmbientTrack(index: number) {
  let audio = ambientTracks[index];
  if (audio) return audio;

  audio = new Audio(ambientTrackSources[index]);
  audio.preload = "auto";
  audio.volume = AMBIENT_VOLUME;
  audio.addEventListener("ended", () => {
    handleAmbientTrackEnded(index);
  });
  audio.addEventListener("timeupdate", () => {
    if (
      index !== ambientTrackIndex ||
      ambientPlayCount !== 1 ||
      ambientTransitionStarted ||
      !getUiSoundEnabled() ||
      !Number.isFinite(audio.duration)
    ) {
      return;
    }

    if (audio.duration - audio.currentTime <= CROSSFADE_DURATION_MS / 1000) {
      startAmbientCrossfade(index);
    }
  });
  ambientTracks[index] = audio;
  return audio;
}

function playAmbientTrack(index: number, volume = AMBIENT_VOLUME) {
  const audio = getAmbientTrack(index);
  audio.volume = volume;
  void audio.play().catch((error: unknown) => {
    if (error instanceof DOMException && error.name === "NotAllowedError") {
      return;
    }
    console.error(`Unable to play ambient sound: ${ambientTrackSources[index]}`, error);
  });
}

function startAmbientCrossfade(index: number) {
  if (ambientTransitionStarted || !getUiSoundEnabled()) return;

  const nextIndex = (index + 1) % ambientTrackSources.length;
  const currentAudio = getAmbientTrack(index);
  const nextAudio = getAmbientTrack(nextIndex);
  ambientTransitionStarted = true;
  nextAudio.currentTime = 0;
  playAmbientTrack(nextIndex, 0);

  const startedAt = performance.now();
  crossfadeTimer = setInterval(() => {
    const progress = Math.min(
      (performance.now() - startedAt) / CROSSFADE_DURATION_MS,
      1,
    );
    currentAudio.volume = AMBIENT_VOLUME * (1 - progress);
    nextAudio.volume = AMBIENT_VOLUME * progress;

    if (progress === 1 && crossfadeTimer) {
      clearInterval(crossfadeTimer);
      crossfadeTimer = null;
    }
  }, 50);
}

function handleAmbientTrackEnded(index: number) {
  if (index !== ambientTrackIndex || !getUiSoundEnabled()) return;

  const currentAudio = getAmbientTrack(index);
  ambientPlayCount += 1;
  if (ambientPlayCount < 2) {
    currentAudio.currentTime = 0;
    playAmbientTrack(index);
    return;
  }

  const nextIndex = (index + 1) % ambientTrackSources.length;
  if (crossfadeTimer) clearInterval(crossfadeTimer);
  crossfadeTimer = null;
  currentAudio.pause();
  currentAudio.volume = AMBIENT_VOLUME;
  ambientTrackIndex = nextIndex;
  ambientPlayCount = 0;
  ambientTransitionStarted = false;

  const nextAudio = getAmbientTrack(nextIndex);
  if (nextAudio.paused) {
    nextAudio.currentTime = 0;
    playAmbientTrack(nextIndex);
  } else {
    nextAudio.volume = AMBIENT_VOLUME;
  }
}

export function startAmbientSound() {
  if (typeof window === "undefined" || !getUiSoundEnabled()) return;

  const audio = getAmbientTrack(ambientTrackIndex);
  if (audio.paused) playAmbientTrack(ambientTrackIndex);
}

function stopAmbientSound() {
  if (crossfadeTimer) clearInterval(crossfadeTimer);
  crossfadeTimer = null;
  ambientTransitionStarted = false;
  ambientTracks.forEach((audio, index) => {
    if (!audio) return;
    audio.pause();
    audio.volume = AMBIENT_VOLUME;
    if (index !== ambientTrackIndex) audio.currentTime = 0;
  });
}

export function getUiSoundEnabled() {
  if (typeof window === "undefined") return true;

  try {
    const preference = window.localStorage.getItem(SOUND_PREFERENCE_KEY);
    if (preference !== null) soundEnabled = preference === "true";
  } catch (error) {
    console.warn("Unable to read the sound preference.", error);
  }

  return soundEnabled && !window.matchMedia(SMALL_SCREEN_QUERY).matches;
}

export function subscribeToUiSoundPreference(callback: () => void) {
  const smallScreen = window.matchMedia(SMALL_SCREEN_QUERY);
  const handleScreenChange = () => {
    if (smallScreen.matches) stopAmbientSound();
    callback();
  };

  window.addEventListener(SOUND_PREFERENCE_EVENT, callback);
  smallScreen.addEventListener("change", handleScreenChange);
  return () => {
    window.removeEventListener(SOUND_PREFERENCE_EVENT, callback);
    smallScreen.removeEventListener("change", handleScreenChange);
  };
}

export function setUiSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(SOUND_PREFERENCE_KEY, String(enabled));
    }
  } catch (error) {
    console.warn("Unable to save the sound preference.", error);
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(SOUND_PREFERENCE_EVENT));
  }
  if (enabled) startAmbientSound();
  else stopAmbientSound();
}

export function playUiSound(source: string) {
  if (typeof window === "undefined" || !getUiSoundEnabled()) return;

  let audio = sounds.get(source);
  if (!audio) {
    audio = new Audio(source);
    audio.preload = "auto";
    audio.volume = 0.25;
    sounds.set(source, audio);
  }

  audio.currentTime = 0;
  void audio.play().catch((error: unknown) => {
    if (error instanceof DOMException && error.name === "NotAllowedError") {
      return;
    }
    console.error(`Unable to play UI sound: ${source}`, error);
  });
}
