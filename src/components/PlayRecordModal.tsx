import {
  formatBestTime,
  formatTotalPlayTime,
  type PlayRecords,
} from '../constants/playRecords';
import './play-record-modal.css';

type PlayRecordModalProps = {
  isOpen: boolean;
  records: PlayRecords;
  onClose: () => void;
};

const formatScore = (value: number) => value.toLocaleString('ja-JP');

const PlayRecordModal = ({ isOpen, records, onClose }: PlayRecordModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="play-record-overlay" onClick={onClose}>
      <div
        className="play-record-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="プレイ記録"
      >
        <div className="play-record-modal__title-box">
          <h2 className="play-record-modal__title">プレイ記録</h2>
        </div>

        <dl className="play-record-modal__list">
          <div className="play-record-modal__row">
            <dt>ベストスコア</dt>
            <dd>{formatScore(records.bestScore)}</dd>
          </div>
          <div className="play-record-modal__row">
            <dt>ベストタイム</dt>
            <dd>{formatBestTime(records.bestTimeSec)}</dd>
          </div>
          <div className="play-record-modal__row">
            <dt>累計獲得スコア</dt>
            <dd>{formatScore(records.totalScore)}</dd>
          </div>
          <div className="play-record-modal__row">
            <dt>総プレイ回数</dt>
            <dd>{formatScore(records.totalPlays)}</dd>
          </div>
          <div className="play-record-modal__row">
            <dt>総プレイ時間</dt>
            <dd>{formatTotalPlayTime(records.totalPlayTimeSec)}</dd>
          </div>
        </dl>

        <button
          type="button"
          className="play-record-modal__close"
          onClick={onClose}
          aria-label="プレイ記録を閉じる"
        >
          ❎
        </button>
      </div>
    </div>
  );
};

export default PlayRecordModal;
