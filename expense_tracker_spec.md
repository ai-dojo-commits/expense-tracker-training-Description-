# 支出記録アプリ（Expense Tracker）仕様書

## 概要

支出記録アプリは、日々の支出を簡単に記録・管理できるWebアプリケーションです。ユーザーは支出の金額、カテゴリ、日付、メモを登録し、一覧表示やカテゴリ別集計、データの削除が可能です。データはブラウザのlocalStorageに保存されるため、サーバー不要で動作します。

---

## 目的

1. **支出の記録**: 日付、カテゴリ、金額、メモを簡単に入力・保存
2. **支出の可視化**: 記録した支出を一覧で確認
3. **カテゴリ別分析**: カテゴリ別に支出を集計し、使途を把握
4. **データの永続化**: localStorageでブラウザにデータを保存

---

## 必須機能

### 1. 支出記録機能

**入力項目:**
- **日付** (必須): YYYY-MM-DD形式、デフォルトは今日の日付
- **カテゴリ** (必須): ドロップダウンから選択
- **金額** (必須): 1以上の整数
- **メモ** (必須): 支出の詳細を記述

**カテゴリ一覧:**
- 食費
- 交通費
- 娯楽費
- 日用品
- 医療費
- 光熱費
- その他

**動作:**
- 「追加」ボタンをクリックすると、入力内容をlocalStorageに保存
- 保存後、フォームをリセット
- 一覧に即座に反映

---

### 2. 支出一覧表示機能

**表示内容:**
- 登録された全支出をテーブル形式で表示
- 日付の降順でソート（最新が上）

**表示項目:**
| 項目 | 表示形式 | 例 |
|------|----------|-----|
| 日付 | MM/DD形式 | 11/11 |
| カテゴリ | 文字列 | 食費 |
| 金額 | ¥記号付き、カンマ区切り | ¥1,200 |
| メモ | 文字列 | ランチ代 |
| 操作 | 削除ボタン | [削除] |

**削除機能:**
- 各行に「削除」ボタンを配置
- クリック時に確認ダイアログを表示: "この支出データを削除しますか？"
- OKを選択すると、該当データをlocalStorageから削除し、一覧から削除

**データが0件の場合:**
- "支出データがありません" と表示

---

### 3. カテゴリ別集計機能

**集計内容:**
- 各カテゴリの支出合計を計算・表示
- 全カテゴリの総合計金額を表示

**表示形式:**

```
┌─────────────────────────────┐
│   カテゴリ別集計              │
├─────────────┬───────────────┤
│ カテゴリ     │ 金額          │
├─────────────┼───────────────┤
│ 食費        │ ¥5,400        │
│ 交通費      │ ¥1,200        │
│ 娯楽費      │ ¥3,000        │
│ 日用品      │ ¥0            │
│ 医療費      │ ¥0            │
│ 光熱費      │ ¥0            │
│ その他      │ ¥500          │
├─────────────┼───────────────┤
│ 合計        │ ¥10,100       │
└─────────────┴───────────────┘
```

**仕様:**
- 支出がないカテゴリも表示（¥0として表示）
- 金額は3桁ごとにカンマ区切り
- 支出の追加・削除時にリアルタイムで更新

---

## 画面構成

### メイン画面（単一ページ）

```
┌─────────────────────────────────────────────┐
│       支出記録アプリ (Expense Tracker)       │
├─────────────────────────────────────────────┤
│                                             │
│  【1. 支出記録フォーム】                      │
│  ┌───────────────────────────────────────┐  │
│  │ 日付:     [2025-11-11]                 │  │
│  │ カテゴリ: [▼ 選択してください]          │  │
│  │ 金額:     [_______] 円                 │  │
│  │ メモ:     [____________________]       │  │
│  │                                        │  │
│  │              [追加] ボタン              │  │
│  └───────────────────────────────────────┘  │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  【2. カテゴリ別集計】                       │
│  ┌───────────────────────────────────────┐  │
│  │  食費: ¥5,400   交通費: ¥1,200        │  │
│  │  娯楽費: ¥3,000  日用品: ¥0            │  │
│  │  医療費: ¥0      光熱費: ¥0            │  │
│  │  その他: ¥500                          │  │
│  │  ─────────────────────────────────    │  │
│  │  合計支出: ¥10,100                     │  │
│  └───────────────────────────────────────┘  │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  【3. 支出一覧】                             │
│  ┌──────┬────────┬────────┬──────────┬────┐  │
│  │ 日付  │カテゴリ │ 金額   │ メモ     │操作 │  │
│  ├──────┼────────┼────────┼──────────┼────┤  │
│  │11/11 │食費    │¥1,200 │ランチ    │削除│  │
│  │11/10 │交通費  │¥500   │電車代    │削除│  │
│  │11/09 │娯楽費  │¥3,000 │映画      │削除│  │
│  └──────┴────────┴────────┴──────────┴────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 入出力仕様

### 入力仕様

| 項目 | 形式 | 必須 | 制約 | バリデーション |
|------|------|------|------|----------------|
| 日付 | 日付 | 必須 | YYYY-MM-DD形式 | 空欄不可、不正な日付不可 |
| カテゴリ | 文字列 | 必須 | 7つから選択 | 未選択不可 |
| 金額 | 数値 | 必須 | 1以上の整数 | 空欄不可、0以下不可、数値以外不可 |
| メモ | 文字列 | 必須 | 最大100文字 | 空欄不可、100文字超過不可 |

### 出力仕様

#### 支出一覧
- 日付: `MM/DD`形式（例: 11/11）
- カテゴリ: そのまま表示
- 金額: `¥X,XXX`形式（カンマ区切り）
- メモ: 50文字超過時は省略記号（...）を表示

#### カテゴリ別集計
- 各カテゴリ: `カテゴリ名: ¥X,XXX`形式
- 合計: `合計支出: ¥X,XXX`形式
- カンマ区切りで表示

---

## 使用技術

### HTML5

**主要な要素:**
```html
<form id="expense-form">
  <input type="date" id="date" required>
  <select id="category" required>
    <option value="">選択してください</option>
    <option value="食費">食費</option>
    <option value="交通費">交通費</option>
    <option value="娯楽費">娯楽費</option>
    <option value="日用品">日用品</option>
    <option value="医療費">医療費</option>
    <option value="光熱費">光熱費</option>
    <option value="その他">その他</option>
  </select>
  <input type="number" id="amount" min="1" required>
  <input type="text" id="memo" maxlength="100" required>
  <button type="submit">追加</button>
