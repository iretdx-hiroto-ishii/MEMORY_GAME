import { useState, useEffect, useRef } from 'react';
import './App.css';
import StatusBar from "./StatusBar";
import AppFooter from './components/AppFooter';
import ConfirmModal from './components/ConfirmModal';
import PlayRecordModal from './components/PlayRecordModal';
import PlayMenuModal from './components/PlayMenuModal';
import ResultModal from './components/ResultModal';
import RulesModal from './components/RulesModal';
import SettingsModal from './components/SettingsModal';
import TopAdBanner from './components/TopAdBanner';
import {
  loadPlayRecords,
  savePlayRecords,
  updatePlayRecords,
} from './constants/playRecords';
import TitleScreen from './screens/TitleScreen';
import { useGameSettings } from './hooks/useGameSettings';
import { audioService } from './services/audioService';
import cardBackImage from './assets/images/card-back.png';

const images = import.meta.glob('/src/assets/images/monsters/*.PNG', { eager: true }) as Record<string, { default: string }>;
const allIcons = Object.values(images).map((mod) => mod.default);
const basePoint = 10;
const timerInitialSeconds = 30;
const APP_VERSION = '1.1.1';

type AppScreen = 'title' | 'play';
type ConfirmAction = 'none' | 'backToTitle' | 'retry';
type ResultMessage = 'none' | 'excellent' | 'great' | 'clear' | 'timeUp';
type PreResultCue = Exclude<ResultMessage, 'none'>;

interface Card {
  id: number,
  icon: string,
  flipped: boolean,
  matched: boolean,
}

const createShuffledCards = (): Card[] => {
  const icons = allIcons.sort(() => Math.random() - 0.5).slice(0, 8); 
  const shuffled = [...icons, ...icons].sort(() => Math.random() - 0.5);
  return shuffled.map((icon, index) => ({
    id: index,
    icon,
    flipped: false,
    matched: false,
  }));
};

