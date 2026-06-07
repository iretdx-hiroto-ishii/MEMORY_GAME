type ConfirmModalProps = {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="shadow-overlay" onClick={onCancel}>
      <div
        className="confirm-overlay"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="確認"
      >
        <div className="dialog-title-box">
          <h2 className="dialog-title">確認</h2>
        </div>
        <p className="confirm-message">{message}</p>
        <div className="confirm-row">
          <button type="button" className="menu-action-button confirm-action-button confirm-action-button--ok" onClick={onConfirm}>
            ＯＫ
          </button>
          <button type="button" className="menu-action-button confirm-action-button" onClick={onCancel}>
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;