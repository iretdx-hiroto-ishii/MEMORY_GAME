type ResultModalProps = {
  isOpen: boolean;
  point: number;
  maxCombo: number;
  animate: boolean;
  onClose: () => void;
};

const ResultModal = ({ isOpen, point, maxCombo, animate, onClose }: ResultModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="shadow-overlay">
      <div className="result-overlay">
        <div className="dialog-title-box">
          <h2 className="dialog-title">結果</h2>
        </div>
        <div className="result-row">
          <span className={animate ? 'result-text result-text--animate' : 'result-text'}>MAX COMBO: {maxCombo}</span>
          <span className={animate ? 'result-text result-text--animate' : 'result-text'}>POINT: {point}</span>
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
