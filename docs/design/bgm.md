# BGM 仕様

> プロダクト方針: [`docs/PRODUCT_POLICY.md`](../PRODUCT_POLICY.md)

---

## 1. ドキュメント情報

| 項目 | 内容 |
|------|------|
| 作成日 | `2026-06-20` |
| 音源配置 | `src/assets/music/` |
| 再生管理 | `src/services/audioService.ts` |
| 設定連携 | `src/hooks/useGameSettings.ts` |

---

## 2. 音源ファイル

| ファイル | 用途 |
|----------|------|
| `Imaginary_Mind.mp3` | タイトル・プレイ中のループ BGM |

---

## 3. 再生ルール

| 項目 | 仕様 |
|------|------|
| 再生方式 | ループ再生（Web Audio API `AudioBufferSourceNode.loop = true`） |
| 開始 | アプリ表示中（タイトル・プレイ画面）。初回はユーザー操作と同時に `unlockFromUserGesture()` で再生開始 |
| 停止 | プライバシーポリシー（`privacy-policy.html`）へ遷移時 |
| サウンド OFF | BGM・効果音ともに停止 |
| サウンド ON | BGM・効果音ともに有効（BGM は再開） |
| BGM 音量 | 設定モーダルの BGM スライダー（0–100%） |
| 効果音音量 | 設定モーダルの効果音スライダー（0–100%） |

---

## 4. 永続化

`localStorage` キー `match-monster-settings` の JSON に `bgmVolume` を保存する。

```json
{
  "soundEnabled": true,
  "volume": 70,
  "bgmVolume": 70
}
```

---

## 5. 実装参照

| 項目 | ファイル |
|------|----------|
| 再生 API | `src/services/audioService.ts` |
| BGM 有効/無効の切替 | `src/App.tsx`（`setBgmActive`） |
| 音量設定 UI | `src/components/SettingsModal.tsx` |

---

## 6. 変更履歴

| 日付 | 変更内容 |
|------|----------|
| 2026-06-20 | 初版。`Imaginary_Mind.mp3` のループ BGM と BGM 音量スライダーを追加 |
