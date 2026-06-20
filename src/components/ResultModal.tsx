import { CircleX } from 'lucide-react';

type ResultModalProps = {
  isOpen: boolean;
  point: number;
  maxCombo: number;
  timeBonus: number;
  hiSpeedBonus: number;
  animate: boolean;
  onBackToTitle: () => void;
  onRetry: () => void;
  onClose: () => void;
};

const ResultModal = ({
  isOpen,
  point,
  maxCombo,
  timeBonus,
  hiSpeedBonus,
  animate,
  onBackToTitle,
  onRetry,
  onClose,
}: ResultModalProps) => {
  if (!isOpen) return null;

  const totalAnimationClass = hiSpeedBonus > 0 ? 'result-text--animate-fifth' : 'result-text--animate-fourth';

  return (
    <div className="shadow-overlay">
      <div className="result-overlay">
        <div className="dialog-title-box">
          <h2 className="dialog-title">結果</h2>
        </div>
        <div className="result-summary">
          <div className={animate ? 'result-summary__row result-text--animate result-text--animate-first' : 'result-summary__row'}>
            <span className="result-summary__label">MAX COMBO</span>
            <span className="result-summary__value">{maxCombo}</span>
          </div>
          <div className={animate ? 'result-summary__row result-text--animate result-text--animate-second' : 'result-summary__row'}>
            <span className="result-summary__label">POINT</span>
            <span className="result-summary__value">{point}</span>
          </div>
          <div className={animate ? 'result-summary__row result-text--animate result-text--animate-third' : 'result-summary__row'}>
            <span className="result-summary__label">BONUS</span>
            <span className="result-summary__value">{timeBonus}</span>
          </div>
          {hiSpeedBonus > 0 && (
            <div className={animate ? 'result-summary__row result-text--animate result-text--animate-fourth' : 'result-summary__row'}>
              <span className="result-summary__label">HISPEED BONUS</span>
              <span className="result-summary__value">{hiSpeedBonus}</span>
            </div>
          )}
        </div>
        <div className="result-divider" aria-hidden="true" />
        <div className={animate ? `result-total result-text--animate ${totalAnimationClass}` : 'result-total'}>
          <span className="result-total__label">TOTAL SCORE</span>
          <span className="result-total__value">{point + timeBonus + hiSpeedBonus}</span>
        </div>
        <div className="result-divider" aria-hidden="true" />
        <div className="result-actions">
          <button type="button" className="menu-action-button" onClick={onRetry}>
            リトライ
          </button>
          <button type="button" className="menu-action-button" onClick={onBackToTitle}>
            タイトルに戻る
          </button>
        </div>
        <button className="close-button" onClick={onClose} aria-label="結果を閉じる">
          <CircleX size={32} strokeWidth={3} aria-hidden />
        </button>
      </div>
    </div>
  );
};

export default ResultModal;
