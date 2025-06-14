// script.js
// ReactとReactDOMはHTMLでUMDビルドとして読み込まれるため、ここではimportしません。
// FirebaseもHTMLでUMDビルドとして読み込まれるため、ここではimportしません。

// Firebase Context
const FirebaseContext = React.createContext(null);

// Firebaseコンテキストプロバイダー
const FirebaseProvider = ({ children }) => {
    const [db, setDb] = React.useState(null);
    const [auth, setAuth] = React.useState(null);
    const [userId, setUserId] = React.useState(null);
    const [isAuthReady, setIsAuthReady] = React.useState(false);

    // Firebase初期化中のエラーを捕捉するための状態
    const [firebaseInitError, setFirebaseInitError] = React.useState(null);

    React.useEffect(() => {
        console.log("FirebaseProvider useEffect: Initialization process started."); // 初期化開始ログ
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        let firebaseConfig = {};
        try {
            // __firebase_configが文字列で提供され、それが有効なJSONであるか確認
            firebaseConfig = typeof __firebase_config !== 'undefined' && __firebase_config !== '' 
                             ? JSON.parse(__firebase_config) 
                             : {};
        } catch (e) {
            console.error("Error parsing __firebase_config:", e);
            setFirebaseInitError("Firebase configuration is invalid. Please check the provided config JSON.");
            setIsAuthReady(true); // エラーがあっても認証準備完了状態にする（エラー表示のため）
            setUserId(crypto.randomUUID()); // フォールバックID
            return; // 初期化処理を中断
        }

        console.log("FirebaseProvider: appId =", appId);
        console.log("FirebaseProvider: firebaseConfig =", firebaseConfig);

        try {
            if (Object.keys(firebaseConfig).length === 0) {
                console.warn("Firebase config is empty. Firebase will not initialize properly.");
                setFirebaseInitError("Firebase configuration is missing. Please provide a valid config.");
                setIsAuthReady(true);
                setUserId(crypto.randomUUID());
                return;
            }

            const app = firebase.initializeApp(firebaseConfig);
            // Firebase v9 compat API に合わせてサービスを取得
            const firestoreDb = firebase.firestore(app); 
            const firebaseAuth = firebase.auth(app);

            setDb(firestoreDb);
            setAuth(firebaseAuth);

            console.log("Firebase initialized successfully. Awaiting authentication state."); // 初期化成功ログ

            // 認証状態の監視
            const unsubscribe = firebaseAuth.onAuthStateChanged(async (user) => {
                console.log("onAuthStateChanged callback fired. User object:", user);
                if (user) {
                    setUserId(user.uid);
                    console.log("User authenticated:", user.uid);
                } else {
                    console.log("No user found. Attempting anonymous sign-in or custom token authentication.");
                    try {
                        const token = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
                        if (token) {
                            await firebaseAuth.signInWithCustomToken(token);
                            console.log("Signed in with custom token.");
                        } else {
                            await firebaseAuth.signInAnonymously();
                            console.log("Signed in anonymously.");
                        }
                        setUserId(firebaseAuth.currentUser?.uid || crypto.randomUUID()); // 認証後のUIDをセット
                    } catch (error) {
                        console.error("Firebase Auth Error during sign-in:", error);
                        setFirebaseInitError(`Firebase authentication failed: ${error.message}`);
                        setUserId(crypto.randomUUID()); // 認証失敗時のフォールバックID
                    }
                }
                setIsAuthReady(true); // 認証処理が完了したらready状態に
                console.log("Authentication process completed. isAuthReady set to true. Current userId:", userId);
            });

            // クリーンアップ関数
            return () => {
                console.log("Cleaning up Firebase auth state listener.");
                unsubscribe();
            };
        } catch (error) {
            console.error("Critical error during Firebase initialization (outside auth listener):", error);
            setFirebaseInitError(`Failed to initialize Firebase: ${error.message}`);
            setIsAuthReady(true); // エラーがあっても認証準備完了状態にする
            setUserId(crypto.randomUUID()); // フォールバックID
        }
    }, []); // 空の依存配列により、コンポーネントマウント時に一度だけ実行される

    // Firebase Context Providerのレンダリング状態をログ出力
    React.useEffect(() => {
        console.log("FirebaseContext.Provider is rendering. Current states:", { db: !!db, auth: !!auth, userId, isAuthReady, firebaseInitError });
    }, [db, auth, userId, isAuthReady, firebaseInitError]);

    // 初期化エラーがある場合はエラーメッセージを表示
    if (firebaseInitError) {
        return (
            <div className="flex justify-center items-center h-screen bg-red-100 text-red-700 p-4 rounded-lg shadow-md">
                <p>アプリケーションの初期化中にエラーが発生しました。</p>
                <p>{firebaseInitError}</p>
                <p>詳細はブラウザのデベロッパーツール（F12）のコンソールをご確認ください。</p>
            </div>
        );
    }

    return (
        <FirebaseContext.Provider value={{ db, auth, userId, isAuthReady }}>
            {children}
        </FirebaseContext.Provider>
    );
};

