import { useEffect, useState } from 'react';

type GameSettings = {
  soundEnabled: boolean;
  volume: number;
};

const STORAGE_KEY = 'match-monster-settings';

const defaultSettings: GameSettings = {
  soundEnabled: true,
  volume: 70,
};

const clampVolume = (volume: number) => Math.min(100, Math.max(0, volume));

const loadSettings = (): GameSettings => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw == null) return defaultSettings;

    const parsed = JSON.parse(raw) as Partial<GameSettings>;
    return {
      soundEnabled: parsed.soundEnabled ?? defaultSettings.soundEnabled,
      volume:
        typeof parsed.volume === 'number'
          ? clampVolume(parsed.volume)
          : defaultSettings.volume,
    };
  } catch {
    return defaultSettings;
  }
};

export const useGameSettings = () => {
  const [settings, setSettings] = useState<GameSettings>(loadSettings);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // localStorage access failure should not block gameplay.
    }
  }, [settings]);

  const setSoundEnabled = (soundEnabled: boolean) => {
    setSettings((prev) => ({ ...prev, soundEnabled }));
  };

  const setVolume = (volume: number) => {
    setSettings((prev) => ({ ...prev, volume: clampVolume(volume) }));
  };

  return {
    settings,
    setSoundEnabled,
    setVolume,
  };
};