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

    // カテゴリ自動設定のためのキーワードマッピング
    const categoryKeywords = {
        '野菜': ['じゃがいも', 'ジャガイモ', 'にんじん', 'たまねぎ', 'レタス', 'きゅうり', 'なす', 'ピーマン', 'キャベツ', 'ほうれん草', 'ブロッコリー', 'トマト', '大根', 'ごぼう', '蓮根', '玉ねぎ', '茄子', 'アボカド', 'きのこ', 'しいたけ', 'エリンギ', '舞茸', 'えのき', 'パセリ', 'セロリ', 'ねぎ', '長ネギ', 'みつば', '小松菜', '水菜', 'チンゲン菜', 'アスパラガス', 'カリフラワー', '白菜', 'もやし', 'かいわれ', 'スプラウト', 'ゴボウ', 'ダイコン', 'ハクサイ'],
        '果物': ['りんご', 'バナナ', 'みかん', 'いちご', 'ぶどう', 'もも', 'なし', 'メロン', 'スイカ', 'キウイ', 'オレンジ', 'レモン', 'グレープフルーツ', 'パイナップル', 'マンゴー', 'アボカド', 'さくらんぼ', '柿', '梨', '葡萄', '苺', '桃'],
        '肉・肉加工品': ['鶏肉', '豚肉', '牛肉', 'ひき肉', 'ベーコン', 'ハム', 'ソーセージ', '鶏もも', '豚バラ', '牛すじ', '合挽肉', '鳥肉', 'ロース', 'モモ', 'バラ', 'ミンチ', '手羽先', 'ささみ', 'むね肉', 'レバー', 'ホルモン', 'サラミ'],
        '海鮮': ['魚', '鮭', 'マグロ', 'エビ', 'カニ', 'イカ', 'タコ', 'あさり', 'ホタテ', '刺身', 'まぐろ', 'えび', 'かに', 'いか', 'たこ', 'いか', 'カツオ', 'サンマ', 'アジ', 'サバ', 'イワシ', 'ブリ', 'タイ', 'タラ', 'カレイ', '貝', '海老', '蟹', '鮪'],
        '米・パン・種類': ['米', 'ごはん', 'パン', '食パン', '菓子パン', 'うどん', 'そば', 'パスタ', 'ラーメン', 'もち', '蕎麦', '饂飩', 'そうめん', 'ひやむぎ', '中華麺', 'ホットケーキ', 'シリアル', '餅', 'ご飯', '麦', '雑穀'],
        '飲料・お酒': ['水', 'お茶', '牛乳', 'ジュース', 'コーヒー', '紅茶', 'ビール', 'ワイン', '日本酒', '焼酎', '烏龍茶', '緑茶', '麦茶', 'コーラ', 'サイダー', '清涼飲料水', '炭酸水', 'ミネラルウォーター', '缶コーヒー', '果汁', 'カクテル', 'ハイボール', '酎ハイ', '酒', '発泡酒'],
        'お菓子': ['チョコレート', 'クッキー', 'ポテトチップス', 'スナック菓子', 'アイス', 'ケーキ', 'プリン', 'ゼリー', 'せんべい', 'チョコ', 'アイスクリーム', 'ビスケット', '和菓子', '洋菓子', 'グミ', 'キャンディ', 'ガム', 'チップス', 'ドーナツ', 'カステラ', '大福', '団子', '飴'],
        '卵・チーズ・乳製品': ['卵', 'たまご', 'チーズ', 'ヨーグルト', 'バター', '牛乳', '生クリーム', 'カマンベール', 'モッツァレラ', 'プロセスチーズ', 'スライスチーズ', 'マーガリン', 'ホイップクリーム', '乳酸菌飲料', '飲むヨーグルト', '卵黄', '卵白'],
        '冷凍食品': ['冷凍うどん', '冷凍餃子', '冷凍野菜', '冷凍ごはん', '冷凍からあげ', '冷凍食品', '冷凍パスタ', '冷凍ピザ', '冷凍フライドポテト', '冷凍コロッケ', '冷凍シューマイ', '冷凍チャーハン', '冷食'],
        '豆腐・納豆': ['豆腐', '納豆', '油揚げ', '厚揚げ', '高野豆腐', '枝豆豆腐', '木綿豆腐', '絹ごし豆腐', 'がんもどき'],
        '缶詰・瓶詰め': ['ツナ缶', 'サバ缶', 'トマト缶', 'ジャム', 'はちみつ', '瓶詰め', '缶詰', '魚缶', 'コーン缶', '桃缶', 'フルーツ缶', 'のり佃煮', '梅干し', 'びん詰め', 'カンヅメ'],
        '調味料': ['醤油', '塩', '砂糖', '酢', '油', 'みりん', '料理酒', 'ケチャップ', 'マヨネーズ', '味噌', 'しょうゆ', 'しお', 'さとう', 'お酢', 'みそ', 'だし', 'めんつゆ', 'ソース', 'ドレッシング', 'わさび', 'しょうが', 'ニンニク', '七味', 'ラー油', '胡椒', 'ごま油', 'オリーブオイル', '粉末だし'],
        '日用品': ['ティッシュ', 'トイレットペーパー', '洗剤', 'シャンプー', 'リンス', '歯ブラシ', '石鹸', 'ゴミ袋', 'ラップ', 'アルミホイル', '電池', '洗顔', '歯磨き粉', 'マスク', 'ハンドソープ', '柔軟剤', '漂白剤', 'スポンジ', 'ふきん', '台所洗剤', '食器用洗剤', '洗濯洗剤', 'ボディソープ'],
        '医薬品': ['風邪薬', '絆創膏', '胃薬', 'マスク', '鎮痛剤', '消毒液', 'うがい薬', '目薬', '湿布', '体温計', '栄養ドリンク', '胃腸薬', '頭痛薬', '咳止め'],
        'その他': ['雑誌', '新聞', '書籍', '文房具', '切手', 'ハガキ', 'ペット用品', '観葉植物', '花', '園芸用品', '工具', '電球', '乾電池', 'SDカード', 'USBメモリ', 'プリンターインク', '清掃用品', '園芸', '防災グッズ', 'レジ袋', '割り箸', '食器', 'コップ', 'タオル', 'ハンカチ', '靴下', '下着', '洗顔料', '化粧水', '乳液', '美容液', 'メイク落とし', '日焼け止め', 'ヘアスプレー', 'ワックス', 'ヘアカラー', '白髪染め'],
    };

    // カテゴリに対応するFont Awesomeアイコンのマッピング
    const categoryIcons = {
        '未分類': 'fas fa-question-circle text-gray-400',
        '飲料・お酒': 'fas fa-wine-bottle text-purple-500',
        'お菓子': 'fas fa-cookie-bite text-pink-500',
        '米・パン・種類': 'fas fa-bread-slice text-yellow-700',
        '野菜': 'fas fa-carrot text-orange-500',
        '海鮮': 'fas fa-fish-fins text-blue-500',
        '肉・肉加工品': 'fas fa-drumstick-bite text-red-500',
        '卵・チーズ・乳製品': 'fas fa-egg text-yellow-500',
        '果物': 'fas fa-apple-whole text-red-400',
        '冷凍食品': 'fas fa-snowflake text-blue-300',
        '豆腐・納豆': 'fas fa-cube text-green-700',
        '缶詰・瓶詰め': 'fas fa-jar text-gray-600',
        '調味料': 'fas fa-bottle-droplet text-brown-500',
        '日用品': 'fas fa-soap text-blue-400',
        '医薬品': 'fas fa-pills text-red-600',
        'その他': 'fas fa-ellipsis-h text-gray-500'
    };

    // くすみカラーパレット
    const duskyColors = {
        'オフホワイト': '#F5F5DC', // デフォルト色
        'くすみピンク': '#E6B9BE',
        'くすみブルー': '#A9BECD',
        'くすみグリーン': '#B5C9BB',
        'くすみイエロー': '#E2E1B9',
        'くすみパープル': '#C7B5D1',
        'くすみオレンジ': '#EED7B8',
        'くすみグレー': '#B0B0B0',
        'ダスティローズ': '#C9A9A6',
        'セージグリーン': '#A2B19F',
        'モーブ': '#A797B1',
        'テラコッタ': '#CC7E6E'
    };
    const duskyColorValues = Object.values(duskyColors); // 色のHEX値の配列

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
            tabContentDiv.className = 'tab-content py-4 px-0 space-y-4 overflow-y-auto'; 
            
            if (!items[tab.id]) {
                items[tab.id] = [];
            }

            let lastCategory = null;
            
            items[tab.id].forEach(item => {
                const itemCategory = item.category || '未分類';

                // カテゴリが変わった場合、または最初のアイテムの場合に新しいカテゴリサブタイトルを作成
                // かつ、そのカテゴリのアイテムが少なくとも1つ存在する場合にのみ表示
                if (itemCategory !== lastCategory) {
                    const categoryItemsExist = items[tab.id].some(task => (task.category || '未分類') === itemCategory);
                    if (categoryItemsExist) {
                        const categorySubtitleContainer = document.createElement('h4');
                        categorySubtitleContainer.className = 'font-semibold text-lg text-gray-700 mt-6 mb-2 ml-4 flex items-center space-x-2';
                        
                        // カテゴリサブタイトルアイコン
                        const subtitleIcon = document.createElement('i');
                        const iconClass = categoryIcons[itemCategory] || categoryIcons['未分類'];
                        subtitleIcon.className = `${iconClass} text-xl`;
                        
                        const subtitleText = document.createElement('span');
                        subtitleText.textContent = itemCategory;

                        categorySubtitleContainer.appendChild(subtitleIcon);
                        categorySubtitleContainer.appendChild(subtitleText);
                        tabContentDiv.appendChild(categorySubtitleContainer);
                        lastCategory = itemCategory;
                    }
                }

                // アイテムをタブコンテンツに直接追加
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

    // 現在表示されているカラーパレットがあれば削除する関数
    const removeExistingColorPalette = () => {
        const existingPalette = document.getElementById('color-palette-popup');
        if (existingPalette) {
            existingPalette.remove();
        }
    };

    // カラーパレットを表示する関数
    const showColorPalette = (itemId, targetElement) => {
        // 既存のパレットがあれば削除
        removeExistingColorPalette();

        const paletteDiv = document.createElement('div');
        paletteDiv.id = 'color-palette-popup';
        paletteDiv.className = 'absolute z-50 bg-white p-2 rounded-lg shadow-lg flex flex-wrap gap-2';
        
        // パレットの表示位置を設定
        const rect = targetElement.getBoundingClientRect();
        paletteDiv.style.top = `${rect.bottom + window.scrollY + 5}px`;
        paletteDiv.style.left = `${rect.left + window.scrollX}px`;

        duskyColorValues.forEach(color => { // duskyColorValuesを使用
            const colorSwatch = document.createElement('div');
            colorSwatch.className = 'w-8 h-8 rounded-full border border-gray-300 cursor-pointer transition-transform hover:scale-110';
            colorSwatch.style.backgroundColor = color;
            colorSwatch.onclick = (e) => {
                e.stopPropagation(); // クリックがdocumentまで伝播するのを防ぐ

                const currentItems = items[activeTabId];
                const item = currentItems.find(item => item.id === itemId);
                if (item) {
                    item.itemColor = color; // 選択された色に更新
                    saveItems(); // 保存

                    // カラーアイコンの背景色を更新
                    targetElement.style.backgroundColor = color;
                    // itemDivの背景色は変更しない（ユーザーの要望による）
                }
                removeExistingColorPalette(); // パレットを閉じる
            };
            paletteDiv.appendChild(colorSwatch);
        });

        document.body.appendChild(paletteDiv);

        // パレット外をクリックしたら閉じるためのイベントリスナー
        const clickOutsideHandler = (event) => {
            if (paletteDiv && !paletteDiv.contains(event.target) && event.target !== targetElement) {
                removeExistingColorPalette();
                document.removeEventListener('click', clickOutsideHandler);
            }
        };
        // 次のイベントループでリスナーを追加 (パレット表示時のクリックで即座に閉じないように)
        setTimeout(() => {
            document.addEventListener('click', clickOutsideHandler);
        }, 0);
    };

    const createInputArea = (itemData) => {
        const itemDiv = document.createElement('div');
        itemDiv.id = `item-${itemData.id}`;
        itemDiv.className = 'flex items-center px-4 py-3 rounded-xl shadow-md space-x-3 transition-all duration-300 transform hover:scale-[1.02] mx-4';
        
        // リストアイテムの背景色を白に固定 (ユーザーの要望)
        itemDiv.style.backgroundColor = '#ffffff'; 

        // チェックマーク (checkbox)
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = itemData.checked;
        checkbox.className = 'form-checkbox h-6 w-6 text-blue-600 rounded-full border-gray-300 focus:ring-blue-500 transition-colors duration-200 cursor-pointer';
        checkbox.onchange = () => toggleCheck(itemData.id);

        // 入力フィールド (input)
        const input = document.createElement('input');
        input.type = 'text';
        input.value = itemData.text;
        input.placeholder = 'ここにタスクを入力';
        input.setAttribute('tabindex', '0'); 
        input.className = 'flex-grow p-2 border-none focus:ring-0 focus:outline-none text-lg text-gray-800 bg-transparent';
        input.oninput = (e) => updateItemText(itemData.id, e.target.value);
        // フォーカスアウト時にソートと再レンダリングを実行
        input.onblur = () => {
            sortCurrentTabItems();
            renderTabContents();
            updateTabContentDisplay();
        };

        // カラーアイコン (クリックでパレットを表示)
        const colorIcon = document.createElement('div');
        colorIcon.className = 'w-6 h-6 rounded-full border border-gray-300 cursor-pointer flex-shrink-0';
        colorIcon.style.backgroundColor = itemData.itemColor || duskyColors['オフホワイト']; // duskyColorsを使用
        // パレットアイコンを削除し、カラー自体を表示
        colorIcon.onclick = (e) => {
            e.stopPropagation(); // 親要素のクリックイベントが発火するのを防ぐ
            showColorPalette(itemData.id, colorIcon);
        };

        // 削除ボタン (button)
        const deleteButton = document.createElement('button');
        deleteButton.className = 'p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full';
        deleteButton.innerHTML = '<i class="fas fa-trash-alt text-lg"></i>';
        deleteButton.onclick = () => deleteInputArea(itemData.id);

        // 要素の追加順序: チェックボックス、入力エリア、カラーアイコン、ゴミ箱アイコン
        itemDiv.appendChild(checkbox);
        itemDiv.appendChild(input);
        itemDiv.appendChild(colorIcon); // カラーアイコンを追加
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
            const oldText = item.text;
            item.text = newText;

            if (oldText !== newText) {
                const normalizedInput = katakanaToHiragana(newText.toLowerCase());
                let foundCategory = '未分類';

                let matched = false;
                for (const category of categories) {
                    if (category === '未分類' || category === 'その他') continue;

                    const keywords = categoryKeywords[category];
                    if (keywords) {
                        for (const keyword of keywords) {
                            if (normalizedInput.includes(katakanaToHiragana(keyword).toLowerCase())) {
                                foundCategory = category;
                                matched = true;
                                break;
                            }
                        }
                    }
                    if (matched) break;
                }

                if (item.category !== foundCategory) {
                    item.category = foundCategory;
                }
            }
            saveItems(); // テキストとカテゴリの変更を保存
        }
    };

    // 入力エリアのカテゴリを更新 (自動設定されるため、手動変更は考慮しない)
    const updateItemCategory = (id, newCategory) => {
        const currentItems = items[activeTabId];
        const item = currentItems.find(item => item.id === id);
        if (item) {
            item.category = newCategory;
            saveItems();
            sortCurrentTabItems();
            renderTabContents();
            updateTabContentDisplay();
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
            category: '未分類', // 新しいアイテムにデフォルトカテゴリを設定
            itemColor: duskyColors['オフホワイト'] // 新しいアイテムにデフォルト色を設定
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

            const tabNameInput = document.createElement('div'); // inputからcontenteditableなdivに変更
            tabNameInput.contentEditable = true;
            tabNameInput.textContent = tab.name;
            tabNameInput.className = 'flex-grow font-medium p-1 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors';
            tabNameInput.onblur = (e) => updateTabName(tab.id, e.target.textContent); // フォーカスアウトで更新
            tabItem.appendChild(tabNameInput);

            const deleteTabButton = document.createElement('button');
            deleteTabButton.className = 'ml-3 p-1 text-red-500 hover:text-red-700 transition-colors rounded-full';
            deleteTabButton.innerHTML = '<i class="fas fa-times"></i>';
            deleteTabButton.onclick = () => deleteTab(tab.id);

            const moveHandle = document.createElement('button');
            moveHandle.className = 'ml-3 p-1 text-gray-500 hover:text-gray-700 cursor-grab rounded-full';
            moveHandle.innerHTML = '<i class="fas fa-arrows-alt"></i>';
            moveHandle.draggable = true;

            // tabItem.appendChild(tabNameSpan); // 旧spanは削除
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

    // タブ名を更新する関数
    const updateTabName = (tabId, newName) => {
        const tab = tabs.find(t => t.id === tabId);
        if (tab) {
            tab.name = newName.trim() || '無題のタブ'; // 空の場合はデフォルト名
            saveTabs();
            renderTabs(); // メインUIのタブボタンを更新
        }
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

    // HEX色コードからRGBを抽出し、輝度を計算して適切なコントラストの文字色（白または黒）を返す関数 (未使用だが残存)
    function getContrastColor(hexcolor) {
        const r = parseInt(hexcolor.substr(1, 2), 16);
        const g = parseInt(hexcolor.substr(3, 2), 16);
        const b = parseInt(hexcolor.substr(5, 2), 16);
        const y = (r * 299 + g * 587 + b * 114) / 1000;
        return (y >= 128) ? 'black' : 'white';
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
