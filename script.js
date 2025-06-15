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

    // LLM関連の要素は削除されました

    let tabs = JSON.parse(localStorage.getItem('tabs')) || [{ id: 'default', name: 'デフォルト' }];
    let activeTabId = localStorage.getItem('activeTabId') || tabs[0].id;
    let items = JSON.parse(localStorage.getItem('items')) || {}; // { tabId: [{ id, text, checked }, ...] }
    let history = JSON.parse(localStorage.getItem('history')) || []; // [{ id, text, tabId, timestamp }]

    // LLM提案を適用する入力フィールドの参照は不要になりました

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
        tabs.forEach(tab => {
            const button = document.createElement('button');
            button.id = `tab-${tab.id}`;
            button.className = `px-4 py-2 mx-1 rounded-full text-sm font-medium transition-all duration-200 ease-in-out ${
                tab.id === activeTabId ? 'bg-white text-blue-700 shadow-md' : 'text-white hover:bg-white hover:bg-opacity-20'
            }`;
            button.textContent = tab.name;
            button.onclick = () => switchTab(tab.id);
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
        updateTabContentDisplay();
    };

    // 入力エリアの作成
    const createInputArea = (itemData) => {
        const itemDiv = document.createElement('div');
        itemDiv.id = `item-${itemData.id}`;
        itemDiv.className = 'flex items-center bg-white p-4 rounded-xl shadow-md space-x-3 transition-all duration-300 transform hover:scale-[1.02]';

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

        // 提案ボタン (LLM機能) は削除されました

        // 削除ボタン
        const deleteButton = document.createElement('button');
        deleteButton.className = 'p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full';
        deleteButton.innerHTML = '<i class="fas fa-trash-alt text-lg"></i>';
        deleteButton.onclick = () => deleteInputArea(itemData.id);

        itemDiv.appendChild(checkbox);
        itemDiv.appendChild(input);
        itemDiv.appendChild(deleteButton); // 提案ボタンが削除されたため、削除ボタンの位置が変わる可能性あり

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
            const newTab = { id: Date.now().toString(), name: newTabName };
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

        for (const yearMonth in monthlyHistory) {
            const monthDiv = document.createElement('div');
            monthDiv.className = 'bg-gray-50 p-4 rounded-lg shadow-sm';

            const monthHeader = document.createElement('h3');
            monthHeader.className = 'text-xl font-semibold mb-3 text-gray-700 border-b pb-2';
            monthHeader.textContent = `${yearMonth} (${monthlyHistory[yearMonth].length}個)`;
            monthDiv.appendChild(monthHeader);

            const itemsGrid = document.createElement('div');
            itemsGrid.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'; // 均等配置

            monthlyHistory[yearMonth].forEach(item => {
                const tabName = tabs.find(t => t.id === item.tabId)?.name || '不明なタブ';
                const itemDiv = document.createElement('div');
                itemDiv.className = 'flex items-center p-3 border border-gray-200 rounded-md bg-white shadow-xs text-gray-800 break-words';
                itemDiv.innerHTML = `
                    <i class="fas fa-check-circle text-green-500 mr-2 text-lg flex-shrink-0"></i>
                    <span class="flex-grow text-sm truncate">${item.text || '（テキストなし）'}</span>
                    <span class="ml-2 text-xs text-gray-500 flex-shrink-0">(${tabName})</span>
                `;
                itemsGrid.appendChild(itemDiv);
            });
            monthDiv.appendChild(itemsGrid);
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

    // --- LLM (Gemini API) 関連機能は削除されました ---


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
