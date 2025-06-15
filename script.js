document.addEventListener('DOMContentLoaded', () => {
    const tabContainer = document.getElementById('tabContainer');
    const tabContentWrapper = document.getElementById('tabContentWrapper');
    const addInputAreaBtn = document.getElementById('addInputAreaBtn');
    const tabSettingsBtn = document.getElementById('tabSettingsBtn');
    const historyListBtn = document.getElementById('historyListBtn');
    const tabSettingsModal = document.getElementById('tabSettingsModal');
    const closeTabSettingsModalBtn = document.getElementById('closeTabSettingsModalBtn');
    const tabsList = document.getElementById('tabsList');
    const newTabNameInput = document.getElementById('newTabNameInput');
    const addTabBtn = document.getElementById('addTabBtn');
    const historyListModal = document.getElementById('historyListModal');
    const closeHistoryListModalBtn = document.getElementById('closeHistoryListModalBtn');
    const historyTabFilter = document.getElementById('historyTabFilter');
    const historyContent = document.getElementById('historyContent');
    const clearAllHistoryBtn = document.getElementById('clearAllHistoryBtn');

    // Utility functions for color conversion and lightening
    // HEX色コードをHSL形式に変換する関数
    function hexToHsl(hex) {
        let r = 0, g = 0, b = 0;
        // 3桁のHEXを処理 (例: #F00 -> #FF0000)
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 7) { // 6桁のHEXを処理
            r = parseInt(hex.substring(1, 3), 16);
            g = parseInt(hex.substring(3, 5), 16);
            b = parseInt(hex.substring(5, 7), 16);
        }
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // 無彩色
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return [h * 360, s * 100, l * 100]; // H, S, Lをパーセンテージで返す
    }

    // HSL形式をHEX色コードに変換する関数
    function hslToHex(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        let r, g, b;

        if (s === 0) {
            r = g = b = l; // 無彩色
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        const toHex = x => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    // HEX色を明るくする関数
    function lightenHexColor(hex, percent) {
        const [h, s, l] = hexToHsl(hex);
        let newL = Math.min(100, l + percent); // 明度を増やし、最大100%
        // パステル調を保つために、最低明度を保証 (調整可能)
        if (newL < 70) newL = 70; 
        return hslToHex(h, s, newL);
    }

    // デフォルトのパステル調の色を設定
    const initialDefaultTabColor = '#A7C7E7'; // パステルブルーのHEX (濃いめ)
    const initialDefaultListColor = lightenHexColor(initialDefaultTabColor, 15); // タブより15%明るく

    let tabs = JSON.parse(localStorage.getItem('tabs')) || [{ id: 'default', name: 'デフォルト', tabBgColor: initialDefaultTabColor, listBgColor: initialDefaultListColor }];
    
    // 既存のタブデータに色プロパティがない場合、デフォルト値を設定
    tabs = tabs.map(tab => {
        if (!tab.tabBgColor) {
            tab.tabBgColor = initialDefaultTabColor;
            tab.listBgColor = initialDefaultListColor;
        }
        return tab;
    });

    let activeTabId = localStorage.getItem('activeTabId') || tabs[0].id;
    let items = JSON.parse(localStorage.getItem('items')) || {}; // { tabId: [{ id, text, checked }, ...] }
    let history = JSON.parse(localStorage.getItem('history')) || []; // [{ id, text, tabId, timestamp }]

    // 初期データを設定
    if (!items[activeTabId]) {
        items[activeTabId] = [];
    }

    // データ保存ヘルパー関数
    const saveTabs = () => localStorage.setItem('tabs', JSON.stringify(tabs));
    const saveItems = () => localStorage.setItem('items', JSON.stringify(items));
    const saveHistory = () => localStorage.setItem('history', JSON.stringify(history));
    const saveActiveTab = () => localStorage.setItem('activeTabId', activeTabId);

    // モーダル表示/非表示関数
    const showModal = (modalElement) => {
        modalElement.classList.remove('hidden');
        setTimeout(() => {
            modalElement.querySelector('.modal-content').classList.remove('opacity-0', 'scale-95');
            modalElement.querySelector('.modal-content').classList.add('opacity-100', 'scale-100');
        }, 10); // 短い遅延でトランジションをトリガー
    };

    const hideModal = (modalElement) => {
        modalElement.querySelector('.modal-content').classList.remove('opacity-100', 'scale-100');
        modalElement.querySelector('.modal-content').classList.add('opacity-0', 'scale-95');
        setTimeout(() => {
            modalElement.classList.add('hidden');
        }, 300); // トランジションが完了するのを待つ
    };

    // タブのレンダリング
    const renderTabs = () => {
        tabContainer.innerHTML = '';
        tabContainer.classList.add('tab-container-compact'); // 新しいコンテナクラスを追加
        tabs.forEach(tab => {
            const button = document.createElement('button');
            button.id = `tab-${tab.id}`;
            button.className = `tab-button text-sm font-medium`; // Tailwindクラスを減らし、カスタムCSSを使用
            button.textContent = tab.name;
            button.onclick = () => switchTab(tab.id);

            if (tab.id === activeTabId) {
                button.classList.add('active-tab');
                button.style.setProperty('--tab-bg-color', tab.tabBgColor); // アクティブなタブの背景色をCSS変数で設定
            } else {
                // 非アクティブなタブの背景色はCSSで設定済み
            }
            tabContainer.appendChild(button);
        });
        // アクティブなタブが画面中央に表示されるようにスクロール
        const activeTabElement = document.getElementById(`tab-${activeTabId}`);
        if (activeTabElement) {
            activeTabElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    };

    // タブコンテンツのレンダリング
    const renderTabContents = () => {
        tabContentWrapper.innerHTML = '';
        tabs.forEach(tab => {
            const tabContentDiv = document.createElement('div');
            tabContentDiv.id = `tab-content-${tab.id}`;
            tabContentDiv.className = 'tab-content p-4 pt-0 space-y-4 overflow-y-auto'; // overflow-y-autoを追加
            
            // 各タブのアイテムが存在しない場合、空の配列で初期化
            if (!items[tab.id]) {
                items[tab.id] = [];
            }

            items[tab.id].forEach(item => {
                tabContentDiv.appendChild(createInputArea(item));
            });
            tabContentWrapper.appendChild(tabContentDiv);
        });
        // アクティブなタブの内容を表示
        updateTabContentDisplay();
    };

    // アクティブタブのコンテンツ表示を更新
    const updateTabContentDisplay = () => {
        const activeTabIndex = tabs.findIndex(tab => tab.id === activeTabId);
        if (activeTabIndex !== -1) {
            tabContentWrapper.style.transform = `translateX(-${activeTabIndex * 100}%)`;
            // 現在のタブコンテンツの高さを調整
            const activeContentDiv = document.getElementById(`tab-content-${activeTabId}`);
            if (activeContentDiv) {
                tabContentWrapper.style.height = `${activeContentDiv.scrollHeight}px`;
            }
        }
    };

    // タブの切り替え
    const switchTab = (id) => {
        activeTabId = id;
        saveActiveTab();
        renderTabs();
        renderTabContents(); // タブ切り替え時にもアイテムの背景色を正しく適用するために再レンダリング
        updateTabContentDisplay();
    };

    // 入力エリアの作成
    const createInputArea = (itemData) => {
        const itemDiv = document.createElement('div');
        itemDiv.id = `item-${itemData.id}`;
        itemDiv.className = 'flex items-center p-4 rounded-xl shadow-md space-x-3 transition-all duration-300 transform hover:scale-[1.02]';
        
        // 現在のアクティブタブのlistBgColorを適用
        const activeTabObj = tabs.find(t => t.id === activeTabId);
        itemDiv.style.backgroundColor = activeTabObj ? activeTabObj.listBgColor : '#ffffff'; // Fallback to white

        // チェックマーク (チェックボックス)
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = itemData.checked;
        checkbox.className = 'form-checkbox h-6 w-6 text-blue-600 rounded-full border-gray-300 focus:ring-blue-500 transition-colors duration-200 cursor-pointer';
        checkbox.onchange = () => toggleCheck(itemData.id);

        // 入力フィールド
        const input = document.createElement('input');
        input.type = 'text';
        input.value = itemData.text;
        input.placeholder = 'ここにタスクを入力';
        // tabindexを明示的に設定し、スマートフォンでの入力問題を改善
        input.setAttribute('tabindex', '0'); 
        input.className = 'flex-grow p-2 border-none focus:ring-0 focus:outline-none text-lg text-gray-800 bg-transparent';
        input.oninput = (e) => updateItemText(itemData.id, e.target.value);

        // 削除ボタン
        const deleteButton = document.createElement('button');
        deleteButton.className = 'p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full';
        deleteButton.innerHTML = '<i class="fas fa-trash-alt text-lg"></i>';
        deleteButton.onclick = () => deleteInputArea(itemData.id);

        itemDiv.appendChild(checkbox);
        itemDiv.appendChild(input);
        itemDiv.appendChild(deleteButton);

        return itemDiv;
    };

    // チェックマークの切り替え (削除と履歴追加)
    const toggleCheck = (id) => {
        // アニメーションのために一時的にスタイルを変更
        const itemElement = document.getElementById(`item-${id}`);
        if (itemElement) {
            itemElement.classList.add('opacity-0', 'scale-y-0', 'h-0', 'my-0', 'transition-all', 'duration-500', 'ease-in-out');
            itemElement.style.overflow = 'hidden'; // 高さが0になる際に内容を隠す
        }

        setTimeout(() => {
            const currentItems = items[activeTabId];
            const itemIndex = currentItems.findIndex(item => item.id === id);

            if (itemIndex !== -1) {
                const [checkedItem] = currentItems.splice(itemIndex, 1);
                checkedItem.timestamp = Date.now();
                checkedItem.tabId = activeTabId; // どのタブからチェックされたかを履歴に保存
                history.push(checkedItem);
                saveItems();
                saveHistory();
                renderTabContents(); // アイテムを削除した後、再レンダリング
                updateTabContentDisplay(); // コンテンツの高さも更新
            }
        }, 500); // アニメーション時間に合わせて遅延
    };


    // 入力エリアのテキストを更新
    const updateItemText = (id, newText) => {
        const currentItems = items[activeTabId];
        const item = currentItems.find(item => item.id === id);
        if (item) {
            item.text = newText;
            saveItems();
        }
    };

    // 入力エリアを削除
    const deleteInputArea = (id) => {
        const itemElement = document.getElementById(`item-${id}`);
        if (itemElement) {
            itemElement.classList.add('opacity-0', 'scale-y-0', 'h-0', 'my-0', 'transition-all', 'duration-500', 'ease-in-out');
            itemElement.style.overflow = 'hidden';
        }

        setTimeout(() => {
            items[activeTabId] = items[activeTabId].filter(item => item.id !== id);
            saveItems();
            renderTabContents();
            updateTabContentDisplay();
        }, 500); // アニメーション時間に合わせて遅延
    };

    // 新しい入力エリアを追加
    addInputAreaBtn.onclick = () => {
        const newItem = {
            id: Date.now().toString(), // ユニークなID
            text: '',
            checked: false
        };
        if (!items[activeTabId]) {
            items[activeTabId] = [];
        }
        items[activeTabId].push(newItem);
        saveItems();
        renderTabContents();
        updateTabContentDisplay(); // コンテンツの高さも更新
        // 新しいアイテムがスクロールビューに入るようにする
        setTimeout(() => {
            const newItemElement = document.getElementById(`item-${newItem.id}`);
            if (newItemElement) {
                newItemElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        }, 100);
    };

    // タブ設定モーダルのレンダリング
    const renderTabSettings = () => {
        tabsList.innerHTML = '';
        tabs.forEach((tab, index) => {
            const tabItem = document.createElement('div');
            tabItem.className = 'flex items-center bg-gray-100 p-3 rounded-md shadow-sm text-gray-700';
            tabItem.setAttribute('data-tab-id', tab.id); // ドラッグアンドドロップ用

            const tabNameSpan = document.createElement('span');
            tabNameSpan.textContent = tab.name;
            tabNameSpan.className = 'flex-grow font-medium';

            // 色選択用のinput[type="color"]
            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.className = 'ml-3 w-8 h-8 rounded-full border border-gray-300 cursor-pointer';
            colorInput.value = tab.tabBgColor; // 現在の色を設定
            colorInput.title = 'タブの背景色を選択';
            colorInput.onchange = (e) => {
                const newTabColor = e.target.value;
                tab.tabBgColor = newTabColor;
                tab.listBgColor = lightenHexColor(newTabColor, 15); // タブの色からリスト色を生成（15%明るく）
                saveTabs();
                renderTabs(); // メインのタブ表示を更新
                renderTabContents(); // リストアイテムの背景色を更新
            };

            // 削除ボタン
            const deleteTabButton = document.createElement('button');
            deleteTabButton.className = 'ml-3 p-1 text-red-500 hover:text-red-700 transition-colors rounded-full';
            deleteTabButton.innerHTML = '<i class="fas fa-times"></i>';
            deleteTabButton.onclick = () => deleteTab(tab.id);

            // 移動ハンドル (ドラッグアンドドロップ)
            const moveHandle = document.createElement('button');
            moveHandle.className = 'ml-3 p-1 text-gray-500 hover:text-gray-700 cursor-grab rounded-full';
            moveHandle.innerHTML = '<i class="fas fa-arrows-alt"></i>';
            moveHandle.draggable = true;

            tabItem.appendChild(tabNameSpan);
            tabItem.appendChild(colorInput); // カラーピッカーを追加
            tabItem.appendChild(deleteTabButton);
            tabItem.appendChild(moveHandle);
            tabsList.appendChild(tabItem);
        });

        // ドラッグアンドドロップイベントリスナー
        let dragSrcEl = null;

        function handleDragStart(e) {
            dragSrcEl = this;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', this.dataset.tabId);
            this.classList.add('opacity-50');
        }

        function handleDragOver(e) {
            e.preventDefault(); // ドロップを許可する
            e.dataTransfer.dropEffect = 'move';
            return false;
        }

        function handleDragEnter(e) {
            this.classList.add('bg-blue-100');
        }

        function handleDragLeave(e) {
            this.classList.remove('bg-blue-100');
        }

        function handleDrop(e) {
            e.stopPropagation(); // 一部のブラウザでリダイレクトを防ぐ
            if (dragSrcEl !== this) {
                const dragId = e.dataTransfer.getData('text/plain');
                const dropId = this.dataset.tabId;

                const dragIndex = tabs.findIndex(t => t.id === dragId);
                const dropIndex = tabs.findIndex(t => t.id === dropId);

                const [removed] = tabs.splice(dragIndex, 1);
                tabs.splice(dropIndex, 0, removed);

                saveTabs();
                renderTabSettings(); // 設定モーダルを再レンダリング
                renderTabs(); // メインのタブを再レンダリング
            }
            this.classList.remove('bg-blue-100');
            return false;
        }

        function handleDragEnd(e) {
            this.classList.remove('opacity-50');
            const tabItems = document.querySelectorAll('#tabsList > div');
            tabItems.forEach(item => item.classList.remove('bg-blue-100'));
        }

        const tabItems = document.querySelectorAll('#tabsList > div');
        tabItems.forEach(item => {
            item.addEventListener('dragstart', handleDragStart);
            item.addEventListener('dragover', handleDragOver);
            item.addEventListener('dragenter', handleDragEnter);
            item.addEventListener('dragleave', handleDragLeave);
            item.addEventListener('drop', handleDrop);
            item.addEventListener('dragend', handleDragEnd);
        });
    };

    // タブ設定モーダル表示
    tabSettingsBtn.onclick = () => {
        renderTabSettings();
        showModal(tabSettingsModal);
    };

    // タブ設定モーダル閉じる
    closeTabSettingsModalBtn.onclick = () => hideModal(tabSettingsModal);
    tabSettingsModal.addEventListener('click', (e) => {
        if (e.target === tabSettingsModal) {
            hideModal(tabSettingsModal);
        }
    });

    // 新しいタブを追加
    addTabBtn.onclick = () => {
        const newTabName = newTabNameInput.value.trim();
        if (newTabName) {
            // 新しいタブにデフォルトのパステル色を適用
            const newTab = { id: Date.now().toString(), name: newTabName, tabBgColor: initialDefaultTabColor, listBgColor: initialDefaultListColor };
            tabs.push(newTab);
            items[newTab.id] = []; // 新しいタブのアイテムを初期化
            saveTabs();
            saveItems();
            newTabNameInput.value = '';
            renderTabs();
            renderTabContents();
            renderTabSettings(); // 設定モーダルも更新
            switchTab(newTab.id); // 新しいタブに切り替える
        }
    };

    // タブを削除
    const deleteTab = (id) => {
        if (tabs.length === 1) {
            alert('最後のタブは削除できません。');
            return;
        }
        const confirmDelete = confirm(`"${tabs.find(t => t.id === id).name}"タブを削除しますか？このタブのアイテムもすべて削除されます。`);
        if (confirmDelete) {
            tabs = tabs.filter(tab => tab.id !== id);
            delete items[id]; // 該当タブのアイテムを削除
            // 履歴から該当タブのアイテムを削除
            history = history.filter(item => item.tabId !== id);

            saveTabs();
            saveItems();
            saveHistory();

            if (activeTabId === id) {
                activeTabId = tabs[0].id; // 削除されたタブがアクティブだった場合、最初のタブに切り替える
                saveActiveTab();
            }
            renderTabs();
            renderTabContents();
            renderTabSettings(); // 設定モーダルも更新
            updateTabContentDisplay(); // コンテンツの高さも更新
        }
    };

    // カタカナをひらがなに変換する関数
    function katakanaToHiragana(str) {
        return str.replace(/[\u30a1-\u30f6]/g, function(match) {
            return String.fromCharCode(match.charCodeAt(0) - 0x60);
        });
    }

    // 履歴一覧モーダルのレンダリング
    const renderHistoryList = () => {
        historyTabFilter.innerHTML = '<option value="all">全てのタブ</option>';
        tabs.forEach(tab => {
            const option = document.createElement('option');
            option.value = tab.id;
            option.textContent = tab.name;
            historyTabFilter.appendChild(option);
        });
        historyTabFilter.value = historyTabFilter.dataset.selected || 'all'; // 選択状態を保持

        filterAndRenderHistory();
    };

    // 履歴のフィルタリングとレンダリング
    const filterAndRenderHistory = () => {
        historyContent.innerHTML = '';
        const filterTabId = historyTabFilter.value;
        let filteredHistory = history.sort((a, b) => b.timestamp - a.timestamp); // 最新が上

        if (filterTabId !== 'all') {
            filteredHistory = filteredHistory.filter(item => item.tabId === filterTabId);
        }

        if (filteredHistory.length === 0) {
            historyContent.innerHTML = '<p class="text-gray-500 text-center py-8">履歴はありません。</p>';
            return;
        }

        const monthlyHistory = {};
        filteredHistory.forEach(item => {
            const date = new Date(item.timestamp);
            const yearMonth = `${date.getFullYear()}年${date.getMonth() + 1}月`;
            if (!monthlyHistory[yearMonth]) {
                monthlyHistory[yearMonth] = [];
            }
            monthlyHistory[yearMonth].push(item);
        });

        // 月ごとのタスクをマージしてカウント
        for (const yearMonth in monthlyHistory) {
            const monthDiv = document.createElement('div');
            monthDiv.className = 'bg-gray-50 p-4 rounded-lg shadow-sm mb-4'; // 各月のセクションに下マージンを追加

            const monthHeader = document.createElement('h3');
            monthHeader.className = 'text-xl font-semibold mb-3 text-gray-700 border-b pb-2';
            monthHeader.textContent = `${yearMonth} (${monthlyHistory[yearMonth].length}個の完了タスク)`; // 総完了数を表示
            monthDiv.appendChild(monthHeader);

            const taskCounts = {};
            monthlyHistory[yearMonth].forEach(item => {
                // ここでカタカナをひらがなに変換してキーとして使用
                const normalizedTaskText = katakanaToHiragana(item.text || '（テキストなし）');
                taskCounts[normalizedTaskText] = (taskCounts[normalizedTaskText] || 0) + 1;
            });

            // マージされたタスクのリスト表示
            const mergedTaskList = document.createElement('ul');
            mergedTaskList.className = 'list-none p-0 m-0 space-y-2'; // リストスタイルをリセットし、スペースを追加

            // キー（正規化されたタスク名）でソートして表示
            Object.keys(taskCounts).sort().forEach(normalizedTaskText => {
                const count = taskCounts[normalizedTaskText];
                const listItem = document.createElement('li');
                listItem.className = 'flex items-center bg-white p-3 border border-gray-200 rounded-md shadow-xs text-gray-800 break-words';
                listItem.innerHTML = `
                    <i class="fas fa-check-circle text-green-500 mr-2 text-lg flex-shrink-0"></i>
                    <span class="flex-grow text-base">${normalizedTaskText}</span>
                    <span class="ml-2 text-sm font-semibold text-blue-600 flex-shrink-0">(${count}回完了)</span>
                `;
                mergedTaskList.appendChild(listItem);
            });
            monthDiv.appendChild(mergedTaskList);
            historyContent.appendChild(monthDiv);
        }
    };

    // 履歴一覧モーダル表示
    historyListBtn.onclick = () => {
        renderHistoryList();
        showModal(historyListModal);
    };

    // 履歴一覧モーダル閉じる
    closeHistoryListModalBtn.onclick = () => hideModal(historyListModal);
    historyListModal.addEventListener('click', (e) => {
        if (e.target === historyListModal) {
            hideModal(historyListModal);
        }
    });

    // 履歴フィルタ変更時の処理
    historyTabFilter.onchange = (e) => {
        historyTabFilter.dataset.selected = e.target.value; // 選択状態を保持
        filterAndRenderHistory();
    };

    // 全履歴消去ボタン
    clearAllHistoryBtn.onclick = () => {
        const confirmClear = confirm('全ての履歴を消去しますか？この操作は元に戻せません。');
        if (confirmClear) {
            history = [];
            saveHistory();
            renderHistoryList(); // 履歴一覧を更新
            alert('全ての履歴が消去されました。');
        }
    };

    // --- タブのスライド切り替え機能 (タッチイベント) ---
    let startX = 0;
    let currentTranslateX = 0;
    let isDragging = false;
    let isTouchedOnInteractiveElement = false; // 新しいフラグ

    tabContentWrapper.addEventListener('touchstart', (e) => {
        // タッチが入力フィールドやボタン上で開始された場合、スライド処理を無効化
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            isTouchedOnInteractiveElement = true;
            return;
        }
        isTouchedOnInteractiveElement = false;

        startX = e.touches[0].clientX;
        currentTranslateX = parseFloat(tabContentWrapper.style.transform.replace('translateX(', '').replace('%)', '')) || 0;
        isDragging = true;
        tabContentWrapper.style.transition = 'none'; // ドラッグ中はトランジションを無効化
    });

    tabContentWrapper.addEventListener('touchmove', (e) => {
        if (!isDragging || isTouchedOnInteractiveElement) return; // 新しいフラグをチェック
        const currentX = e.touches[0].clientX;
        const diffX = currentX - startX;
        tabContentWrapper.style.transform = `translateX(${currentTranslateX + (diffX / window.innerWidth) * 100}%)`;
    });

    tabContentWrapper.addEventListener('touchend', () => {
        if (!isDragging || isTouchedOnInteractiveElement) return; // 新しいフラグをチェック
        isDragging = false;
        tabContentWrapper.style.transition = 'transform 0.3s ease-in-out'; // ドラッグ終了後にトランジションを有効化

        const endX = parseFloat(tabContentWrapper.style.transform.replace('translateX(', '').replace('%)', '')) || 0;
        const threshold = 15; // スライドの閾値 (パーセント)

        const activeTabIndex = tabs.findIndex(tab => tab.id === activeTabId);
        let newActiveTabIndex = activeTabIndex;

        // 左にスワイプ（次のタブへ）
        if (endX < currentTranslateX - threshold && newActiveTabIndex < tabs.length - 1) {
            newActiveTabIndex++;
        }
        // 右にスワイプ（前のタブへ）
        else if (endX > currentTranslateX + threshold && newActiveTabIndex > 0) {
            newActiveTabIndex--;
        }

        switchTab(tabs[newActiveTabIndex].id); // 新しいタブに切り替える

        // タブコンテンツの高さを調整
        setTimeout(() => {
            const activeContentDiv = document.getElementById(`tab-content-${activeTabId}`);
            if (activeContentDiv) {
                tabContentWrapper.style.height = `${activeContentDiv.scrollHeight}px`;
            }
        }, 300); // 切り替えアニメーション後に高さを調整
        isTouchedOnInteractiveElement = false; // リセット
    });

    // ウィンドウのリサイズ時にコンテンツの高さを調整
    window.addEventListener('resize', () => {
        updateTabContentDisplay();
    });

    // 初期レンダリング
    renderTabs();
    renderTabContents();
});
