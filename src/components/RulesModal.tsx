type RulesModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const RulesModal = ({ isOpen, onClose }: RulesModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="shadow-overlay">
      <div className="rules-overlay" role="dialog" aria-modal="true" aria-label="遊び方">
        <div className="dialog-title-box">
          <h2 className="dialog-title">遊び方</h2>
        </div>
        <div className="rules-row">
          <ul>
            <li>ゲーム開始後の５秒間は絵柄を覚えるチャンス！</li>
            <li>同じ絵柄をそろえてポイントゲット！</li>
            <li>連続で正解するとコンボボーナス加算！</li>
            <li>制限時間は30秒！時間内にクリアするとタイムボーナス加算！</li>
          </ul>
        </div>
        <button className="close-button" onClick={onClose} aria-label="遊び方を閉じる">
          ❎
        </button>
      </div>
    </div>
  );
};

export default RulesModal;
