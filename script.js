document.addEventListener('DOMContentLoaded', () => {
    const tabContainer = document.getElementById('tabContainer');
    const tabContentWrapper = document.getElementById('tabContentWrapper');
    const addInputAreaBtn = document.getElementById('addInputAreaBtn');
    const tabSettingsBtn = document.getElementById('tabSettingsBtn');
    const historyListBtn = document = document.getElementById('historyListBtn');
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

    // タブとリストの背景色はCSSで固定されるため、JSのデフォルト色設定を削除または固定値に
    const initialDefaultTabColor = '#ffffff'; // 白
    const initialDefaultListColor = '#ffffff'; // リストアイテムの背景色（白に固定）

    let tabs = JSON.parse(localStorage.getItem('tabs')) || [{ id: 'default', name: 'デフォルト', tabBgColor: initialDefaultTabColor, listBgColor: initialDefaultListColor }];
    
    // 既存のタブデータの色プロパティを上書き、またはデフォルトを設定
    tabs = tabs.map(tab => {
        tab.tabBgColor = initialDefaultTabColor;
        tab.listBgColor = initialDefaultListColor;
        return tab;
    });

    let activeTabId = localStorage.getItem('activeTabId') || tabs[0].id;
    let items = JSON.parse(localStorage.getItem('items')) || {};
    let history = JSON.parse(localStorage.getItem('history')) || [];

    if (!items[activeTabId]) {
        items[activeTabId] = [];
    }

    // データ保存ヘルパー関数を早期に定義
    const saveTabs = () => localStorage.setItem('tabs', JSON.stringify(tabs));
    const saveItems = () => localStorage.setItem('items', JSON.stringify(items));
    const saveHistory = () => localStorage.setItem('history', JSON.stringify(history));
    const saveActiveTab = () => localStorage.setItem('activeTabId', activeTabId);

    // プルダウンのカテゴリリスト
    const categories = [
        '未分類', // デフォルトまたは選択なし
        '飲料・お酒',
        'お菓子',
        '米・パン・種類',
        '野菜',
        '海鮮',
        '肉・肉加工品',
        '卵・チーズ・乳製品',
        '果物',
        '冷凍食品',
        '豆腐・納豆',
        '缶詰・瓶詰め',
        '調味料',
        '日用品',
        '医薬品',
        'その他'
    ];

    // アプリケーション起動時に全てのタブのアイテムをソートしておく
    Object.keys(items).forEach(tabId => {
        if (items[tabId]) {
            items[tabId].sort((a, b) => {
                const categoryAIndex = categories.indexOf(a.category || '未分類');
                const categoryBIndex = categories.indexOf(b.category || '未分類');
                if (categoryAIndex !== categoryBIndex) {
                    return categoryAIndex - categoryBIndex;
                }
                // カテゴリが同じ場合はテキストでソート (オプション)
                return (a.text || '').localeCompare(b.text || '');
            });
        }
    });
    saveItems(); // ソートされた状態を保存

    const showModal = (modalElement) => {
        modalElement.classList.remove('hidden');
        setTimeout(() => {
            modalElement.querySelector('.modal-content').classList.remove('opacity-0', 'scale-95');
            modalElement.querySelector('.modal-content').classList.add('opacity-100', 'scale-100');
        }, 10);
    };

    const hideModal = (modalElement) => {
        modalElement.querySelector('.modal-content').classList.remove('opacity-100', 'scale-100');
        modalElement.querySelector('.modal-content').classList.add('opacity-0', 'scale-95');
        setTimeout(() => {
            modalElement.classList.add('hidden');
        }, 300);
    };

    const renderTabs = () => {
        tabContainer.innerHTML = '';
        tabContainer.classList.add('tab-container-compact');
        tabs.forEach(tab => {
            const button = document.createElement('button');
            button.id = `tab-${tab.id}`;
            button.className = `tab-button text-sm font-medium`;
            button.textContent = tab.name;
            button.onclick = () => switchTab(tab.id);

            if (tab.id === activeTabId) {
                button.classList.add('active-tab');
            }
            tabContainer.appendChild(button);
        });
        const activeTabElement = document.getElementById(`tab-${activeTabId}`);
        if (activeTabElement) {
            activeTabElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    };

    const renderTabContents = () => {
        tabContentWrapper.innerHTML = '';
        tabs.forEach(tab => {
            const tabContentDiv = document.createElement('div');
            tabContentDiv.id = `tab-content-${tab.id}`;
            // リストの表示を画面いっぱいに広げるため、px-0を適用
            tabContentDiv.className = 'tab-content py-4 px-0 space-y-4 overflow-y-auto'; 
            
            if (!items[tab.id]) {
                items[tab.id] = [];
            }

            items[tab.id].forEach(item => {
                tabContentDiv.appendChild(createInputArea(item));
            });
            tabContentWrapper.appendChild(tabContentDiv);
        });
        updateTabContentDisplay();
    };

    const updateTabContentDisplay = () => {
        const activeTabIndex = tabs.findIndex(tab => tab.id === activeTabId);
        if (activeTabIndex !== -1) {
            tabContentWrapper.style.transform = `translateX(-${activeTabIndex * 100}%)`;
            const activeContentDiv = document.getElementById(`tab-content-${activeTabId}`);
            if (activeContentDiv) {
                tabContentWrapper.style.height = `${activeContentDiv.scrollHeight}px`;
            }
        }
    };

    const switchTab = (id) => {
        activeTabId = id;
        saveActiveTab();
        renderTabs();
        sortCurrentTabItems(); // タブ切り替え時にアイテムをソート
        renderTabContents();
        updateTabContentDisplay();
    };

    // 現在アクティブなタブのアイテムをカテゴリでソートする関数
    const sortCurrentTabItems = () => {
        if (items[activeTabId]) {
            items[activeTabId].sort((a, b) => {
                const categoryAIndex = categories.indexOf(a.category || '未分類');
                const categoryBIndex = categories.indexOf(b.category || '未分類');
                if (categoryAIndex !== categoryBIndex) {
                    return categoryAIndex - categoryBIndex;
                }
                // カテゴリが同じ場合はテキストでソート
                return (a.text || '').localeCompare(b.text || '');
            });
        }
    };

    const createInputArea = (itemData) => {
        const itemDiv = document.createElement('div');
        itemDiv.id = `item-${itemData.id}`;
        // 内部パディングは維持
        itemDiv.className = 'flex items-center px-4 py-3 rounded-xl shadow-md space-x-3 transition-all duration-300 transform hover:scale-[1.02] mx-4'; /* mx-4を追加して左右の余白を確保 */
        
        // リストアイテムの背景色を白に固定
        itemDiv.style.backgroundColor = '#ffffff'; 

        // チェックマーク (チェックボックス)
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = itemData.checked;
        checkbox.className = 'form-checkbox h-6 w-6 text-blue-600 rounded-full border-gray-300 focus:ring-blue-500 transition-colors duration-200 cursor-pointer';
        checkbox.onchange = () => toggleCheck(itemData.id);

        // プルダウン (selectボックス)
        const categorySelect = document.createElement('select');
        categorySelect.className = 'p-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white focus:ring-blue-500 focus:border-blue-500 flex-shrink-0';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
        // itemDataにcategoryがあればそれを設定、なければ「未分類」を選択
        categorySelect.value = itemData.category || '未分類';
        categorySelect.onchange = (e) => updateItemCategory(itemData.id, e.target.value);

        // 入力フィールド
        const input = document.createElement('input');
        input.type = 'text';
        input.value = itemData.text;
        input.placeholder = 'ここにタスクを入力';
        input.setAttribute('tabindex', '0'); 
        input.className = 'flex-grow p-2 border-none focus:ring-0 focus:outline-none text-lg text-gray-800 bg-transparent';
        input.oninput = (e) => updateItemText(itemData.id, e.target.value);

        // 削除ボタン
        const deleteButton = document.createElement('button');
        deleteButton.className = 'p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full';
        deleteButton.innerHTML = '<i class="fas fa-trash-alt text-lg"></i>';
        deleteButton.onclick = () => deleteInputArea(itemData.id);

        // 要素の追加順序: チェックボックス、プルダウン、入力エリア、ゴミ箱アイコン
        itemDiv.appendChild(checkbox);
        itemDiv.appendChild(categorySelect);
        itemDiv.appendChild(input);
        itemDiv.appendChild(deleteButton);

        return itemDiv;
    };

    const toggleCheck = (id) => {
        const itemElement = document.getElementById(`item-${id}`);
        if (itemElement) {
            itemElement.classList.add('opacity-0', 'scale-y-0', 'h-0', 'my-0', 'transition-all', 'duration-500', 'ease-in-out');
            itemElement.style.overflow = 'hidden';
        }

        setTimeout(() => {
            const currentItems = items[activeTabId];
            const itemIndex = currentItems.findIndex(item => item.id === id);

            if (itemIndex !== -1) {
                const [checkedItem] = currentItems.splice(itemIndex, 1);
                checkedItem.timestamp = Date.now();
                checkedItem.tabId = activeTabId;
                history.push({ ...checkedItem, category: checkedItem.category || '未分類' }); 
                saveItems();
                saveHistory();
                sortCurrentTabItems(); // 完了後もソート
                renderTabContents();
                updateTabContentDisplay();
            }
        }, 500);
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

    // 入力エリアのカテゴリを更新
    const updateItemCategory = (id, newCategory) => {
        const currentItems = items[activeTabId];
        const item = currentItems.find(item => item.id === id);
        if (item) {
            item.category = newCategory;
            saveItems();
            sortCurrentTabItems(); // カテゴリ変更後もソート
            renderTabContents(); // 再レンダリングして順序を反映
            updateTabContentDisplay(); // 高さも更新
        }
    };

    const deleteInputArea = (id) => {
        const itemElement = document.getElementById(`item-${id}`);
        if (itemElement) {
            itemElement.classList.add('opacity-0', 'scale-y-0', 'h-0', 'my-0', 'transition-all', 'duration-500', 'ease-in-out');
            itemElement.style.overflow = 'hidden';
        }

        setTimeout(() => {
            items[activeTabId] = items[activeTabId].filter(item => item.id !== id);
            saveItems();
            sortCurrentTabItems(); // 削除後もソート
            renderTabContents();
            updateTabContentDisplay();
        }, 500);
    };

    addInputAreaBtn.onclick = () => {
        const newItem = {
            id: Date.now().toString(),
            text: '',
            checked: false,
            category: '未分類' // 新しいアイテムにデフォルトカテゴリを設定
        };
        if (!items[activeTabId]) {
            items[activeTabId] = [];
        }
        items[activeTabId].push(newItem);
        sortCurrentTabItems(); // 新規追加後もソート
        saveItems();
        renderTabContents();
        updateTabContentDisplay();
        setTimeout(() => {
            const newItemElement = document.getElementById(`item-${newItem.id}`);
            if (newItemElement) {
                newItemElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        }, 100);
    };

    const renderTabSettings = () => {
        tabsList.innerHTML = '';
        tabs.forEach((tab, index) => {
            const tabItem = document.createElement('div');
            tabItem.className = 'flex items-center bg-gray-100 p-3 rounded-md shadow-sm text-gray-700';
            tabItem.setAttribute('data-tab-id', tab.id);

            const tabNameSpan = document.createElement('span');
            tabNameSpan.textContent = tab.name;
            tabNameSpan.className = 'flex-grow font-medium';

            const deleteTabButton = document.createElement('button');
            deleteTabButton.className = 'ml-3 p-1 text-red-500 hover:text-red-700 transition-colors rounded-full';
            deleteTabButton.innerHTML = '<i class="fas fa-times"></i>';
            deleteTabButton.onclick = () => deleteTab(tab.id);

            const moveHandle = document.createElement('button');
            moveHandle.className = 'ml-3 p-1 text-gray-500 hover:text-gray-700 cursor-grab rounded-full';
            moveHandle.innerHTML = '<i class="fas fa-arrows-alt"></i>';
            moveHandle.draggable = true;

            tabItem.appendChild(tabNameSpan);
            tabItem.appendChild(deleteTabButton);
            tabItem.appendChild(moveHandle);
            tabsList.appendChild(tabItem);
        });

        let dragSrcEl = null;
        function handleDragStart(e) {
            dragSrcEl = this;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', this.dataset.tabId);
            this.classList.add('opacity-50');
        }

        function handleDragOver(e) {
            e.preventDefault();
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
            e.stopPropagation();
            if (dragSrcEl !== this) {
                const dragId = e.dataTransfer.getData('text/plain');
                const dropId = this.dataset.tabId;

                const dragIndex = tabs.findIndex(t => t.id === dragId);
                const dropIndex = tabs.findIndex(t => t.id === dropId);

                const [removed] = tabs.splice(dragIndex, 1);
                tabs.splice(dropIndex, 0, removed);

                saveTabs();
                renderTabSettings();
                renderTabs();
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

    tabSettingsBtn.onclick = () => {
        renderTabSettings();
        showModal(tabSettingsModal);
    };

    closeTabSettingsModalBtn.onclick = () => hideModal(tabSettingsModal);
    tabSettingsModal.addEventListener('click', (e) => {
        if (e.target === tabSettingsModal) {
            hideModal(tabSettingsModal);
        }
    });

    addTabBtn.onclick = () => {
        const newTabName = newTabNameInput.value.trim();
        if (newTabName) {
            const newTab = { id: Date.now().toString(), name: newTabName, tabBgColor: initialDefaultTabColor, listBgColor: initialDefaultListColor };
            tabs.push(newTab);
            items[newTab.id] = [];
            saveTabs();
            saveItems();
            newTabNameInput.value = '';
            renderTabs();
            renderTabContents();
            renderTabSettings();
            switchTab(newTab.id);
        }
    };

    const deleteTab = (id) => {
        if (tabs.length === 1) {
            alert('最後のタブは削除できません。');
            return;
        }
        const confirmDelete = confirm(`"${tabs.find(t => t.id === id).name}"タブを削除しますか？このタブのアイテムもすべて削除されます。`);
        if (confirmDelete) {
            tabs = tabs.filter(tab => tab.id !== id);
            delete items[id];
            history = history.filter(item => item.tabId !== id);

            saveTabs();
            saveItems();
            saveHistory();

            if (activeTabId === id) {
                activeTabId = tabs[0].id;
                saveActiveTab();
            }
            renderTabs();
            renderTabContents();
            renderTabSettings();
            updateTabContentDisplay();
        }
    };

    // カタカナをひらがなに変換する関数
    function katakanaToHiragana(str) {
        return str.replace(/[\u30a1-\u30f6]/g, function(match) {
            return String.fromCharCode(match.charCodeAt(0) - 0x60);
        });
    }

    const renderHistoryList = () => {
        historyTabFilter.innerHTML = '<option value="all">全てのタブ</option>';
        tabs.forEach(tab => {
            const option = document.createElement('option');
            option.value = tab.id;
            option.textContent = tab.name;
            historyTabFilter.appendChild(option);
        });
        historyTabFilter.value = historyTabFilter.dataset.selected || 'all';

        filterAndRenderHistory();
    };

    const filterAndRenderHistory = () => {
        historyContent.innerHTML = '';
        const filterTabId = historyTabFilter.value;
        let filteredHistory = history.sort((a, b) => b.timestamp - a.timestamp);

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
            monthDiv.className = 'bg-gray-50 p-4 rounded-lg shadow-sm mb-4';

            const monthHeader = document.createElement('h3');
            monthHeader.className = 'text-xl font-semibold mb-3 text-gray-700 border-b pb-2';
            monthHeader.textContent = `${yearMonth} (${monthlyHistory[yearMonth].length}個の完了タスク)`;
            monthDiv.appendChild(monthHeader);

            // タスクとカテゴリを組み合わせて正規化し、カウント
            const taskCategoryCounts = {};
            monthlyHistory[yearMonth].forEach(item => {
                const normalizedTaskText = katakanaToHiragana(item.text || '（テキストなし）');
                const category = item.category || '未分類';
                const key = `${category} - ${normalizedTaskText}`;
                taskCategoryCounts[key] = (taskCategoryCounts[key] || 0) + 1;
            });

            const mergedTaskList = document.createElement('ul');
            mergedTaskList.className = 'list-none p-0 m-0 space-y-2';

            Object.keys(taskCategoryCounts).sort().forEach(key => {
                const count = taskCategoryCounts[key];
                const [category, taskText] = key.split(' - ');
                const listItem = document.createElement('li');
                listItem.className = 'flex items-center bg-white p-3 border border-gray-200 rounded-md shadow-xs text-gray-800 break-words';
                listItem.innerHTML = `
                    <i class="fas fa-check-circle text-green-500 mr-2 text-lg flex-shrink-0"></i>
                    <span class="text-sm font-semibold text-gray-600 mr-2 flex-shrink-0">[${category}]</span>
                    <span class="flex-grow text-base">${taskText}</span>
                    <span class="ml-2 text-sm font-semibold text-blue-600 flex-shrink-0">(${count}回完了)</span>
                `;
                mergedTaskList.appendChild(listItem);
            });
            monthDiv.appendChild(mergedTaskList);
            historyContent.appendChild(monthDiv);
        }
    };

    historyListBtn.onclick = () => {
        renderHistoryList();
        showModal(historyListModal);
    };

    closeHistoryListModalBtn.onclick = () => hideModal(historyListModal);
    historyListModal.addEventListener('click', (e) => {
        if (e.target === historyListModal) {
            hideModal(historyListModal);
        }
    });

    historyTabFilter.onchange = (e) => {
        historyTabFilter.dataset.selected = e.target.value;
        filterAndRenderHistory();
    };

    clearAllHistoryBtn.onclick = () => {
        const confirmClear = confirm('全ての履歴を消去しますか？この操作は元に戻せません。');
        if (confirmClear) {
            history = [];
            saveHistory();
            renderHistoryList();
            alert('全ての履歴が消去されました。');
        }
    };

    let startX = 0;
    let currentTranslateX = 0;
    let isDragging = false;
    let isTouchedOnInteractiveElement = false;

    tabContentWrapper.addEventListener('touchstart', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            isTouchedOnInteractiveElement = true;
            return;
        }
        isTouchedOnInteractiveElement = false;

        startX = e.touches[0].clientX;
        currentTranslateX = parseFloat(tabContentWrapper.style.transform.replace('translateX(', '').replace('%)', '')) || 0;
        isDragging = true;
        tabContentWrapper.style.transition = 'none';
    });

    tabContentWrapper.addEventListener('touchmove', (e) => {
        if (!isDragging || isTouchedOnInteractiveElement) return;
        const currentX = e.touches[0].clientX;
        const diffX = currentX - startX;
        tabContentWrapper.style.transform = `translateX(${currentTranslateX + (diffX / window.innerWidth) * 100}%)`;
    });

    tabContentWrapper.addEventListener('touchend', () => {
        if (!isDragging || isTouchedOnInteractiveElement) return;
        isDragging = false;
        tabContentWrapper.style.transition = 'transform 0.3s ease-in-out';

        const endX = parseFloat(tabContentWrapper.style.transform.replace('translateX(', '').replace('%)', '')) || 0;
        const threshold = 15;

        const activeTabIndex = tabs.findIndex(tab => tab.id === activeTabId);
        let newActiveTabIndex = activeTabIndex;

        if (endX < currentTranslateX - threshold && newActiveTabIndex < tabs.length - 1) {
            newActiveTabIndex++;
        }
        else if (endX > currentTranslateX + threshold && newActiveTabIndex > 0) {
            newActiveTabIndex--;
        }

        switchTab(tabs[newActiveTabIndex].id);

        setTimeout(() => {
            const activeContentDiv = document.getElementById(`tab-content-${activeTabId}`);
            if (activeContentDiv) {
                tabContentWrapper.style.height = `${activeContentDiv.scrollHeight}px`;
            }
        }, 300);
        isTouchedOnInteractiveElement = false;
    });

    window.addEventListener('resize', () => {
        updateTabContentDisplay();
    });

    renderTabs();
    renderTabContents();
});
