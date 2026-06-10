import { useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync, type AudioSource } from 'expo-audio';
import { Asset } from 'expo-asset';
import i18n from '../i18n/config';
import { logger } from '../utils/logger';

const SOURCES = {
  it: require('../../assets/sounds/countdown-it.mp3'),
  en: require('../../assets/sounds/countdown-en.mp3'),
} as const;

// Lingua fissata all'avvio: i18n viene inizializzato dal locale del dispositivo
// e l'app non cambia lingua a runtime.
const LANG: keyof typeof SOURCES = i18n.language?.startsWith('it') ? 'it' : 'en';

// Deve combaciare con android.package di app.json
const ANDROID_PACKAGE = 'com.beybladex.score';

// In release Android l'asset embedded si risolve nel solo nome risorsa res/raw
// (es. "assets_sounds_countdownit"), che ExoPlayer non sa aprire (ENOENT).
// Con l'URI android.resource:// Media3 risolve la risorsa per nome via arsc.
// In dev (Metro server) l'uri è http:// e il require() number funziona com'è.
function resolvePlayableSource(mod: number): AudioSource | number {
  const asset = Asset.fromModule(mod);
  if (Platform.OS === 'android' && asset.uri && !asset.uri.includes('://')) {
    return { uri: `android.resource://${ANDROID_PACKAGE}/raw/${asset.uri}` };
  }
  return mod;
}

const SOURCE = resolvePlayableSource(SOURCES[LANG]);

export function useCountdownAudio() {
  const player = useAudioPlayer(SOURCE);
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    // duckOthers: abbassa l'eventuale audio di altre app durante il countdown.
    setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'duckOthers',
      shouldPlayInBackground: false,
    }).catch((e) => logger.error('Countdown setAudioModeAsync failed', e));
  }, []);

  const play = useCallback(() => {
    if (status.playing) return;
    if (!status.isLoaded) {
      // Caricamento mai completato (visto su boot instabili): ritenta la load,
      // il tap successivo riprodurrà.
      logger.warn('Countdown audio not loaded, retrying load', { lang: LANG });
      player.replace(SOURCE);
      return;
    }
    logger.info('Countdown audio play', { lang: LANG });
    player.seekTo(0);
    player.play();
  }, [player, status.playing, status.isLoaded]);

  return { play, isPlaying: status.playing };
}
