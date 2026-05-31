# Match Monster Copilot Instructions

このリポジトリで AI（Copilot）が実装・提案するときは、以下を常時適用する。

## 1. 最優先方針

- 最優先は「なるはやリリース」と「広告収入」。
- 実装は MVP（リリースに耐える最低限）に限定する。
- 収益やリリースに直結しない提案は、実装せず提案止まりにする。
- スコープが曖昧な場合は、設計書の Must/AC を満たす範囲のみ対応する。

## 2. 実装前の確認

- `docs/PRODUCT_POLICY.md` を正本として参照する。
- 画面仕様は `docs/design/` を参照する。
- UI 共通仕様は `docs/design/UI_COMMON.md` を参照する（`AppFooter` とコピーライト表示は Must）。

## 3. 実装中の制約

- 無関係なリファクタや抽象化をしない。
- 依存パッケージは原則追加しない。
- 変更は「今回タスク内の最小修正」に留める。
- 既存の命名、画面遷移、永続化キー（localStorage など）との整合を保つ。
- ユーザーの明示指示がない限り、コミット・pushをしない。

## 4. 完了前セルフレビュー

完了報告前に、変更範囲について次を確認する。

1. 矛盾: 設計書 Must/AC と実装が一致しているか
2. 重複: コピペロジックや未再利用の既存部品がないか
3. デッドコード: 未使用 import/変数/関数/スタイルが残っていないか
4. 整合性: 既存画面やフローを壊していないか
5. スコープ: MVP 方針に反する拡張を入れていないか

可能なら `npm run build` と `npm run lint` を実行して確認する。

## 5. ドキュメント運用

- プロダクト方針は `docs/PRODUCT_POLICY.md` を唯一の正本とし、他ドキュメントへ重複記載しない。
- このファイルは Copilot 向けの運用基準として維持し、変更時は上記正本との整合を保つ。

## 6. English Summary (Short)

Apply these rules to all AI-assisted implementation and proposals in this repository.

- You must prioritize fastest possible release and ad revenue.
- You must keep scope to MVP only.
- You must not implement non-essential ideas without explicit user instruction.
- Before coding, you must follow `docs/PRODUCT_POLICY.md`, `docs/design/`, and `docs/design/UI_COMMON.md`.
- You must avoid unrelated refactors.
- You should avoid new dependencies unless strictly required by the current task.
- You must make minimal, in-scope changes.
- You must keep naming, flows, and storage keys consistent with existing patterns.
- You must not commit or push unless the user explicitly asks.
- Before completion, you must run a quick self-review for contradiction, duplication, dead code, consistency, and scope drift.
- If possible, you should run `npm run build` and `npm run lint`.

`docs/PRODUCT_POLICY.md` is the single source of truth. This section is a concise English operational guide for Copilot behavior.