</form>

<div id="category-summary"></div>
<table id="expense-table"></table>
```

---

### CSS3

**デザイン方針:**
- シンプルで見やすいレイアウト
- レスポンシブデザイン対応
- モダンなフラットデザイン

**主要なスタイリング:**
```css
/* カスタムプロパティ */
:root {
  --primary-color: #4CAF50;
  --danger-color: #f44336;
  --text-color: #333;
  --border-color: #ddd;
  --background-color: #f9f9f9;
}

/* レイアウト */
body {
  font-family: 'Segoe UI', Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* テーブル */
table {
  width: 100%;
  border-collapse: collapse;
}

/* ボタン */
button {
  padding: 10px 20px;
  cursor: pointer;
}
```

---

### JavaScript (ES6+)

**主要な機能:**

#### 1. データ構造
```javascript
// 支出データの構造
{
  id: String,           // 一意な識別子（タイムスタンプ）
  date: String,         // 日付（YYYY-MM-DD形式）
  category: String,     // カテゴリ
  amount: Number,       // 金額
  memo: String,         // メモ
  createdAt: String     // 作成日時（ISO 8601形式）
}
```

#### 2. 主要な関数

```javascript
// 初期化
function init() {
  loadFromLocalStorage();
  renderExpenses();
  renderCategorySummary();
  setupEventListeners();
}

// 支出の追加
function addExpense(expenseData) {
  const expense = {
    id: Date.now().toString(),
    date: expenseData.date,
    category: expenseData.category,
    amount: parseInt(expenseData.amount),
    memo: expenseData.memo,
    createdAt: new Date().toISOString()
  };

  expenses.push(expense);
  saveToLocalStorage();
  renderExpenses();
  renderCategorySummary();
}

// 支出の削除
function deleteExpense(id) {
  if (confirm('この支出データを削除しますか？')) {
    expenses = expenses.filter(expense => expense.id !== id);
    saveToLocalStorage();
    renderExpenses();
    renderCategorySummary();
  }
}

// 支出一覧の描画
function renderExpenses() {
  const sortedExpenses = expenses.sort((a, b) =>
    new Date(b.date) - new Date(a.date)
  );

  // テーブルに描画する処理
}

// カテゴリ別集計の描画
function renderCategorySummary() {
  const categories = ['食費', '交通費', '娯楽費', '日用品', '医療費', '光熱費', 'その他'];
  const summary = {};

  // 各カテゴリの合計を計算
  categories.forEach(cat => {
    summary[cat] = expenses
      .filter(exp => exp.category === cat)
      .reduce((sum, exp) => sum + exp.amount, 0);
  });

  // 総合計を計算
  const total = Object.values(summary).reduce((sum, amount) => sum + amount, 0);

  // 描画処理
}

// localStorageへの保存
function saveToLocalStorage() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

// localStorageからの読み込み
function loadFromLocalStorage() {
  const data = localStorage.getItem('expenses');
  expenses = data ? JSON.parse(data) : [];
}

// バリデーション
function validateInput(data) {
  if (!data.date || !data.category || !data.amount || !data.memo) {
    alert('すべての項目を入力してください');
    return false;
  }

  if (data.amount < 1) {
    alert('金額は1以上の数値を入力してください');
    return false;
  }

  if (data.memo.length > 100) {
    alert('メモは100文字以内で入力してください');
    return false;
  }

  return true;
}

// 日付フォーマット（YYYY-MM-DD → MM/DD）
function formatDate(dateString) {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
}

// 金額フォーマット（数値 → ¥X,XXX）
function formatCurrency(amount) {
  return '¥' + amount.toLocaleString('ja-JP');
}
```

---

## データ構造（localStorage）

### ストレージキー
```javascript
'expenses'  // 支出データを保存するキー
```

### データ形式
JSON形式の配列

### データ例
```json
[
  {
    "id": "1699701234567",
    "date": "2025-11-11",
    "category": "食費",
    "amount": 1200,
    "memo": "ランチ代",
    "createdAt": "2025-11-11T03:00:00.000Z"
  },
  {
    "id": "1699614834567",
    "date": "2025-11-10",
    "category": "交通費",
    "amount": 500,
    "memo": "電車代",
    "createdAt": "2025-11-10T04:30:00.000Z"
  },
  {
    "id": "1699528434567",
    "date": "2025-11-09",
    "category": "娯楽費",
    "amount": 3000,
    "memo": "映画鑑賞",
    "createdAt": "2025-11-09T06:15:00.000Z"
  }
]
```

### データ項目の説明

| 項目 | 型 | 説明 |
|------|-----|------|
| id | String | 一意な識別子（`Date.now()`で生成） |
| date | String | 日付（ISO 8601形式: YYYY-MM-DD） |
| category | String | カテゴリ名 |
| amount | Number | 金額（整数） |
| memo | String | メモ（最大100文字） |
| createdAt | String | 作成日時（ISO 8601形式） |

---

## イベントフロー

### 1. 支出追加フロー
```
1. ユーザーがフォームに入力
2. 「追加」ボタンをクリック
3. フォームのsubmitイベント発火
4. バリデーション実行
   ├─ 失敗 → エラーメッセージ表示、処理終了
   └─ 成功 → 次へ
5. 新しい支出オブジェクトを作成（IDとcreatedAt自動付与）
6. expenses配列に追加
7. localStorageに保存
8. 支出一覧を再描画
9. カテゴリ別集計を再描画
10. フォームをリセット
```

### 2. 支出削除フロー
```
1. ユーザーが「削除」ボタンをクリック
2. 確認ダイアログを表示
3. ユーザーが「OK」を選択
   ├─ キャンセル → 処理終了
   └─ OK → 次へ
4. 該当データをexpenses配列から削除
5. localStorageに保存
6. 支出一覧を再描画
7. カテゴリ別集計を再描画
```

### 3. ページ読み込みフロー
```
1. DOMContentLoadedイベント発火
2. init()関数実行
3. localStorageからデータ読み込み
4. 支出一覧を描画
5. カテゴリ別集計を描画
6. イベントリスナーを設定
```

---

## バリデーション仕様

### 入力チェック項目

| 項目 | チェック内容 | エラーメッセージ |
|------|--------------|------------------|
| 日付 | 空欄でないか | "日付を入力してください" |
| 日付 | 有効な日付形式か | "正しい日付を入力してください" |
| カテゴリ | 選択されているか | "カテゴリを選択してください" |
| 金額 | 空欄でないか | "金額を入力してください" |
| 金額 | 数値であるか | "金額は数値で入力してください" |
| 金額 | 1以上であるか | "金額は1以上の数値を入力してください" |
| メモ | 空欄でないか | "メモを入力してください" |
| メモ | 100文字以内か | "メモは100文字以内で入力してください" |

---

## 動作環境

### 対応ブラウザ
- Google Chrome（最新版）
- Mozilla Firefox（最新版）
- Microsoft Edge（最新版）
- Safari（最新版）

### 必要な機能
- JavaScript有効
- localStorage有効（約5-10MB利用可能）
- Cookie不要

---

## セキュリティとプライバシー

1. **データの保存場所**: ユーザーのブラウザ内のみ（サーバーに送信されない）
2. **XSS対策**: ユーザー入力を`textContent`で挿入し、HTMLインジェクションを防止
3. **入力バリデーション**: クライアント側で徹底的にチェック
4. **データの暗号化**: localStorageは平文保存（機密性の高いデータは扱わない前提）

---

## ファイル構成

```
expense-tracker/
├── index.html       # メインHTML
├── style.css        # スタイルシート
└── script.js        # JavaScriptロジック
```

---

## まとめ

本仕様書は、以下の3つの必須機能を持つ支出記録アプリの詳細設計です：

1. **支出記録**: 日付・カテゴリ・金額・メモを入力してlocalStorageに保存
2. **支出一覧表示**: 登録済み支出を一覧表示し、削除機能を提供
3. **カテゴリ別集計**: 7つのカテゴリ別に支出を集計し、合計金額を表示

HTML/CSS/JavaScriptのみで実装でき、サーバー不要のシンプルなWebアプリケーションです。
