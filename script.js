// script.js

// DOMが完全に読み込まれた後にスクリプトを実行
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm'); // ログインフォーム要素を取得
    const usernameInput = document.getElementById('username'); // ユーザー名入力フィールドを取得
    const passwordInput = document.getElementById('password'); // パスワード入力フィールドを取得
    const messageBox = document.getElementById('messageBox'); // メッセージ表示ボックスを取得

    // フォーム送信イベントリスナーを追加
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); // フォームのデフォルト送信動作をキャンセル

        const username = usernameInput.value.trim(); // ユーザー名入力値を取得し、前後の空白を削除
        const password = passwordInput.value.trim(); // パスワード入力値を取得し、前後の空白を削除

        // 簡単な入力検証
        if (username === '' || password === '') {
            displayMessage('すべてのフィールドを入力してください。', 'error');
            return; // 処理を中断
        }

        // ここで実際の認証ロジックを実装します。
        // 例として、ハードコードされたユーザー名とパスワードで認証をシミュレートします。
        if (username === 'testuser' && password === 'password123') {
            displayMessage('ログインに成功しました！', 'success');
            // 成功後のリダイレクトや他の処理をここに追加できます
            // 例: window.location.href = '/dashboard';
            loginForm.reset(); // フォームをリセット
        } else {
            displayMessage('ユーザー名またはパスワードが正しくありません。', 'error');
        }
    });

    /**
     * メッセージボックスにメッセージを表示する関数
     * @param {string} message - 表示するメッセージテキスト
     * @param {'success' | 'error'} type - メッセージの種類（'success'または'error'）
     */
    function displayMessage(message, type) {
        messageBox.textContent = message; // メッセージテキストを設定
        messageBox.className = `message-box ${type}`; // タイプに基づいてCSSクラスを設定
        messageBox.style.display = 'block'; // メッセージボックスを表示
        // 3秒後にメッセージを非表示にする
        setTimeout(() => {
            messageBox.style.display = 'none';
            messageBox.textContent = '';
        }, 3000);
    }
});
