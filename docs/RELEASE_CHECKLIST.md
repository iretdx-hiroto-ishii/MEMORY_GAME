# リリースチェックリスト（要約）

詳細手順は **[`APP_STORE_RELEASE.md`](APP_STORE_RELEASE.md)** を正本とする。

## 提出直前（App Store）

- [ ] CI（lint + build）成功
- [ ] プライバシーポリシー URL が本番で開ける
- [ ] `privacy-policy.html` の運営者・連絡先を実値化
- [ ] Capacitor `cap sync` → 実機で動作確認
- [ ] AdMob `Info.plist` / App Privacy 申告済み
- [ ] TestFlight 確認後、審査提出

## Web デモ（Vercel・任意）

- [ ] `npm run build` で `dist` に `privacy-policy.html` / `ads.txt` が含まれる
- [ ] AdSense 利用時のみ `ads.txt` を本番 ID に更新
