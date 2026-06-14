export type PlayRecords = {
  bestScore: number;
  bestTimeSec: number | null;
  totalScore: number;
  totalPlays: number;
  totalPlayTimeSec: number;
};

type UpdatePlayRecordsInput = {
  totalScore: number;
  elapsedSec: number;
  cleared: boolean;
};

type AppStorage = {
  records: PlayRecords;
};

const STORAGE_KEY = 'match-monster-data';

const defaultPlayRecords: PlayRecords = {
  bestScore: 0,
  bestTimeSec: null,
  totalScore: 0,
  totalPlays: 0,
  totalPlayTimeSec: 0,
};

const asNonNegativeInt = (value: unknown, fallback: number) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  return Math.max(0, Math.floor(value));
};

const normalizePlayRecords = (value: Partial<PlayRecords> | null | undefined): PlayRecords => {
  if (value == null) return defaultPlayRecords;

  const bestTimeSec =
    typeof value.bestTimeSec === 'number' && Number.isFinite(value.bestTimeSec)
      ? Math.max(0, Math.floor(value.bestTimeSec))
      : null;

  return {
    bestScore: asNonNegativeInt(value.bestScore, defaultPlayRecords.bestScore),
    bestTimeSec,
    totalScore: asNonNegativeInt(value.totalScore, defaultPlayRecords.totalScore),
    totalPlays: asNonNegativeInt(value.totalPlays, defaultPlayRecords.totalPlays),
    totalPlayTimeSec: asNonNegativeInt(
      value.totalPlayTimeSec,
      defaultPlayRecords.totalPlayTimeSec,
    ),
  };
};

const buildAppStorage = (records: PlayRecords): AppStorage => ({
  records,
});

export const loadPlayRecords = (): PlayRecords => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw == null) return defaultPlayRecords;

    const parsed = JSON.parse(raw) as Partial<AppStorage>;
    return normalizePlayRecords(parsed.records);
  } catch {
    return defaultPlayRecords;
  }
};

export const savePlayRecords = (records: PlayRecords) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(buildAppStorage(records)));
  } catch {
    // localStorage access failure should not break gameplay.
  }
};

export const updatePlayRecords = (
  current: PlayRecords,
  input: UpdatePlayRecordsInput,
): PlayRecords => {
  const normalizedScore = Math.max(0, Math.floor(input.totalScore));
  const normalizedElapsedSec = Math.max(0, Math.floor(input.elapsedSec));

  const nextBestTimeSec =
    input.cleared
      ? current.bestTimeSec == null
        ? normalizedElapsedSec
        : Math.min(current.bestTimeSec, normalizedElapsedSec)
      : current.bestTimeSec;

  return {
    bestScore: Math.max(current.bestScore, normalizedScore),
    bestTimeSec: nextBestTimeSec,
    totalScore: current.totalScore + normalizedScore,
    totalPlays: current.totalPlays + 1,
    totalPlayTimeSec: current.totalPlayTimeSec + normalizedElapsedSec,
  };
};

const pad2 = (value: number) => String(value).padStart(2, '0');

export const formatBestTime = (bestTimeSec: number | null) => {
  if (bestTimeSec == null) return '--:--';
  const minutes = Math.floor(bestTimeSec / 60);
  const seconds = bestTimeSec % 60;
  return `${pad2(minutes)}:${pad2(seconds)}`;
};

export const formatTotalPlayTime = (totalPlayTimeSec: number) => {
  const hours = Math.floor(totalPlayTimeSec / 3600);
  const minutes = Math.floor((totalPlayTimeSec % 3600) / 60);
  const seconds = totalPlayTimeSec % 60;
  return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
};
