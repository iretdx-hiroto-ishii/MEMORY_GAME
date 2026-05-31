import AppFooter from '../components/AppFooter';
import './title-screen.css';

type TitleScreenProps = {
  onStart: () => void;
  onOpenSettings: () => void;
  isStartDisabled: boolean;
  version: string;
};

const TitleScreen = ({
  onStart,
  onOpenSettings,
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
            START
          </button>
          <button
            type="button"
            className="title-screen__button title-screen__button--secondary"
            onClick={onOpenSettings}
            aria-label="設定を開く"
          >
            設定 ⚙
          </button>
        </div>
      </main>
      <AppFooter />
      <p className="title-screen__version">ver {version}</p>
    </div>
  );
};

export default TitleScreen;