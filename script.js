// script.js
// ReactとReactDOMはHTMLでUMDビルドとして読み込まれるため、ここではimportしません。
// Firebase関連のコードは、今回のテストでは一時的に完全に削除します。

// DOMが完全に読み込まれた後にReactアプリケーションをマウント
document.addEventListener('DOMContentLoaded', () => {
    const rootElement = document.getElementById('root');
    console.log("DOMContentLoaded: rootElement =", rootElement);

    if (rootElement) {
        const root = ReactDOM.createRoot(rootElement);
        
        // シンプルなReact要素をレンダリングして動作を確認
        root.render(
            <div style={{ 
                padding: '20px', 
                backgroundColor: '#d1fae5', /* Tailwind equivalent of bg-green-100 */
                borderRadius: '8px', 
                textAlign: 'center',
                margin: '50px auto', /* 中央寄せ */
                maxWidth: '400px', /* 最大幅 */
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)' /* 影 */
            }}>
                <h1 style={{ 
                    color: '#065f46', /* Tailwind equivalent of text-green-800 */
                    fontSize: '1.5rem', 
                    fontWeight: 'bold',
                    marginBottom: '8px'
                }}>
                    React is working!
                </h1>
                <p style={{ 
                    color: '#10b981', /* Tailwind equivalent of text-green-600 */
                    fontSize: '1rem'
                }}>
                    もしこの緑のボックスが見えるなら、Reactのレンダリングは成功しています。
                </p>
                <p style={{ 
                    color: '#34d399', /* Tailwind equivalent of text-green-500 */
                    fontSize: '0.875rem', /* text-sm */
                    marginTop: '10px'
                }}>
                    この後、完全なアプリケーションコードに戻して問題を特定します。
                </p>
            </div>
        );
        console.log("React test app rendered into root element.");
    } else {
        console.error("Root element with ID 'root' not found. Please ensure index.html contains <div id='root'></div>.");
    }
});
