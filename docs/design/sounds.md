# サウンド仕様（BGM・効果音）

> プロダクト方針: [`docs/PRODUCT_POLICY.md`](../PRODUCT_POLICY.md)

BGM と効果音（SE）の再生・設定の正本。画面設計書からは本ファイルを参照する。

---

## 1. ドキュメント情報

| 項目 | 内容 |
|------|------|
| 作成日 | `2026-06-20` |
| 更新日 | `2026-06-20` |
| 効果音配置 | `src/assets/sounds/` |
| BGM 配置 | `src/assets/music/` |
| 再生管理 | `src/services/audioService.ts` |
| 設定連携 | `src/hooks/useGameSettings.ts` |
| 設定 UI | `src/components/SettingsModal.tsx` |

---

## 2. 技術概要

| 項目 | 仕様 |
|------|------|
| 再生 API | Web Audio API（`AudioContext` + `GainNode`） |
| 音量制御 | 効果音用・BGM 用で GainNode を分離（iOS 向け） |
| 初回再生 | ブラウザ自動再生制限のため、ユーザー操作時に `unlockFromUserGesture()` で AudioContext を解除 |
| サウンド OFF | BGM・効果音ともに停止 |
| サウンド ON | BGM 再開。オン切替時のみ `ok` SE を再生（オフ切替時は無音） |

---

## 3. 設定 UI

設定モーダル（タイトル・プレイ画面メニューから共通利用）。

| ID | 種別 | 表示名 | 操作 |
|----|------|--------|------|
| `vol-master-toggle` | トグル | サウンド オン / オフ | BGM・効果音の一括 ON/OFF |
| `vol-slider-se` | range | 効果音 | 0〜100%。OFF 時は無効化しラベル・数値をグレー表示 |
| `vol-slider-bgm` | range | BGM | 0〜100%。OFF 時は無効化しラベル・数値をグレー表示 |

**操作ルール:**

- サウンド OFF → 両スライダー無効、ラベル・数値（`%` 含む）をグレー表示
- サウンド ON 切替 → `ok` を再生
- サウンド OFF 切替 → 無音
- 効果音スライダーを操作して手を離したとき → `ok`（音量プレビュー）
- BGM スライダー変更 → 再生中 BGM の音量をリアルタイム反映

```
┌──────────────────────────┐
│        設定               │
│  ─────────────────────   │
│  サウンド  [オン / オフ]   │
│  効果音    [━━━━●──] 70% │
│  BGM       [━━━━●──] 70% │
│            [ × ]         │
└──────────────────────────┘
```

---

## 4. 永続化

キー: `match-monster-settings`（`localStorage`）

```json
{
  "soundEnabled": true,
  "volume": 70,
  "bgmVolume": 70
}
```

| フィールド | 説明 | 初期値 |
|------------|------|--------|
| `soundEnabled` | サウンド一括 ON/OFF | `true` |
| `volume` | 効果音音量 0–100 | `70` |
| `bgmVolume` | BGM 音量 0–100 | `70` |

---

## 5. BGM

### 5.1 音源

| ファイル | 用途 |
|----------|------|
| `Imaginary_Mind.mp3` | タイトル・プレイ中のループ BGM |

### 5.2 再生ルール

| 項目 | 仕様 |
|------|------|
| 再生方式 | ループ（`AudioBufferSourceNode.loop = true`） |
| 開始 | アプリ表示中（タイトル・プレイ）。ユーザー操作と同時に `unlockFromUserGesture()` |
| 停止 | プライバシーポリシー（`privacy-policy.html`）遷移時（`setBgmActive(false)`） |
| 音量 | `bgmVolume` → BGM 用 GainNode |

---

## 6. 効果音（SE）

### 6.1 音源

| ファイル | ID | 用途 |
|----------|-----|------|
| `close.mp3` | `close` | 閉じるボタン（Lucide `CircleX`）押下 |
| `count.mp3` | `count` | 制限時間 5〜1 秒のカウントダウン |
| `finish.mp3` | `finish` | ゲーム終了時（タイムアップ含む） |
| `flip.mp3` | `flip` | カード選択（1 枚目のみ） |
| `miss.mp3` | `miss` | ペア不一致（2 枚目をめくったタイミング） |
| `ok.mp3` | `ok` | 個別指定のないボタン押下 |
| `result.mp3` | `result` | 結果画面を初回表示するときのみ |
| `start.mp3` | `start` | ゲーム開始・リトライ確定時 |
| `success.mp3` | `success` | ペア一致（2 枚目をめくったタイミング） |

### 6.2 カード操作

| 操作 | 再生 |
|------|------|
| 1 枚目をめくる | `flip` |
| 2 枚目をめくり一致 | `success`（`flip` は鳴らさない） |
| 2 枚目をめくり不一致 | `miss`（`flip` は鳴らさない） |

### 6.3 ゲーム進行

| タイミング | 再生 |
|------------|------|
| `resetGame()`（スタート・リトライ確定） | `start` |
| 残り 5, 4, 3, 2, 1 秒 | `count` |
| クリアまたはタイムアップ確定 | `finish` |
| 終了後、結果 overlay を初回表示 | `result` |
| 結果ボタンで 2 回目以降に結果 overlay を開く | なし |

### 6.4 UI 操作

| 操作 | 再生 |
|------|------|
| モーダルの閉じる（`CircleX`） | `close` |
| 上記以外の汎用ボタン | `ok` |
| サウンド ON 切替 | `ok` |
| サウンド OFF 切替 | なし |
| 効果音スライダー操作後（手を離したとき） | `ok` |
| リトライ確定（`resetGame`） | `start`（`ok` は鳴らさない） |
| プライバシーポリシー遷移前 | `ok`（遷移と同時に BGM 停止） |

---

## 7. 実装参照

| 項目 | ファイル |
|------|----------|
| 再生 API | `src/services/audioService.ts` |
| 設定 state / 永続化 | `src/hooks/useGameSettings.ts` |
| ゲームイベント接続・BGM 有効化 | `src/App.tsx` |
| 設定 UI | `src/components/SettingsModal.tsx` |

---

## 8. 変更履歴

| 日付 | 変更内容 |
|------|----------|
| 2026-06-20 | 初版。BGM（`Imaginary_Mind.mp3`）・9 種 SE・Web Audio API・設定スライダー 2 本を統合定義 |
| 2026-06-20 | `sound-effects.md` / `bgm.md` を本ファイルへ統合 |
