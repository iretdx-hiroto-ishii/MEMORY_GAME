/**
 * 効果音・BGM の再生管理。
 * 効果音: docs/design/sound-effects.md
 * BGM: docs/design/bgm.md
 *
 * 音量は Web Audio API の GainNode で制御する（iOS では HTMLAudioElement.volume が無効なため）。
 */
import bgmTrack from '../assets/music/Imaginary_Mind.mp3';
import closeSound from '../assets/sounds/close.mp3';
import countSound from '../assets/sounds/count.mp3';
import finishSound from '../assets/sounds/finish.mp3';
import flipSound from '../assets/sounds/flip.mp3';
import missSound from '../assets/sounds/miss.mp3';
import okSound from '../assets/sounds/ok.mp3';
import resultSound from '../assets/sounds/result.mp3';
import startSound from '../assets/sounds/start.mp3';
import successSound from '../assets/sounds/success.mp3';

export type SoundId =
  | 'close'
  | 'count'
  | 'finish'
  | 'flip'
  | 'miss'
  | 'ok'
  | 'result'
  | 'start'
  | 'success';

export type AudioSettings = {
  soundEnabled: boolean;
  volume: number;
  bgmVolume: number;
};

const soundSources: Record<SoundId, string> = {
  close: closeSound,
  count: countSound,
  finish: finishSound,
  flip: flipSound,
  miss: missSound,
  ok: okSound,
  result: resultSound,
  start: startSound,
  success: successSound,
};

class AudioService {
  private enabled = true;
  private seVolume = 0.7;
  private bgmVolume = 0.7;
  private bgmActive = true;
  private context: AudioContext | null = null;
  private seGainNode: GainNode | null = null;
  private bgmGainNode: GainNode | null = null;
  private buffers = new Map<SoundId, AudioBuffer>();
  private bgmBuffer: AudioBuffer | null = null;
  private bgmSource: AudioBufferSourceNode | null = null;
  private preloadPromise: Promise<void> | null = null;
  private bgmLoadPromise: Promise<void> | null = null;

  configure({ soundEnabled, volume, bgmVolume }: AudioSettings) {
    this.enabled = soundEnabled;
    this.seVolume = this.toGain(volume);
    this.bgmVolume = this.toGain(bgmVolume);

    if (this.seGainNode) {
      this.seGainNode.gain.value = this.seVolume;
    }

    this.syncBgm();
  }

  setBgmActive(active: boolean) {
    this.bgmActive = active;
    this.syncBgm();
  }

  preload() {
    if (!this.preloadPromise) {
      this.preloadPromise = Promise.all([this.loadSounds(), this.loadBgm()]).then(
        () => undefined,
      );
    }
    return this.preloadPromise;
  }

  /** ユーザー操作の同期的なタイミングで呼び、AudioContext のロック解除と BGM 開始を試みる。 */
  unlockFromUserGesture() {
    const context = this.ensureContext();
    void this.preload();

    const startIfReady = () => {
      if (this.enabled && this.bgmActive) {
        void this.startBgm();
      }
    };

    if (context.state === 'suspended') {
      void context.resume().then(startIfReady);
      return;
    }

    startIfReady();
  }

  play(soundId: SoundId) {
    if (!this.enabled) return;
    void this.playSound(soundId).then(() => {
      if (this.enabled && this.bgmActive && !this.bgmSource) {
        void this.startBgm();
      }
    });
  }

  private toGain(volume: number) {
    return Math.min(1, Math.max(0, volume / 100));
  }

  private syncBgm() {
    if (!this.enabled || !this.bgmActive) {
      this.stopBgm();
      return;
    }

    if (this.bgmGainNode) {
      this.bgmGainNode.gain.value = this.bgmVolume;
    }

    void this.startBgm();
  }

  private stopBgm() {
    if (!this.bgmSource) return;

    try {
      this.bgmSource.stop();
    } catch {
      // already stopped
    }
    this.bgmSource.disconnect();
    this.bgmSource = null;
  }

  private async startBgm() {
    if (!this.enabled || !this.bgmActive) return;

    try {
      await this.loadBgm();
      await this.resumeContext();

      if (this.bgmSource) {
        if (this.bgmGainNode) {
          this.bgmGainNode.gain.value = this.bgmVolume;
        }
        return;
      }

      const context = this.context;
      const bgmGainNode = this.bgmGainNode;
      const buffer = this.bgmBuffer;
      if (!context || !bgmGainNode || !buffer) return;

      const source = context.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(bgmGainNode);
      source.start(0);
      this.bgmSource = source;
      bgmGainNode.gain.value = this.bgmVolume;
    } catch {
      // BGM decode or playback failure should not block gameplay.
    }
  }

  private ensureContext(): AudioContext {
    if (!this.context) {
      this.context = new AudioContext();
      this.seGainNode = this.context.createGain();
      this.bgmGainNode = this.context.createGain();
      this.seGainNode.gain.value = this.seVolume;
      this.bgmGainNode.gain.value = 0;
      this.seGainNode.connect(this.context.destination);
      this.bgmGainNode.connect(this.context.destination);
    }
    return this.context;
  }

  private async resumeContext() {
    const context = this.ensureContext();
    if (context.state === 'suspended') {
      await context.resume();
    }
  }

  private async loadSounds() {
    const context = this.ensureContext();
    await Promise.all(
      (Object.keys(soundSources) as SoundId[]).map(async (soundId) => {
        if (this.buffers.has(soundId)) return;

        const response = await fetch(soundSources[soundId]);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await context.decodeAudioData(arrayBuffer);
        this.buffers.set(soundId, audioBuffer);
      }),
    );
  }

  private async loadBgm() {
    if (this.bgmBuffer) return;

    if (!this.bgmLoadPromise) {
      this.bgmLoadPromise = this.fetchBgm();
    }
    await this.bgmLoadPromise;
  }

  private async fetchBgm() {
    const context = this.ensureContext();
    const response = await fetch(bgmTrack);
    const arrayBuffer = await response.arrayBuffer();
    this.bgmBuffer = await context.decodeAudioData(arrayBuffer);
  }

  private async playSound(soundId: SoundId) {
    try {
      await this.preload();
      await this.resumeContext();

      const context = this.context;
      const seGainNode = this.seGainNode;
      const buffer = this.buffers.get(soundId);
      if (!context || !seGainNode || !buffer) return;

      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(seGainNode);
      source.start(0);
    } catch {
      // Audio decode or playback failure should not block gameplay.
    }
  }
}

export const audioService = new AudioService();
