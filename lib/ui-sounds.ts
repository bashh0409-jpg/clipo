const sounds = new Map<string, HTMLAudioElement>();
const SOUND_PREFERENCE_KEY = "veyra-sounds-enabled";
const SOUND_PREFERENCE_EVENT = "veyra-sound-preference-change";
const SMALL_SCREEN_QUERY = "(max-width: 767px)";
let soundEnabled = true;

function stopAmbientSound() {
  // Ambient audio has been disabled.
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
  if (!enabled) stopAmbientSound();
}

export function playUiSound(source: string) {
  if (typeof window === "undefined" || !getUiSoundEnabled()) return;

  let audio = sounds.get(source);
  if (!audio) {
    audio = new Audio(source);
    audio.preload = "auto";
    audio.volume = 0.11;
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
