import AppFooter from '../components/AppFooter';
import './title-screen.css';

type TitleScreenProps = {
  onStart: () => void;
  onOpenSettings: () => void;
  onOpenHowTo: () => void;
  onOpenPlayRecord: () => void;
  isStartDisabled: boolean;
  version: string;
};

const TitleScreen = ({
  onStart,
  onOpenSettings,
  onOpenHowTo,
  onOpenPlayRecord,
  isStartDisabled,
  version,
}: TitleScreenProps) => {
  return (
    <div className="title-screen">
      <main className="title-screen__content">
        <h1 className="title-screen__logo">Match Monster</h1>
        <div className="title-screen__actions">
          <button
            type="button"
            className="title-screen__button"
            onClick={onStart}
            disabled={isStartDisabled}
            aria-label="ゲームを開始"
          >
            スタート
          </button>
          <button
            type="button"
            className="title-screen__button title-screen__button--secondary"
            onClick={onOpenHowTo}
            aria-label="遊び方を見る"
          >
            遊び方
          </button>
          <button
            type="button"
            className="title-screen__button title-screen__button--secondary"
            onClick={onOpenPlayRecord}
            aria-label="プレイ記録を見る"
          >
            プレイ記録
          </button>
          <button
            type="button"
            className="title-screen__button title-screen__button--secondary"
            onClick={onOpenSettings}
            aria-label="設定を開く"
          >
            設定
          </button>
          <button
            type="button"
            className="title-screen__button title-screen__button--secondary title-screen__button--policy"
            onClick={() => window.location.assign('/privacy-policy.html')}
            aria-label="プライバシーポリシーを開く"
          >
            プライバシーポリシー
          </button>
        </div>
      </main>
      <AppFooter />
      <p className="title-screen__version">ver {version}</p>
    </div>
  );
};

export default TitleScreen;