# Memory Game (神経衰弱ゲーム)　ver1.1.1

React + TypeScript を用いて開発した、神経衰弱（メモリーゲーム）アプリです。

## デモプレイ
以下にアクセスすることで、すぐにデモプレイをお楽しみいただけます。

https://memory-game-three-mauve.vercel.app

## 技術スタック
- React
- TypeScript
- Vite
- Capacitor（iOS / App Store 向け）

## 開発・リリース

```bash
npm ci
npm run dev      # ローカル開発
npm run lint
npm run build
```

| ドキュメント | 内容 |
|--------------|------|
| [`docs/PRODUCT_POLICY.md`](docs/PRODUCT_POLICY.md) | 開発方針・セルフレビュー |
| [`docs/APP_STORE_RELEASE.md`](docs/APP_STORE_RELEASE.md) | App Store・AdMob・Capacitor |
| [`docs/RELEASE_CHECKLIST.md`](docs/RELEASE_CHECKLIST.md) | 提出直前チェック |

環境変数は [`.env.example`](.env.example) を `.env` にコピーして設定。

**プライバシーポリシー（ストア必須）:** 本番は `/privacy-policy.html`（ソース: [`public/privacy-policy.html`](public/privacy-policy.html)）。運営者名・連絡先を記載してから提出すること。

```bash
npm run cap:sync   # build + Capacitor 同期（ios/ 生成後）
npm run cap:ios    # Xcode で開く
```

## 特徴
- スマホでも快適に操作できるレスポンシブ対応
- カードシャッフル、スコア記録、ゲームリセットなどのロジックを実装
- 画像イメージのプリロードや、補色や類似色を考慮したデザインで、快適なUXを意識
- シンプルなUIで直感的に遊べるデザイン

## 目的
ReactとTypeScriptの実践的な学習、及び、webアプリケーションからスマートフォンアプリへの移行に挑戦。

## 課題
- 初回アクセス時のスタート画面の実装
- ~~リザルト画面の実装~~ - ver1.1.0にて実装
- localStorageを利用してのスコア履歴、ベストスコア表示機能実装
- 各操作時の視覚効果の追加
- ~~ルール確認用ポップアップ画面の表示ボタン実装~~ - ver1.1.0にて実装
- 制限時間導入

## 参考
https://amix-design.com/tl/tool-c-pattern/

## スペシャルサンクス
カードデザイン - 妻、友人
