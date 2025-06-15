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

    // Utility functions for color conversion and lightening (もはや不要なため削除)
    // function hexToHsl(hex) { /* ... */ }
    // function hslToHex(h, s, l) { /* ... */ }
    // function lightenHexColor(hex, percent) { /* ... */ }

    // タブとリストの背景色はCSSで固定されるため、JSのデフォルト色設定を削除または固定値に
    // 初期タブの色は白、リストアイテムの背景色も白に固定
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

    const saveTabs = () => localStorage.setItem('tabs', JSON.stringify(tabs));
    const saveItems = () => localStorage.setItem('items', JSON.stringify(items));
    const saveHistory = () => localStorage.setItem('history', JSON.stringify(history));
    const saveActiveTab = () => localStorage.setItem('activeTabId', activeTabId);

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
            tabContentDiv.className = 'tab-content p-4 pt-0 space-y-4 overflow-y-auto';
            
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
        renderTabContents();
        updateTabContentDisplay();
    };

    const createInputArea = (itemData) => {
        const itemDiv = document.createElement('div');
        itemDiv.id = `item-${itemData.id}`;
        itemDiv.className = 'flex items-center p-4 rounded-xl shadow-md space-x-3 transition-all duration-300 transform hover:scale-[1.02]';
        
        // リストアイテムの背景色を白に固定
        itemDiv.style.backgroundColor = '#ffffff'; 

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = itemData.checked;
        checkbox.className = 'form-checkbox h-6 w-6 text-blue-600 rounded-full border-gray-300 focus:ring-blue-500 transition-colors duration-200 cursor-pointer';
        checkbox.onchange = () => toggleCheck(itemData.id);

        const input = document.createElement('input');
        input.type = 'text';
        input.value = itemData.text;
        input.placeholder = 'ここにタスクを入力';
        input.setAttribute('tabindex', '0'); 
        input.className = 'flex-grow p-2 border-none focus:ring-0 focus:outline-none text-lg text-gray-800 bg-transparent';
        input.oninput = (e) => updateItemText(itemData.id, e.target.value);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full';
        deleteButton.innerHTML = '<i class="fas fa-trash-alt text-lg"></i>';
        deleteButton.onclick = () => deleteInputArea(itemData.id);

        itemDiv.appendChild(checkbox);
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
                history.push(checkedItem);
                saveItems();
                saveHistory();
                renderTabContents();
                updateTabContentDisplay();
            }
        }, 500);
    };

    const updateItemText = (id, newText) => {
        const currentItems = items[activeTabId];
        const item = currentItems.find(item => item.id === id);
        if (item) {
            item.text = newText;
            saveItems();
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
            renderTabContents();
            updateTabContentDisplay();
        }, 500);
    };

    addInputAreaBtn.onclick = () => {
        const newItem = {
            id: Date.now().toString(),
            text: '',
            checked: false
        };
        if (!items[activeTabId]) {
            items[activeTabId] = [];
        }
        items[activeTabId].push(newItem);
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

            // カラーピッカーは削除
            // const colorInput = document.createElement('input');
            // colorInput.type = 'color';
            // colorInput.className = 'ml-3 w-8 h-8 rounded-full border border-gray-300 cursor-pointer';
            // colorInput.value = tab.tabBgColor;
            // colorInput.title = 'タブの背景色を選択';
            // colorInput.onchange = (e) => {
            //     const newTabColor = e.target.value;
            //     tab.tabBgColor = newTabColor;
            //     tab.listBgColor = lightenHexColor(newTabColor, 15);
            //     saveTabs();
            //     renderTabs();
            //     renderTabContents();
            // };

            const deleteTabButton = document.createElement('button');
            deleteTabButton.className = 'ml-3 p-1 text-red-500 hover:text-red-700 transition-colors rounded-full';
            deleteTabButton.innerHTML = '<i class="fas fa-times"></i>';
            deleteTabButton.onclick = () => deleteTab(tab.id);

            const moveHandle = document.createElement('button');
            moveHandle.className = 'ml-3 p-1 text-gray-500 hover:text-gray-700 cursor-grab rounded-full';
            moveHandle.innerHTML = '<i class="fas fa-arrows-alt"></i>';
            moveHandle.draggable = true;

            tabItem.appendChild(tabNameSpan);
            // tabItem.appendChild(colorInput); // カラーピッカーを削除
            tabItem.appendChild(deleteTabButton);
            tabItem.appendChild(moveHandle);
            tabsList.appendChild(tabItem);
        });

        let dragSrcEl = null;
        function handleDragStart(e) { /* ... */ }
        function handleDragOver(e) { /* ... */ }
        function handleDragEnter(e) { /* ... */ }
        function handleDragLeave(e) { /* ... */ }
        function handleDrop(e) { /* ... */ }
        function handleDragEnd(e) { /* ... */ }

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
            // 新しいタブにも固定色を適用
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

    const deleteTab = (id) => { /* ... */ };
    function katakanaToHiragana(str) { /* ... */ return ''; }
    const renderHistoryList = () => { /* ... */ };
    const filterAndRenderHistory = () => { /* ... */ };
    historyListBtn.onclick = () => { /* ... */ };
    closeHistoryListModalBtn.onclick = () => hideModal(historyListModal);
    historyListModal.addEventListener('click', (e) => { /* ... */ });
    historyTabFilter.onchange = (e) => { /* ... */ };
    clearAllHistoryBtn.onclick = () => { /* ... */ };

    let startX = 0;
    let currentTranslateX = 0;
    let isDragging = false;
    let isTouchedOnInteractiveElement = false;

    tabContentWrapper.addEventListener('touchstart', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.closest('button')) {
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
