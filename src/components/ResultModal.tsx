type ResultModalProps = {
  isOpen: boolean;
  point: number;
  maxCombo: number;
  animate: boolean;
  onBackToTitle: () => void;
  onRetry: () => void;
  onClose: () => void;
};

const ResultModal = ({
  isOpen,
  point,
  maxCombo,
  animate,
  onBackToTitle,
  onRetry,
  onClose,
}: ResultModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="shadow-overlay">
      <div className="result-overlay">
        <div className="dialog-title-box">
          <h2 className="dialog-title">結果</h2>
        </div>
        <div className="result-row">
          <div className={animate ? 'result-text result-text--animate result-text--animate-first' : 'result-text'}>
            <span className="result-label">MAX COMBO</span>
            <span className="result-value">{maxCombo}</span>
          </div>
          <div className={animate ? 'result-text result-text--animate result-text--animate-second' : 'result-text'}>
            <span className="result-label">POINT</span>
            <span className="result-value">{point}</span>
          </div>
        </div>
        <div className="result-actions">
          <button type="button" className="menu-action-button" onClick={onRetry}>
            リトライ
          </button>
          <button type="button" className="menu-action-button" onClick={onBackToTitle}>
            タイトルに戻る
          </button>
        </div>
        <div className="record-box"></div>
        <button className="close-button" onClick={onClose} aria-label="結果を閉じる">
          ❎
        </button>
      </div>
    </div>
  );
};

export default ResultModal;
