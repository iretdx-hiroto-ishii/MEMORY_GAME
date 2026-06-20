import { CircleX } from 'lucide-react';

type PlayMenuModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onBackToTitle: () => void;
  onOpenHowTo: () => void;
  onOpenSettings: () => void;
  onRetry: () => void;
};

const PlayMenuModal = ({
  isOpen,
  onClose,
  onBackToTitle,
  onOpenHowTo,
  onOpenSettings,
  onRetry,
}: PlayMenuModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="shadow-overlay" onClick={onClose}>
      <div
        className="menu-overlay"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="メニュー"
      >
        <div className="dialog-title-box">
          <h2 className="dialog-title">メニュー</h2>
        </div>
        <div className="menu-row">
          <button type="button" className="menu-action-button" onClick={onRetry}>
            リトライ
          </button>
          <button type="button" className="menu-action-button" onClick={onOpenHowTo}>
            遊び方
          </button>
          <button type="button" className="menu-action-button" onClick={onOpenSettings}>
            設定
          </button>
          <button type="button" className="menu-action-button" onClick={onBackToTitle}>
            タイトルに戻る
          </button>
        </div>
        <button type="button" className="close-button" onClick={onClose} aria-label="メニューを閉じる">
          <CircleX size={32} strokeWidth={3} aria-hidden />
        </button>
      </div>
    </div>
  );
};

export default PlayMenuModal;