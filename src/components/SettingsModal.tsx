import './settings-modal.css';

const SettingsModal = ({
  isOpen,
  soundEnabled,
  volume,
  bgmVolume,
  onToggleSound,
  onVolumeChange,
  onVolumeCommit,
  onBgmVolumeChange,
  onClose,
}: {
  isOpen: boolean;
  soundEnabled: boolean;
  volume: number;
  bgmVolume: number;
  onToggleSound: () => void;
  onVolumeChange: (volume: number) => void;
  onVolumeCommit?: () => void;
  onBgmVolumeChange: (volume: number) => void;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div
        className="settings-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="音量設定"
      >
        <div className="settings-modal__title-box">
          <h2 className="settings-modal__title">設定</h2>
        </div>
        <div className="settings-modal__row">
          <span>サウンド</span>
          <button
            type="button"
            className="settings-modal__toggle"
            onClick={onToggleSound}
            aria-label="サウンドのオンオフ"
          >
            {soundEnabled ? 'オン' : 'オフ'}
          </button>
        </div>
        <div className={`settings-modal__row settings-modal__row--slider ${!soundEnabled ? 'settings-modal__row--disabled' : ''}`}>
          <label htmlFor="settings-volume">効果音</label>
          <input
            id="settings-volume"
            type="range"
            min={0}
            max={100}
            value={volume}
            disabled={!soundEnabled}
            onChange={(event) => onVolumeChange(Number(event.target.value))}
            onPointerUp={() => onVolumeCommit?.()}
            aria-label="効果音スライダー"
          />
          <span className="settings-modal__volume-value" aria-live="polite">
            <span className="settings-modal__volume-number">{volume}</span>
            <span className="settings-modal__volume-unit">%</span>
          </span>
        </div>
        <div className={`settings-modal__row settings-modal__row--slider ${!soundEnabled ? 'settings-modal__row--disabled' : ''}`}>
          <label htmlFor="settings-bgm-volume">BGM</label>
          <input
            id="settings-bgm-volume"
            type="range"
            min={0}
            max={100}
            value={bgmVolume}
            disabled={!soundEnabled}
            onChange={(event) => onBgmVolumeChange(Number(event.target.value))}
            aria-label="BGMスライダー"
          />
          <span className="settings-modal__volume-value" aria-live="polite">
            <span className="settings-modal__volume-number">{bgmVolume}</span>
            <span className="settings-modal__volume-unit">%</span>
          </span>
        </div>
        <button
          type="button"
          className="settings-modal__close"
          onClick={onClose}
          aria-label="設定を閉じる"
        >
          ❎
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
