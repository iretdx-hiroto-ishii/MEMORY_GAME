# UI 共通仕様

> 全画面で共有する UI 部品・ルールの正本。画面設計書から参照する。

---

## 1. コピーライト（Must）

**すべての画面**のフッターにコピーライトを表示する。

| 項目 | 内容 |
|------|------|
| 表記 | `© {年} {運営者名}`（例: `© 2026 A型システム`） |
| 正本 | [`public/branding.json`](../../public/branding.json) |
| React | `src/constants/branding.ts` が JSON を import |
| 静的 HTML | [`public/shared/branding-footer.js`](../../public/shared/branding-footer.js) が JSON を fetch |

### 実装

| 種別 | 使うもの |
|------|----------|
| React 画面（プレイ・タイトル等） | [`AppFooter`](../src/components/AppFooter.tsx) を画面下部に配置 |
| 静的 HTML（プライバシーポリシー等） | `data-app-copyright` + `branding-footer.js` + `app-footer.css` |

文言を変えるときは **`public/branding.json` のみ**編集する。

新規 React 画面は **必ず `AppFooter` を含める**。コピーライトを画面ごとに直書きしない。

---

## 2. 共通フッター `AppFooter`

```
┌─────────────────────────┐
│  （画面固有の操作 UI）   │  ← children（任意）
├─────────────────────────┤
│   © 2026 A型システム     │  ← 常に表示
└─────────────────────────┘
```

| ファイル | 役割 |
|----------|------|
| `src/components/AppFooter.tsx` | フッターコンポーネント |
| `src/components/app-footer.css` | React 用スタイル |
| `src/constants/branding.ts` | JSON の re-export・`getCopyrightText()` |
| `public/branding.json` | 運営者名・年の **正本** |

### 使用例

```tsx
import AppFooter from './components/AppFooter';

<AppFooter>
  {/* 画面固有ボタン（プレイ画面の 📋🔁🏁 など） */}
</AppFooter>
```

操作ボタンがない画面（タイトル画面など）は `<AppFooter />` のみ。

---

## 3. デザイントークン（参照）

| トークン | 値 | 定義 |
|----------|-----|------|
| 背景 | `#800020` | `src/index.css` |
| 本文 | `#c8c8c8` | `src/index.css` |
| アクセント | `#B38600` | 各 CSS |

---

## 4. 変更履歴

| 日付 | 内容 |
|------|------|
| 2026-05-31 | 初版（AppFooter・全画面コピーライト Must） |