function App() {
  useEffect(() => {
    allIcons.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);
  
  const shuffledCardsRef = useRef(createShuffledCards());
  const [cards, setCards] = useState(shuffledCardsRef.current);
  const [selected, setSelected] = useState<number[]>([]);
  const [point, setPoint] = useState(0);
  const [comboCount, setComboCount] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timerInitialSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isTimeOver, setIsTimeOver] = useState(false);
  const [timeBonus, setTimeBonus] = useState(0);
  const [hiSpeedBonus, setHiSpeedBonus] = useState(0);
  const [preResultCue, setPreResultCue] = useState<ResultMessage>('none');
  const [isResetting, setIsResetting] = useState(false);
  const [countdown, setCountdown] = useState<number | string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isViewResult, setIsViewResult] = useState(false);
  const [animateResult, setAnimateResult] = useState(false);
  const [isViewMenu, setIsViewMenu] = useState(false);
  const [isViewConfirm, setIsViewConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>('none');
  const [returnMenuOnRulesClose, setReturnMenuOnRulesClose] = useState(false);
  const [returnMenuOnSettingsClose, setReturnMenuOnSettingsClose] = useState(false);
  const [isViewRules, setIsViewRules] = useState(false);
  const [appScreen, setAppScreen] = useState<AppScreen>('title');
  const [isViewSettings, setIsViewSettings] = useState(false);
  const [isViewPlayRecord, setIsViewPlayRecord] = useState(false);
  const [isStartingGame, setIsStartingGame] = useState(false);
  const [playRecords, setPlayRecords] = useState(loadPlayRecords);
  const hasRecordedCurrentGameRef = useRef(false);
  const hasPlayedResultSoundRef = useRef(false);
  const { settings, setSoundEnabled, setVolume, setBgmVolume } = useGameSettings();

  useEffect(() => {
    audioService.preload();
  }, []);

  useEffect(() => {
    audioService.setBgmActive(true);
    return () => {
      audioService.setBgmActive(false);
    };
  }, []);

  useEffect(() => {
    audioService.configure({
      soundEnabled: settings.soundEnabled,
      volume: settings.volume,
      bgmVolume: settings.bgmVolume,
    });
  }, [settings.soundEnabled, settings.volume, settings.bgmVolume]);

  useEffect(() => {
    setCards(shuffledCardsRef.current);
  }, []);

  const showPreResultCue = (message: PreResultCue) => {
    audioService.play('finish');
    setPreResultCue(message);
    window.setTimeout(() => {
      setPreResultCue('none');
      setAnimateResult(true);
      setIsViewResult(true);
      if (!hasPlayedResultSoundRef.current) {
        audioService.play('result');
        hasPlayedResultSoundRef.current = true;
      }
    }, 1700);
  };

  const getClearCueAndHiSpeedBonus = (remainingSeconds: number) => {
    const elapsedSeconds = timerInitialSeconds - remainingSeconds;
    if (elapsedSeconds <= 10) {
      return { cue: 'excellent' as const, bonus: 500 };
    }
    if (elapsedSeconds <= 20) {
      return { cue: 'great' as const, bonus: 100 };
    }
    return { cue: 'clear' as const, bonus: 0 };
  };

  useEffect(() => {
    if (!isTimerRunning || isFinished || isTimeOver) return;
    if (timeLeft <= 0) return;

    const timeoutId = window.setTimeout(() => {
      setTimeLeft((currentTime) => Math.max(currentTime - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [isTimerRunning, isFinished, isTimeOver, timeLeft]);

  useEffect(() => {
    if (!isTimerRunning || isFinished || isTimeOver) return;
    if (timeLeft >= 1 && timeLeft <= 5) {
      audioService.play('count');
    }
  }, [timeLeft, isTimerRunning, isFinished, isTimeOver]);

  useEffect(() => {
    if (timeLeft !== 0 || isFinished || isTimeOver) return;

    setIsTimerRunning(false);
    setIsTimeOver(true);
    setTimeBonus(0);
    setHiSpeedBonus(0);
    showPreResultCue('timeUp');
  }, [timeLeft, isFinished, isTimeOver]);

  useEffect(() => {
    if (isFinished || isTimeOver) {
      setIsTimerRunning(false);
    }
  }, [isFinished, isTimeOver]);

  useEffect(() => {
    const hasGameEnded = isFinished || isTimeOver;
    if (!hasGameEnded || hasRecordedCurrentGameRef.current) return;

    const totalScore = point + timeBonus + hiSpeedBonus;
    const elapsedSec = Math.max(timerInitialSeconds - timeLeft, 0);
    const cleared = isFinished && !isTimeOver;

    setPlayRecords((current) => {
      const next = updatePlayRecords(current, {
        totalScore,
        elapsedSec,
        cleared,
      });
      savePlayRecords(next);
      return next;
    });

    hasRecordedCurrentGameRef.current = true;
  }, [isFinished, isTimeOver, point, timeBonus, hiSpeedBonus, timeLeft]);

  const flipCard = (index: number) => {
    if (isResetting) return; // リセット中は何もしない
    if (cards[index].flipped || cards[index].matched || selected.length === 2) return;
    if (isTimeOver) return;

    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    const newSelected = [...selected, index];
    setSelected(newSelected);

    if (newSelected.length === 1) {
      audioService.play('flip');
    }

    if (newSelected.length === 2) {
      const [i1, i2] = newSelected;
      if (cards[i1].icon === cards[i2].icon) {
        audioService.play('success');
        // 一致
        const addingPoints = basePoint + comboCount * basePoint;
        const newCombo = comboCount + 1;
        setPoint((prev) => prev + addingPoints); // ポイント加算
        setComboCount(newCombo);
        if(maxCombo < newCombo) setMaxCombo(newCombo);
        const updated = [...newCards];
        updated[i1] = { ...updated[i1], matched: true };
        updated[i2] = { ...updated[i2], matched: true };
        setCards(updated);
        setSelected([]);
      } else {
        audioService.play('miss');
        // 不一致→元に戻す
        setComboCount(0);
        setTimeout(() => {
          const updated = [...cards];
          updated[i1].flipped = false;
          updated[i2].flipped = false;
          setCards(updated);
          setSelected([]);
        }, 600);
      }
    }

    checkFinished();
  };

  const checkFinished = () => {
    if (isFinished || isTimeOver) return;
    if (!cards.find(card => card.flipped == false)) {
      if (timeLeft <= 0) {
        setTimeBonus(0);
        setHiSpeedBonus(0);
        showPreResultCue('timeUp');
        setIsTimerRunning(false);
        setIsFinished(true);
        return;
      }

      const earnedTimeBonus = timeLeft * 10;
      const clearResult = getClearCueAndHiSpeedBonus(timeLeft);
      setTimeBonus(earnedTimeBonus);
      setHiSpeedBonus(clearResult.bonus);
      showPreResultCue(clearResult.cue);
      setIsTimerRunning(false);
      setIsFinished(true);
    }
  }

  const resetGame = () => {
    if (isResetting) return; // リセット中は何もしない
    audioService.play('start');
    hasRecordedCurrentGameRef.current = false;
    hasPlayedResultSoundRef.current = false;
    setCountdown('ready...');
    setIsResetting(true);
    setTimeLeft(timerInitialSeconds);
    setIsTimerRunning(false);
    setIsTimeOver(false);
    setTimeBonus(0);
    setHiSpeedBonus(0);
    setPreResultCue('none');
    resetParameter();

    shuffledCardsRef.current = createShuffledCards();

    const hiddenCards = shuffledCardsRef.current.map(card => {
      if(!card.flipped) return card; 
      return {
        ...card,
        flipped: false
      };
    });
    setCards(hiddenCards);

    let counter = 3;
    const interval = setInterval(() => {
      if (counter === 0) {
        clearInterval(interval);
        setCountdown(null);
        showCards();

      } else {
        setCountdown(counter);
      }
      counter--;
    }, 1000);
  };

  const dismissResult = () => {
    setIsViewResult(false);
    setAnimateResult(false);
  };

  const closeResult = () => {
    audioService.play('close');
    dismissResult();
  }

  const retryFromResult = () => {
    dismissResult();
    setIsViewMenu(false);
    setReturnMenuOnRulesClose(false);
    setReturnMenuOnSettingsClose(false);
    resetGame();
  }

  const backToTitleFromResult = () => {
    audioService.play('ok');
    dismissResult();
    backToTitleFromMenu();
  }

  const openResult = () => {
    if (!isFinished && !isTimeOver) return;
    audioService.play('ok');
    setIsViewResult(true)
  }

  const openMenu = () => {
    audioService.play('ok');
    setIsViewMenu(true);
  }

  const closeMenu = () => {
    audioService.play('close');
    setIsViewMenu(false);
  }

  const backToTitleFromMenu = () => {
    setIsViewMenu(false);
    setReturnMenuOnRulesClose(false);
    setReturnMenuOnSettingsClose(false);
    setIsViewResult(false);
    setAnimateResult(false);
    setIsTimerRunning(false);
    setIsTimeOver(false);
    setTimeLeft(timerInitialSeconds);
    setTimeBonus(0);
    setHiSpeedBonus(0);
    setPreResultCue('none');
    setIsViewRules(false);
    setIsViewSettings(false);
    setAppScreen('title');
  }

  const openConfirmFromMenu = (action: Exclude<ConfirmAction, 'none'>) => {
    audioService.play('ok');
    setIsViewMenu(false);
    setConfirmAction(action);
    setIsViewConfirm(true);
  }

  const confirmBackToTitleFromMenu = () => {
    openConfirmFromMenu('backToTitle');
  }

  const openRulesFromMenu = () => {
    audioService.play('ok');
    setIsViewMenu(false);
    setReturnMenuOnRulesClose(true);
    setIsViewRules(true);
  }

  const openSettingsFromMenu = () => {
    audioService.play('ok');
    setIsViewMenu(false);
    setReturnMenuOnSettingsClose(true);
    setIsViewSettings(true);
  }

  const confirmRetryFromMenu = () => {
    openConfirmFromMenu('retry');
  }

  const confirmOk = () => {
    const action = confirmAction;
    setIsViewConfirm(false);
    setConfirmAction('none');
    if (action === 'backToTitle') {
      audioService.play('ok');
      backToTitleFromMenu();
      return;
    }
    if (action === 'retry') {
      setIsViewMenu(false);
      setReturnMenuOnRulesClose(false);
      setReturnMenuOnSettingsClose(false);
      resetGame();
    }
  }

  const confirmCancel = () => {
    audioService.play('ok');
    setIsViewConfirm(false);
    setConfirmAction('none');
    if (appScreen === 'play') {
      setIsViewMenu(true);
    }
  }

  const closeRules = () => {
    audioService.play('close');
    setIsViewRules(false);
    if (appScreen === 'play' && returnMenuOnRulesClose) {
      setReturnMenuOnRulesClose(false);
      setIsViewMenu(true);
    }
  }

  const openRules = () => {
    audioService.play('ok');
    setReturnMenuOnRulesClose(false);
    setIsViewRules(true)
  }

  const openSettings = () => {
    audioService.play('ok');
    setReturnMenuOnSettingsClose(false);
    setIsViewSettings(true);
  }

  const openPlayRecord = () => {
    audioService.play('ok');
    setIsViewRules(false);
    setIsViewSettings(false);
    setIsViewPlayRecord(true);
  }

  const closePlayRecord = () => {
    audioService.play('close');
    setIsViewPlayRecord(false);
  }

  const closeSettings = () => {
    audioService.play('close');
    setIsViewSettings(false);
    if (appScreen === 'play' && returnMenuOnSettingsClose) {
      setReturnMenuOnSettingsClose(false);
      setIsViewMenu(true);
    }
  }

  const toggleSound = () => {
    if (settings.soundEnabled) {
      setSoundEnabled(false);
      audioService.configure({
        soundEnabled: false,
        volume: settings.volume,
        bgmVolume: settings.bgmVolume,
      });
      return;
    }

    setSoundEnabled(true);
    audioService.configure({
      soundEnabled: true,
      volume: settings.volume,
      bgmVolume: settings.bgmVolume,
    });
    audioService.play('ok');
  }

  const changeVolume = (volume: number) => {
    setVolume(volume);
    audioService.configure({
      soundEnabled: settings.soundEnabled,
      volume,
      bgmVolume: settings.bgmVolume,
    });
  }

  const changeBgmVolume = (bgmVolume: number) => {
    setBgmVolume(bgmVolume);
    audioService.configure({
      soundEnabled: settings.soundEnabled,
      volume: settings.volume,
      bgmVolume,
    });
  }

  const unlockAudio = () => {
    audioService.unlockFromUserGesture();
  };

  const previewVolume = () => {
    if (!settings.soundEnabled) return;
    audioService.play('ok');
  }

  const startGame = () => {
    if (isStartingGame) return;
    setIsStartingGame(true);
    setIsViewSettings(false);
    resetGame();
    setAppScreen('play');
    setIsStartingGame(false);
  }

  const resetParameter = () => {
    setSelected([]);
    setPoint(0);
    setComboCount(0);
    setMaxCombo(0);
    setIsFinished(false);
  }

  const showCards = () => {
    const newCards = shuffledCardsRef.current.map((card) => ({
      ...card,
      flipped: true, // 一旦すべて表向きに
    }));

    setCards(newCards);
    setTimeout(() => {
      const hiddenCards = shuffledCardsRef.current.map((card) => ({
        ...card,
        flipped: false,
      }));
      setCards(hiddenCards);
      setIsResetting(false);
    }, 5000); // 5秒（5000ミリ秒）
  }

  if (appScreen === 'title') {
    return (
      <div className="app-root" onPointerDownCapture={unlockAudio}>
        <TopAdBanner />
        <div className="app-shell app-content">
          <TitleScreen
            onStart={startGame}
            onOpenSettings={openSettings}
            onOpenHowTo={openRules}
            onOpenPlayRecord={openPlayRecord}
            onOpenPrivacyPolicy={() => {
              audioService.play('ok');
              audioService.setBgmActive(false);
              window.location.assign('/privacy-policy.html');
            }}
            isStartDisabled={isStartingGame}
            version={APP_VERSION}
          />
        </div>
        <RulesModal isOpen={isViewRules} onClose={closeRules} />
        <SettingsModal
          isOpen={isViewSettings}
          soundEnabled={settings.soundEnabled}
          volume={settings.volume}
          bgmVolume={settings.bgmVolume}
          onToggleSound={toggleSound}
          onVolumeChange={changeVolume}
          onVolumeCommit={previewVolume}
          onBgmVolumeChange={changeBgmVolume}
          onClose={closeSettings}
        />
        <PlayRecordModal
          isOpen={isViewPlayRecord}
          records={playRecords}
          onClose={closePlayRecord}
        />
      </div>
    );
  }

  return (
    <div className="app-root" onPointerDownCapture={unlockAudio}>
      <div className="container play-screen">
        { countdown !== null && (
          <div className="shadow-overlay">
            <span className="countdown-text">{countdown}</span>
          </div>
        )}
        {preResultCue !== 'none' && (
          <div className="shadow-overlay time-result-cue-overlay">
            <p className={preResultCue === 'timeUp' ? 'time-result-cue time-result-cue--danger' : 'time-result-cue'}>
              {preResultCue === 'timeUp'
                ? 'Time Up!'
                : preResultCue === 'excellent'
                  ? 'Excellent!'
                  : preResultCue === 'great'
                    ? 'Great!'
                    : 'Clear!'}
            </p>
          </div>
        )}
        <PlayMenuModal
          isOpen={isViewMenu}
          onClose={closeMenu}
          onBackToTitle={confirmBackToTitleFromMenu}
          onOpenHowTo={openRulesFromMenu}
          onOpenSettings={openSettingsFromMenu}
          onRetry={confirmRetryFromMenu}
        />
        <ConfirmModal
          isOpen={isViewConfirm}
          message="現在進行中のゲーム内容が失われます。"
          onConfirm={confirmOk}
          onCancel={confirmCancel}
        />
        <ResultModal
          isOpen={isViewResult}
          point={point}
          maxCombo={maxCombo}
          timeBonus={timeBonus}
          hiSpeedBonus={hiSpeedBonus}
          animate={animateResult}
          onBackToTitle={backToTitleFromResult}
          onRetry={retryFromResult}
          onClose={closeResult}
        />
        <RulesModal isOpen={isViewRules} onClose={closeRules} />
        <SettingsModal
          isOpen={isViewSettings}
          soundEnabled={settings.soundEnabled}
          volume={settings.volume}
          bgmVolume={settings.bgmVolume}
          onToggleSound={toggleSound}
          onVolumeChange={changeVolume}
          onVolumeCommit={previewVolume}
          onBgmVolumeChange={changeBgmVolume}
          onClose={closeSettings}
        />
      <header className="header">
        <h1>Match Monster</h1>
      </header>
        <div className="timer-bar" aria-label="制限時間">
          <span className="timer-bar__label">TIME</span>
          <span
            key={timeLeft}
            className={timeLeft <= 5 ? 'timer-bar__value timer-bar__value--urgent' : 'timer-bar__value'}
            aria-live="polite"
          >
            {timeLeft}
          </span>
        </div>
        <StatusBar point={point} comboCount={comboCount} />
        <div className="grid">
          {cards.map((card, i) => (
            <button
              key={card.id}
              onClick={() => flipCard(i)}
              disabled={card.flipped || card.matched || isTimeOver}
              className="card"
            >
              <img src={card.icon} alt="monster" className="card-image" />
              <img
                src={cardBackImage}
                alt="back"
                className={`card-back-image ${card.flipped ? "hidden" : ""}`}
              />
            </button>
          ))}
        </div>
        <AppFooter>
          <button className="footer-button footer-button--menu" onClick={openMenu} aria-label="メニューを開く">⋯</button>
          <button className={`footer-button ${(isFinished || isTimeOver) ? "" : "disabled"}`} onClick={openResult}>🏁</button>
        </AppFooter>
      </div>
    </div>
  );
}

export default App;
