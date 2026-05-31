# App Store リリースガイド（Match Monster）

> 第一目標: **なるはや App Store 公開** + **広告収入（AdMob）**  
> Web デモ（Vercel）は審査用 URL・プライバシーポリシー公開に利用。

---

## 1. 前提

| 項目 | 内容 |
|------|------|
| アプリ名 | Match Monster |
| Bundle ID | `com.matchmonster.memorygame`（`capacitor.config.ts`） |
| Web ビルド | `npm run build` → `dist/` |
| iOS ラッパ | [Capacitor](https://capacitorjs.com/) |

---

## 2. 初回セットアップ（iOS）

```bash
npm ci
npm run build
npx cap add ios          # 初回のみ（ios/ プロジェクト生成）
npx cap sync ios
npx cap open ios         # Xcode で開く
```

以降の更新は:

```bash
npm run cap:sync
npm run cap:ios
```

---

## 3. 必須: プライバシーポリシー URL

App Store Connect と AdMob は **公開 HTTPS URL** が必須。

| 項目 | 対応 |
|------|------|
| 本文 | [`public/privacy-policy.html`](../public/privacy-policy.html) を編集（運営者名・連絡先を記載） |
| 本番 URL 例 | `https://memory-game-three-mauve.vercel.app/privacy-policy.html` |
| 環境変数 | `.env` の `VITE_PRIVACY_POLICY_URL`（アプリ内リンク用・任意） |

デプロイ後、ブラウザで URL が開けることを確認してから Connect に登録する。

---

## 4. 必須: 広告（AdMob / iOS）

App Store 版は **AdMob** を想定（Web 版 `ads.txt` は AdSense 用・iOS では不使用）。

### 4.1 AdMob コンソール

1. アプリを iOS 向けに登録
2. **アプリ ID**（`ca-app-pub-~...`）と **広告ユニット ID** を発行
3. `.env` に記載（`.env.example` 参照）

### 4.2 Xcode / Info.plist（`ios/App/App/Info.plist`）

`npx cap add ios` 後に追加:

```xml
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy</string>
```

パーソナライズド広告・トラッキングを行う場合:

```xml
<key>NSUserTrackingUsageDescription</key>
<string>より適した広告を表示するために、他社のアプリやウェブサイトでの活動を使用することがあります。</string>
```

実装時は ATT（App Tracking Transparency）ダイアログをコード側で表示する。

### 4.3 App Store Connect — App Privacy

- データ収集の種類（広告識別子、利用状況など）を **実際の SDK に合わせて** 申告
- プライバシーポリシー URL を登録
- 年齢レーティング・アプリカテゴリを設定

### 4.4 Web 版（任意・Vercel デモ）

| ファイル | 用途 |
|----------|------|
| [`public/ads.txt`](../public/ads.txt) | AdSense 承認後、1 行を本番 Publisher ID に差し替え |
| EU 向け Cookie 同意 | Web のみ必要な場合はバナー実装（iOS ネイティブは ATT が中心） |

---

## 5. Apple Developer / App Store Connect

| ステップ | 内容 |
|----------|------|
| Apple Developer Program | 有効な契約（年額） |
| App 作成 | Bundle ID = `com.matchmonster.memorygame` |
| スクリーンショット | 6.7" / 6.5" 等、審査ガイドの必須サイズ |
| 説明文・キーワード | 日本語で記載 |
| ビルドアップロード | Xcode → Archive → Distribute → App Store Connect |
| 審査情報 | デモ用アカウント不要（ログインなしの場合） |
| エクスポートコンプライアンス | 暗号化利用が少ない場合は簡易申告で可（要確認） |

---

## 6. リリース前チェックリスト

### ビルド・品質

- [ ] `npm run lint` / `npm run build` が成功（CI でも確認）
- [ ] `npm run cap:sync` 後、実機またはシミュレータで起動・プレイ可能
- [ ] タイトル画面・プレイ・リザルトが設計書 Must を満たす

### 法務・ストア

- [ ] `privacy-policy.html` の運営者・連絡先を実値に更新
- [ ] 本番 URL を App Store Connect に登録
- [ ] App Privacy の申告とポリシー本文が一致
- [ ] 年齢レーティング・コンテンツ権利（カード画像）に問題なし

### 広告

- [ ] AdMob アプリ・ユニット作成済み
- [ ] `Info.plist` に `GADApplicationIdentifier`
- [ ] テスト広告で表示確認後、本番ユニットに切替
- [ ] ATT 文言・表示タイミング（利用する場合）

### 提出

- [ ] バージョン・ビルド番号を `package.json` / Xcode で整合
- [ ] TestFlight で内部テスト
- [ ] App Review に提出

---

## 7. バージョン管理

| 場所 | 推奨 |
|------|------|
| `package.json` `version` | `1.1.1`（README と揃える） |
| Xcode `MARKETING_VERSION` | 同上 |
| Xcode `CURRENT_PROJECT_VERSION` | ビルドごとに整数でインクリメント |

---

## 8. 関連ファイル

| ファイル | 役割 |
|----------|------|
| `capacitor.config.ts` | Capacitor アプリ ID・webDir |
| `.env.example` | AdMob / プライバシー URL の変数名 |
| `public/privacy-policy.html` | ストア必須のポリシー本文 |
| `public/ads.txt` | Web AdSense 用（iOS 非使用） |
| `.github/workflows/ci.yml` | build + lint |
| [`PRODUCT_POLICY.md`](PRODUCT_POLICY.md) | 開発スコープ・セルフレビュー |

---

## 9. 変更履歴

| 日付 | 内容 |
|------|------|
| 2026-05-31 | 初版（App Store + AdMob 想定） |
