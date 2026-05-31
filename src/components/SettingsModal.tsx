import './settings-modal.css';

type SettingsModalProps = {
  isOpen: boolean;
  soundEnabled: boolean;
  volume: number;
  onToggleSound: () => void;
  onVolumeChange: (volume: number) => void;
  onClose: () => void;
};

const SettingsModal = ({
  isOpen,
  soundEnabled,
  volume,
  onToggleSound,
  onVolumeChange,
  onClose,
}: SettingsModalProps) => {
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
            {soundEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
        <div className="settings-modal__row settings-modal__row--slider">
          <label htmlFor="settings-volume">音量</label>
          <input
            id="settings-volume"
            type="range"
            min={0}
            max={100}
            value={volume}
            disabled={!soundEnabled}
            onChange={(event) => onVolumeChange(Number(event.target.value))}
            aria-label="音量スライダー"
          />
          <span>{volume}%</span>
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