// ==============================
// グローバル変数
// ==============================
// 支出データを格納する配列（メモリ上で管理）
let expenses = [];

// localStorageのキー名
const STORAGE_KEY = 'expenses';

// ==============================
// 初期化関数
// ==============================
/**
 * アプリケーション初期化処理
 * ページ読み込み時に実行され、以下を行う：
 * 1. localStorageからデータ読み込み
 * 2. 支出一覧の描画
 * 3. カテゴリ別集計の描画
 * 4. イベントリスナーの設定
 * 5. 日付入力欄のデフォルト値設定
 */
function init() {
    console.log('[Init] アプリケーションを初期化中...');

    // localStorageからデータを読み込む
    loadFromLocalStorage();

    // 画面描画
    renderExpenses();
    renderCategorySummary();

    // イベントリスナー設定
    setupEventListeners();

    // 日付入力欄に今日の日付を設定
    setDefaultDate();

    console.log('[Init] 初期化完了');
}

// ==============================
// イベントリスナー設定
// ==============================
/**
 * フォーム送信やボタンクリックのイベントリスナーを設定
 */
function setupEventListeners() {
    // フォーム送信イベント
    const form = document.getElementById('expense-form');
    form.addEventListener('submit', handleFormSubmit);
}

/**
 * フォーム送信時の処理
 * @param {Event} event - フォーム送信イベント
 */
function handleFormSubmit(event) {
    // デフォルトのフォーム送信動作（ページリロード）を防止
    event.preventDefault();

    // フォームデータを取得
    const form = event.target;
    const formData = {
        date: form.date.value,
        category: form.category.value,
        amount: form.amount.value,
        memo: form.memo.value
    };

    console.log('[Form] フォーム送信:', formData);

    // バリデーション実行
    const validationError = validateInput(formData);
    if (validationError) {
        alert(validationError);
        return;
    }

    // 支出を追加
    addExpense(formData);

    // フォームをリセット
    form.reset();

    // 日付を今日にリセット
    setDefaultDate();
}

// ==============================
// データ管理（CRUD操作）
// ==============================
/**
 * 新しい支出データを追加
 * @param {Object} expenseData - フォームから取得した支出データ
 * @param {string} expenseData.date - 日付（YYYY-MM-DD）
 * @param {string} expenseData.category - カテゴリ
 * @param {string} expenseData.amount - 金額（文字列）
 * @param {string} expenseData.memo - メモ
 */
function addExpense(expenseData) {
    // 支出オブジェクトを作成
    const expense = {
        id: Date.now().toString(), // ユニークなID（タイムスタンプ）
        date: expenseData.date,
        category: expenseData.category,
        amount: parseInt(expenseData.amount, 10), // 数値に変換
        memo: expenseData.memo,
        createdAt: new Date().toISOString() // 作成日時（ISO 8601形式）
    };

    console.log('[Add] 支出を追加:', expense);

    // 配列に追加
    expenses.push(expense);

    // localStorageに保存
    saveToLocalStorage();

    // 画面を再描画
    renderExpenses();
    renderCategorySummary();
}

/**
 * 支出データを削除
 * @param {string} id - 削除する支出のID
 */
function deleteExpense(id) {
    // 確認ダイアログを表示
    if (!confirm('この支出データを削除しますか？')) {
        return;
    }

    console.log('[Delete] 支出を削除:', id);

    // 該当IDの支出を配列から削除
    expenses = expenses.filter(expense => expense.id !== id);

    // localStorageに保存
    saveToLocalStorage();

    // 画面を再描画
    renderExpenses();
    renderCategorySummary();
}

// ==============================
// ローカルストレージ操作
// ==============================
/**
 * localStorageにデータを保存
 */
function saveToLocalStorage() {
    try {
        const json = JSON.stringify(expenses);
        localStorage.setItem(STORAGE_KEY, json);
        console.log('[Storage] データを保存しました（件数:' + expenses.length + '）');
    } catch (error) {
        console.error('[Storage] 保存エラー:', error);
        alert('データの保存に失敗しました。ブラウザの設定を確認してください。');
    }
}

/**
 * localStorageからデータを読み込み
 */
function loadFromLocalStorage() {
    try {
        const json = localStorage.getItem(STORAGE_KEY);

        if (json) {
            expenses = JSON.parse(json);
            console.log('[Storage] データを読み込みました（件数:' + expenses.length + '）');
        } else {
            expenses = [];
            console.log('[Storage] 保存データがありません');
        }
    } catch (error) {
        console.error('[Storage] 読み込みエラー:', error);
        expenses = [];
        alert('データの読み込みに失敗しました。');
    }
}