// Hook for using Firebase in components
const useFirebase = () => {
    return React.useContext(FirebaseContext);
};

// Generic Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <div className="mt-2 text-sm text-gray-600">
                    {children}
                </div>
            </div>
        </div>
    );
};

// Pastel colors definition
const pastelColorMap = [
    { name: "ライトブルー", tabBg: "bg-blue-300", mainBg: "bg-blue-50" },
    { name: "ライトグリーン", tabBg: "bg-green-300", mainBg: "bg-green-50" },
    { name: "ライトレッド", tabBg: "bg-red-300", mainBg: "bg-red-50" },
    { name: "ライトパープル", tabBg: "bg-purple-300", mainBg: "bg-purple-50" },
    { name: "ライトイエロー", tabBg: "bg-yellow-200", mainBg: "bg-yellow-50" },
    { name: "ライトピンク", tabBg: "bg-pink-300", mainBg: "bg-pink-50" },
    { name: "ライトインディゴ", tabBg: "bg-indigo-300", mainBg: "bg-indigo-50" },
    { name: "デフォルト (白)", tabBg: "bg-gray-200", mainBg: "bg-white" }, // Changed to white for default background
];

// Tab Settings Modal Component
const TabSettingsModal = ({ isOpen, onClose, tabs, onAddTab, onDeleteTab, onMoveTab, onUpdateTabColor }) => {
    const [newTabName, setNewTabName] = React.useState('');
    const [draggingIndex, setDraggingIndex] = React.useState(null);
    const dragItem = React.useRef(null);
    const dragOverItem = React.useRef(null);

    // List of predefined Tailwind colors for selection (using pastelColorMap)
    const colors = pastelColorMap; // Use the new pastelColorMap

    // Start drag
    const handleDragStart = (e, index) => {
        dragItem.current = index;
        setDraggingIndex(index);
        e.dataTransfer.effectAllowed = "move";
    };

    // Drag over
    const handleDragEnter = (e, index) => {
        dragOverItem.current = index;
    };

    // End drag
    const handleDragEnd = () => {
        if (dragItem.current !== null && dragOverItem.current !== null) {
            onMoveTab(dragItem.current, dragOverItem.current);
        }
        setDraggingIndex(null);
        dragItem.current = null;
        dragOverItem.current = null;
    };

    // Handle drop (optional, handleDragEnd might be sufficient)
    const handleDrop = (e) => {
        e.preventDefault();
        // No specific handling here as handleDragEnd takes care of it
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Necessary to allow dropping
    };

    const handleAddTab = () => {
        if (newTabName.trim()) {
            onAddTab(newTabName.trim());
            setNewTabName('');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="タブの設定">
            <div className="mb-4">
                <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="新しいタブ名"
                    value={newTabName}
                    onChange={(e) => setNewTabName(e.target.value)}
                    onKeyPress={(e) => { if (e.key === 'Enter') handleAddTab(); }}
                />
                <button
                    onClick={handleAddTab}
                    className="mt-2 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-300"
                >
                    タブを追加
                </button>
            </div>
            <h4 className="font-medium text-gray-700 mb-2">既存のタブ:</h4>
            <ul className="space-y-2 max-h-60 overflow-y-auto">
                {tabs.map((tab, index) => (
                    <li
                        key={tab.id}
                        className={`flex items-center justify-between p-3 bg-gray-50 rounded-md shadow-sm border border-gray-200 cursor-grab ${draggingIndex === index ? 'opacity-50 border-blue-500' : ''}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragEnter={(e) => handleDragEnter(e, index)}
                        onDragEnd={handleDragEnd}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        <div className="flex items-center">
                            {/* Move handle */}
                            <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                            <span className="text-gray-800">{tab.name}</span>
                        </div>
                        <div className="flex items-center space-x-2"> {/* Added flex container for alignment */}
                            <select
                                value={tab.color || pastelColorMap[0].tabBg} // Default to the first pastel color
                                onChange={(e) => onUpdateTabColor(tab.id, e.target.value)}
                                className="p-1 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                {colors.map((c) => (
                                    <option key={c.tabBg} value={c.tabBg}>{c.name}</option>
                                ))}
                            </select>
                            <button
                                onClick={() => onDeleteTab(tab.id)}
                                className="text-red-500 hover:text-red-700 transition duration-300 p-1 rounded-full hover:bg-red-100"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </Modal>
    );
};

/**
 * カタカナをひらがなに変換するヘルパー関数
 * @param {string} str - 変換する文字列
 * @returns {string} 変換された文字列
 */
const convertKatakanaToHiragana = (str) => {
    return str.replace(/[\u30a1-\u30f6]/g, function(match) {
        return String.fromCharCode(match.charCodeAt(0) - 0x60);
    });
};

/**
 * 日本語テキストをマージ用に正規化するヘルパー関数
 * カタカナをひらがなに変換し、特定の漢字をひらがなに変換します。
 * @param {string} str - 正規化する文字列
 * @returns {string} 正規化された文字列
 */
const normalizeJapaneseTextForMerging = (str) => {
    let normalized = str;

    // 1. カタカナをひらがなに変換
    normalized = convertKatakanaToHiragana(normalized);

    // 2. 特定の漢字をひらがなに変換
    // 注意: これは完全な漢字変換ではありません。一般的な読み方をカバーする限定的な対応です。
    // 例: 「麺」を「めん」に変換
    normalized = normalized.replace('麺', 'めん');
    // 必要に応じて他の漢字-ひらがな変換ルールを追加できます。
    // 例: normalized = normalized.replace('野菜', 'やさい');
    // 例: normalized = normalized.replace('卵', 'たまご');

    return normalized;
};


// History Modal Component
const HistoryModal = ({ isOpen, onClose, historyItems, allTabs, initialActiveTabId }) => {
    // State to hold the ID of the selected tab
    const [selectedTabId, setSelectedTabId] = React.useState(initialActiveTabId);

    // Set initial active tab ID when modal opens
    React.useEffect(() => {
        setSelectedTabId(initialActiveTabId);
    }, [initialActiveTabId, isOpen]);

    // Filter history items based on the selected tab
    const filteredHistoryItems = selectedTabId
        ? historyItems.filter(item => item.tabId === selectedTabId)
        : historyItems; // If no tab is selected, show all history (for "All History" option)

    // Group filtered history by month and then by memo text (normalized)
    const groupedAndMergedHistory = filteredHistoryItems.reduce((acc, item) => {
        const date = new Date(item.checkedDate);
        const yearMonth = `${date.getFullYear()}年${date.getMonth() + 1}月`;
        
        if (!acc[yearMonth]) {
            acc[yearMonth] = {}; // Initialize with an object for memo texts
        }

        // Use normalized text as key for merging
        const memoKey = normalizeJapaneseTextForMerging(item.text); // Use the new normalization function
        
        if (!acc[yearMonth][memoKey]) {
            acc[yearMonth][memoKey] = {
                text: item.text, // Keep original text for display or use normalized: memoKey
                count: 0,
                latestDate: item.checkedDate // Store the latest date for sorting if needed
            };
        }
        acc[yearMonth][memoKey].count += 1;

        // Optionally update latestDate if you want to sort by latest occurrence within the merged item
        if (new Date(item.checkedDate) > new Date(acc[yearMonth][memoKey].latestDate)) {
            acc[yearMonth][memoKey].latestDate = item.checkedDate;
        }

        return acc;
    }, {});

    // Convert groupedAndMergedHistory into a sortable array for rendering
    const sortedMonths = Object.keys(groupedAndMergedHistory).sort((a, b) => {
        const [yearA, monthA] = a.replace('年', ' ').replace('月', '').split(' ').map(Number);
        const [yearB, monthB] = b.replace('年', ' ').replace('月', '').split(' ').map(Number);
        if (yearA !== yearB) return yearB - yearA; // Latest year on top
        return monthB - monthA; // Latest month on top
    });

    const getTabName = (tabId) => {
        const tab = allTabs.find(t => t.id === tabId);
        return tab ? tab.name : '不明なタブ';
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="履歴一覧">
            <div className="mb-4">
                <label htmlFor="tab-select" className="block text-gray-700 text-sm font-medium mb-2">表示するタブを選択:</label>
                <select
                    id="tab-select"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedTabId || ''} // Allow empty string for "All History"
                    onChange={(e) => setSelectedTabId(e.target.value)}
                >
                    <option value="">全ての履歴</option> /* Option to display all history */
                    {allTabs.map(tab => (
                        <option key={tab.id} value={tab.id}>{tab.name}</option>
                    ))}
                </select>
            </div>

            {filteredHistoryItems.length === 0 ? (
                <p className="text-gray-600 text-center mt-4">選択されたタブには履歴がありません。</p>
            ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {sortedMonths.map(month => (
                        <div key={month} className="border-b pb-2">
                            <h4 className="text-lg font-semibold text-gray-800 sticky top-0 bg-white py-1">
                                {month} (完了したメモ: {Object.values(groupedAndMergedHistory[month]).reduce((total, memo) => total + memo.count, 0)}個)
                            </h4>
                            <ul className="mt-2 space-y-1">
                                {Object.values(groupedAndMergedHistory[month]) // Convert object values to array
                                    .sort((a, b) => new Date(b.latestDate) - new Date(a.latestDate)) // Sort merged items by latest date
                                    .map(memo => (
                                    <li key={memo.text} className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                                        <span className="text-gray-700 text-sm">{memo.text}</span>
                                        <span className="text-gray-700 text-sm font-medium">
                                            {memo.count}個
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </Modal>
    );
};

// Main Application Component
function App() {
    const { db, userId, isAuthReady, firebaseInitError } = useFirebase();

    // Tab related States
    const [tabs, setTabs] = React.useState([]);
    const [activeTabId, setActiveTabId] = React.useState(null); // ID of the currently active tab
    const [tabSettingsModalOpen, setTabSettingsModalOpen] = React.useState(false);

    // Input area related States
    const [inputAreas, setInputAreas] = React.useState([]); // Input areas for the current active tab
    const [historyItems, setHistoryItems] = React.useState([]); // History of completed items
    const [historyModalOpen, setHistoryModalOpen] = React.useState(false);

    // Firestore listener for tabs
    React.useEffect(() => {
        if (!db || !isAuthReady || !userId) {
            console.log("Tabs listener skipped:", { db: !!db, isAuthReady, userId });
            return;
        }

        console.log("Setting up tabs listener for userId:", userId);
        const tabsCollectionRef = db.collection(`artifacts/${userId}/public/data/tabs`);
        const unsubscribeTabs = tabsCollectionRef.onSnapshot((snapshot) => {
            const fetchedTabs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Sort by position
            fetchedTabs.sort((a, b) => a.position - b.position);
            setTabs(fetchedTabs);
            console.log("Tabs fetched:", fetchedTabs);

            // Activate the first tab on initial load or if no active tab
            if (!activeTabId && fetchedTabs.length > 0) {
                setActiveTabId(fetchedTabs[0].id);
                console.log("Setting activeTabId to first tab:", fetchedTabs[0].id);
            } else if (activeTabId && !fetchedTabs.some(tab => tab.id === activeTabId)) {
                // If the active tab was deleted, switch to the first remaining tab
                if (fetchedTabs.length > 0) {
                    setActiveTabId(fetchedTabs[0].id);
                    console.log("Active tab deleted, switching to first remaining tab:", fetchedTabs[0].id);
                } else {
                    setActiveTabId(null);
                    console.log("All tabs deleted, activeTabId set to null.");
                }
            }
        }, (error) => {
            console.error("Error fetching tabs:", error);
            setFirebaseInitError(`Error fetching tabs: ${error.message}`); // エラーをFirebaseProvider経由で表示
        });

        const historyCollectionRef = db.collection(`artifacts/${userId}/public/data/historyItems`);
        const unsubscribeHistory = historyCollectionRef.onSnapshot((snapshot) => {
            const fetchedHistory = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Sort by date (newest first)
            fetchedHistory.sort((a, b) => new Date(b.checkedDate) - new Date(a.checkedDate));
            setHistoryItems(fetchedHistory);
            console.log("History items fetched:", fetchedHistory.length);
        }, (error) => {
            console.error("Error fetching history items:", error);
            setFirebaseInitError(`Error fetching history: ${error.message}`); // エラーをFirebaseProvider経由で表示
        });

        return () => {
            console.log("Cleaning up tab and history listeners.");
            unsubscribeTabs();
            unsubscribeHistory();
        };
    }, [db, userId, isAuthReady, activeTabId, setFirebaseInitError]); // setFirebaseInitErrorを依存配列に追加


    // Firestore listener for input areas of the active tab
    React.useEffect(() => {
        if (!db || !isAuthReady || !activeTabId || !userId) {
            setInputAreas([]); // Clear if no active tab
            console.log("Input areas listener skipped:", { db: !!db, isAuthReady, activeTabId, userId });
            return;
        }

        console.log("Setting up input areas listener for tabId:", activeTabId);
        const inputAreasCollectionRef = db.collection(`artifacts/${userId}/public/data/inputAreas`);
        const q = inputAreasCollectionRef.where("tabId", "==", activeTabId);

        const unsubscribeInputAreas = q.onSnapshot((snapshot) => {
            const fetchedInputAreas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Sort by position
            fetchedInputAreas.sort((a, b) => a.position - b.position);
            setInputAreas(fetchedInputAreas);
            console.log("Input areas fetched for active tab:", fetchedInputAreas.length);
        }, (error) => {
            console.error("Error fetching input areas:", error);
            setFirebaseInitError(`Error fetching input areas: ${error.message}`); // エラーをFirebaseProvider経由で表示
        });

        return () => {
            console.log("Cleaning up input areas listener.");
            unsubscribeInputAreas();
        };
    }, [db, userId, isAuthReady, activeTabId, setFirebaseInitError]); // setFirebaseInitErrorを依存配列に追加


    // Add a tab
    const handleAddTab = async (name) => {
        if (!db || !userId) {
            console.error("Cannot add tab: DB or User ID not ready.");
            return;
        }
        try {
            console.log("Adding new tab with name:", name);
            const newTabRef = db.collection(`artifacts/${userId}/public/data/tabs`).doc();
            const newPosition = tabs.length > 0 ? Math.max(...tabs.map(t => t.position)) + 1 : 0;
            await newTabRef.set({
                name: name,
                position: newPosition,
                color: pastelColorMap[0].tabBg,
                createdAt: new Date().toISOString()
            });
            setActiveTabId(newTabRef.id);
            console.log("Tab added with ID:", newTabRef.id);
        } catch (e) {
            console.error("Error adding tab:", e);
            setFirebaseInitError(`Error adding tab: ${e.message}`);
        }
    };

    // Update tab color
    const handleUpdateTabColor = async (tabId, newColor) => {
        if (!db || !userId) return;
        try {
            console.log("Updating tab color for ID:", tabId, "to color:", newColor);
            await db.collection(`artifacts/${userId}/public/data/tabs`).doc(tabId).update({ color: newColor });
            console.log(`Tab ${tabId} color updated.`);
        } catch (e) {
            console.error("Error updating tab color:", e);
            setFirebaseInitError(`Error updating tab color: ${e.message}`);
        }
    };

    // Delete a tab
    const handleDeleteTab = async (tabIdToDelete) => {
        if (!db || !userId) return;
        if (tabs.length === 1) {
            console.warn("Cannot delete the last tab. At least one tab must remain.");
            // ユーザーに警告を表示するモーダルなどを追加するべき
            return;
        }
        try {
            console.log("Deleting tab and associated data for ID:", tabIdToDelete);
            // Delete all input areas for the tab being deleted
            const qInputAreas = db.collection(`artifacts/${userId}/public/data/inputAreas`).where("tabId", "==", tabIdToDelete);
            const snapshotInputAreas = await qInputAreas.get();
            snapshotInputAreas.forEach(async (docToDelete) => {
                await docToDelete.ref.delete();
                console.log("Deleted input area:", docToDelete.id);
            });

            // Delete history items for the tab being deleted
            const qHistory = db.collection(`artifacts/${userId}/public/data/historyItems`).where("tabId", "==", tabIdToDelete);
            const snapshotHistory = await qHistory.get();
            snapshotHistory.forEach(async (docToDelete) => {
                await docToDelete.ref.delete();
                console.log("Deleted history item:", docToDelete.id);
            });

            // Delete the tab document itself
            await db.collection(`artifacts/${userId}/public/data/tabs`).doc(tabIdToDelete).delete();
            console.log("Tab deleted successfully:", tabIdToDelete);

            // If the deleted tab was active, switch to another tab
            if (activeTabId === tabIdToDelete) {
                const remainingTabs = tabs.filter(tab => tab.id !== tabIdToDelete);
                if (remainingTabs.length > 0) {
                    setActiveTabId(remainingTabs[0].id);
                    console.log("Switched active tab to:", remainingTabs[0].id);
                } else {
                    setActiveTabId(null);
                    console.log("No tabs remaining, activeTabId set to null.");
                }
            }
        } catch (e) {
            console.error("Error deleting tab:", e);
            setFirebaseInitError(`Error deleting tab: ${e.message}`);
        }
    };

    // Reorder tabs
    const handleMoveTab = async (fromIndex, toIndex) => {
        if (!db || !userId) return;

        console.log(`Moving tab from index ${fromIndex} to ${toIndex}.`);
        const newTabs = [...tabs];
        const [movedTab] = newTabs.splice(fromIndex, 1);
        newTabs.splice(toIndex, 0, movedTab);

        // Calculate new positions and update Firestore
        const batch = db.batch();
        newTabs.forEach((tab, index) => {
            const tabRef = db.collection(`artifacts/${userId}/public/data/tabs`).doc(tab.id);
            batch.update(tabRef, { position: index });
        });

        try {
            await batch.commit();
            setTabs(newTabs); // Update UI
            console.log("Tabs reordered successfully.");
        } catch (e) {
            console.error("Error reordering tabs:", e);
            setFirebaseInitError(`Error reordering tabs: ${e.message}`);
        }
    };


    // Add an input area
    const handleAddInputArea = async () => {
        if (!db || !activeTabId || !userId) {
            console.error("Cannot add input area: DB, active tab, or User ID not ready.");
            return;
        }
        try {
            console.log("Adding new input area for tab:", activeTabId);
            const newInputRef = db.collection(`artifacts/${userId}/public/data/inputAreas`).doc();
            const newPosition = inputAreas.length > 0 ? Math.max(...inputAreas.map(item => item.position)) + 1 : 0;
            await newInputRef.set({
                tabId: activeTabId,
                text: '',
                checked: false,
                position: newPosition,
                createdAt: new Date().toISOString()
            });
            console.log("Input area added with ID:", newInputRef.id);
        } catch (e) {
            console.error("Error adding input area:", e);
            setFirebaseInitError(`Error adding input area: ${e.message}`);
        }
    };

    // Update input area text
    const handleUpdateInputAreaText = async (id, newText) => {
        if (!db || !userId) return;
        try {
            // console.log("Updating input area text for ID:", id, "to:", newText); // 過剰なログを避けるためコメントアウト
            await db.collection(`artifacts/${userId}/public/data/inputAreas`).doc(id).update({ text: newText });
        } catch (e) {
            console.error("Error updating input area text:", e);
            setFirebaseInitError(`Error updating input area: ${e.message}`);
        }
    };

    // Toggle input area check status (move to history)
    const handleToggleCheck = async (id, currentText) => {
        if (!db || !userId) return;
        try {
            console.log("Toggling check/moving to history for input area ID:", id);
            // Add to history
            await db.collection(`artifacts/${userId}/public/data/historyItems`).add({
                originalInputAreaId: id,
                tabId: activeTabId, // Record which tab it came from
                text: currentText,
                checkedDate: new Date().toISOString(),
            });
            // Delete the original input area
            await db.collection(`artifacts/${userId}/public/data/inputAreas`).doc(id).delete();
            console.log("Input area checked and moved to history successfully.");
        } catch (e) {
            console.error("Error toggling check/moving to history:", e);
            setFirebaseInitError(`Error moving item to history: ${e.message}`);
        }
    };

    // Delete an input area
    const handleDeleteInputArea = async (id) => {
        if (!db || !userId) return;
        try {
            console.log("Deleting input area ID:", id);
            await db.collection(`artifacts/${userId}/public/data/inputAreas`).doc(id).delete();
            console.log("Input area deleted successfully.");
        } catch (e) {
            console.error("Error deleting input area:", e);
            setFirebaseInitError(`Error deleting input area: ${e.message}`);
        }
    };

    // Determine the main content area background color
    const activeTab = tabs.find(tab => tab.id === activeTabId);
    const mainBackgroundColor = activeTab ? pastelColorMap.find(c => c.tabBg === activeTab.color)?.mainBg || 'bg-gray-100' : 'bg-gray-100'; // Default light gray if no tab or color

    // Firebase初期化エラーがある場合は即座に表示
    if (firebaseInitError) {
        return (
            <div className="flex justify-center items-center h-screen bg-red-100 text-red-700 p-4 rounded-lg shadow-md text-center">
                <p className="font-bold text-xl mb-2">アプリケーションエラー</p>
                <p className="text-lg mb-4">Firebaseの初期化またはデータ処理に問題が発生しました。</p>
                <p className="text-sm font-mono break-all">{firebaseInitError}</p>
                <p className="mt-4">詳細については、ブラウザのデベロッパーツール（F12キーで開く）の「Console」タブをご確認ください。</p>
            </div>
        );
    }

    // Firebase認証の準備ができていない場合は「読み込み中...」を表示
    if (!isAuthReady) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="text-gray-600 text-lg">読み込み中...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col font-inter">
            {/* ヘッダー */}
            <header className="bg-white shadow-md flex flex-col sticky top-0 z-10">
                {/* 上部コントロールバー（右側にアイコン群） */}
                <div className="flex items-center p-4 justify-end">
                    {/* 右側のアイコン群 */}
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setHistoryModalOpen(true)}
                            className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-200 shadow-sm"
                            aria-label="履歴一覧"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                        </button>
                        <button
                            onClick={() => setTabSettingsModalOpen(true)}
                            className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-200 shadow-sm"
                            aria-label="タブ設定"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </button>
                    </div>
                </div>

                {/* タブバー（タブのみ） */}
                <div className="flex overflow-x-auto whitespace-nowrap scrollbar-hide w-full border-b border-gray-200 px-4 pb-2">
                    {tabs.map((tab) => {
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTabId(tab.id)}
                                className={`flex-shrink-0 px-3 py-2 text-sm font-medium transition-colors duration-200 relative pb-2 
                                    ${activeTabId === tab.id
                                        ? `${tab.color || pastelColorMap[0].tabBg} text-white font-semibold rounded-t-md` // アクティブ時は設定色背景と白文字
                                        : 'text-gray-700 hover:bg-gray-100 rounded-t-md' // 非アクティブ時はホバー効果
                                    }
                                `}
                            >
                                {tab.name}
                                {activeTabId === tab.id && (
                                    <span className={`absolute bottom-0 left-0 w-full h-0.5 ${tab.color || pastelColorMap[0].tabBg} rounded-full`}></span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </header>

            {/* メインコンテンツエリア */}
            <main className={`flex-grow p-4 overflow-y-auto relative ${mainBackgroundColor}`}>
                <div className="max-w-xl mx-auto space-y-4">
                    {inputAreas.length === 0 && (
                        <p className="text-center text-gray-500 text-lg mt-10">
                            {activeTabId ? "このタブには入力エリアがありません。下の + ボタンで追加してください。" : "タブを選択するか、タブ設定で新しいタブを作成してください。"}
                        </p>
                    )}
                    {inputAreas.map((item) => (
                        <div key={item.id} className="flex items-center bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                            <input
                                type="checkbox"
                                checked={item.checked}
                                onChange={() => handleToggleCheck(item.id, item.text)}
                                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 mr-3 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={item.text}
                                onChange={(e) => handleUpdateInputAreaText(item.id, e.target.value)}
                                className="flex-grow px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 text-gray-800"
                                placeholder="ここに入力してください..."
                            />
                            <button
                                onClick={() => handleDeleteInputArea(item.id)}
                                className="ml-3 p-2 text-gray-400 hover:text-red-500 transition duration-200 rounded-full hover:bg-red-100"
                                aria-label="入力エリアを削除"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                        </div>
                    ))}
                    {activeTabId && (
                        <div className="fixed bottom-4 right-8 z-20">
                            <button
                                onClick={handleAddInputArea}
                                className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
                                aria-label="入力エリアを追加"
                            >
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* タブ設定モーダル */}
            <TabSettingsModal
                isOpen={tabSettingsModalOpen}
                onClose={() => setTabSettingsModalOpen(false)}
                tabs={tabs}
                onAddTab={handleAddTab}
                onDeleteTab={handleDeleteTab}
                onMoveTab={handleMoveTab}
                onUpdateTabColor={handleUpdateTabColor}
            />

            {/* 履歴モーダル */}
            <HistoryModal
                isOpen={historyModalOpen}
                onClose={() => setHistoryModalOpen(false)}
                historyItems={historyItems}
                allTabs={tabs}
                initialActiveTabId={activeTabId}
            />

            {/* デバッグ情報 (開発中のみ表示) */}
            {/*
            <footer className="p-2 bg-gray-800 text-white text-xs text-center">
                User ID: {userId}
            </footer>
            */}
        </div>
    );
}

// AppコンポーネントをFirebaseProviderでラップしてエクスポート
document.addEventListener('DOMContentLoaded', () => {
    const rootElement = document.getElementById('root');
    console.log("DOMContentLoaded: rootElement =", rootElement); // root要素の存在を確認

    if (rootElement) {
        const root = ReactDOM.createRoot(rootElement);

        // --- デバッグ用テストレンダリング ---
        // このブロックのコメントを外してデプロイし、GitHub Pagesでアクセスしてみてください。
        // 緑色のボックスと「React is working!」のメッセージが表示されれば、
        // Reactの基本レンダリングは機能しており、問題はFirebaseの初期化やAppコンポーネント内のロジックにある可能性が高いです。
        
        root.render(
            <div style={{ padding: '20px', backgroundColor: '#d1fae5', borderRadius: '8px', textAlign: 'center' }}>
                <h1 style={{ color: '#065f46', fontSize: '1.5rem', fontWeight: 'bold' }}>React is working!</h1>
                <p style={{ color: '#10b981', marginTop: '8px' }}>If you see this, the issue is within Firebase or the main App component logic.</p>
            </div>
        );
        
        // --- デバッグ用テストレンダリング終了 ---

        // 通常のアプリケーションレンダリング
        // 上記のテストレンダリングを有効にする場合は、このブロックをコメントアウトしてください。
        /*
        root.render(
            <React.StrictMode>
                <FirebaseProvider>
                    <App />
                </FirebaseProvider>
            </React.StrictMode>
        );
        */
        console.log("React app rendered into root element."); // Reactアプリがルートにレンダリングされたことをログ出力
    } else {
        console.error("Root element with ID 'root' not found. Please ensure index.html contains <div id='root'></div>.");
    }
});