// ==============================
// 画面描画（支出一覧）
// ==============================
/**
 * 支出一覧を画面に描画
 */
function renderExpenses() {
    const tbody = document.getElementById('expense-list');
    const countElement = document.getElementById('expense-count');

    // 支出件数を更新
    countElement.textContent = expenses.length;

    // データがない場合
    if (expenses.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-state">
                <td colspan="5">まだ支出が記録されていません</td>
            </tr>
        `;
        return;
    }

    // 日付の新しい順にソート
    const sortedExpenses = [...expenses].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });

    // テーブル行を生成
    const rows = sortedExpenses.map(expense => {
        return `
            <tr data-id="${expense.id}">
                <td data-label="日付">${formatDate(expense.date)}</td>
                <td data-label="カテゴリ">
                    <span class="category-badge">${expense.category}</span>
                </td>
                <td data-label="金額" class="amount-cell">${formatCurrency(expense.amount)}</td>
                <td data-label="メモ">${escapeHtml(expense.memo)}</td>
                <td data-label="操作">
                    <button
                        class="btn btn-danger"
                        onclick="deleteExpense('${expense.id}')"
                        aria-label="削除"
                    >
                        削除
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    tbody.innerHTML = rows;

    console.log('[Render] 支出一覧を描画しました（件数:' + expenses.length + '）');
}

// ==============================
// 画面描画（カテゴリ別集計）
// ==============================
/**
 * カテゴリ別の集計を画面に描画
 */
function renderCategorySummary() {
    const container = document.getElementById('category-summary');

    // データがない場合
    if (expenses.length === 0) {
        container.innerHTML = `
            <div class="summary-empty">
                支出データがありません
            </div>
        `;
        return;
    }

    // カテゴリ別に集計
    const categoryMap = {};

    expenses.forEach(expense => {
        const category = expense.category;

        if (!categoryMap[category]) {
            categoryMap[category] = {
                total: 0,
                count: 0
            };
        }

        categoryMap[category].total += expense.amount;
        categoryMap[category].count += 1;
    });

    // 集計カードを生成
    const cards = Object.keys(categoryMap).map(category => {
        const data = categoryMap[category];
        return `
            <div class="summary-card">
                <h3>${category}</h3>
                <div class="amount">${formatCurrency(data.total)}</div>
                <div class="count">${data.count}件の支出</div>
            </div>
        `;
    }).join('');

    container.innerHTML = cards;

    console.log('[Render] カテゴリ別集計を描画しました');
}

// ==============================
// バリデーション
// ==============================
/**
 * フォーム入力値のバリデーション
 * @param {Object} data - フォームデータ
 * @returns {string|null} エラーメッセージ、エラーがなければnull
 */
function validateInput(data) {
    // 日付チェック
    if (!data.date || data.date.trim() === '') {
        return '日付を入力してください';
    }

    // カテゴリチェック
    if (!data.category || data.category.trim() === '') {
        return 'カテゴリを選択してください';
    }

    // 金額チェック
    if (!data.amount || data.amount.trim() === '') {
        return '金額を入力してください';
    }

    const amount = parseInt(data.amount, 10);
    if (isNaN(amount) || amount < 1) {
        return '金額は1円以上で入力してください';
    }

    if (amount > 9999999) {
        return '金額は9,999,999円以下で入力してください';
    }

    // メモチェック
    if (!data.memo || data.memo.trim() === '') {
        return 'メモを入力してください';
    }

    if (data.memo.length > 100) {
        return 'メモは100文字以内で入力してください';
    }

    // バリデーション成功
    return null;
}

// ==============================
// ユーティリティ関数
// ==============================
/**
 * 日付をフォーマット（YYYY-MM-DD → M/D）
 * @param {string} dateString - 日付文字列（YYYY-MM-DD）
 * @returns {string} フォーマットされた日付（M/D）
 */
function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00'); // タイムゾーンの問題を回避
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
}

/**
 * 金額をフォーマット（カンマ区切り + 円記号）
 * @param {number} amount - 金額
 * @returns {string} フォーマットされた金額（例: ¥1,000）
 */
function formatCurrency(amount) {
    return '¥' + amount.toLocaleString('ja-JP');
}

/**
 * HTMLエスケープ処理（XSS対策）
 * @param {string} text - エスケープするテキスト
 * @returns {string} エスケープされたテキスト
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 日付入力欄に今日の日付を設定
 */
function setDefaultDate() {
    const dateInput = document.getElementById('date-input');
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    dateInput.value = `${year}-${month}-${day}`;
}

// ==============================
// アプリケーション起動
// ==============================
// DOMContentLoadedイベントで初期化関数を実行
document.addEventListener('DOMContentLoaded', init);

console.log('main.js が読み込まれました');
