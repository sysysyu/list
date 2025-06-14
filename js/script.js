{\rtf1\ansi\ansicpg932\cocoartf2638
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fnil\fcharset0 Menlo-Regular;\f1\fnil\fcharset128 HiraginoSans-W3;}
{\colortbl;\red255\green255\blue255;\red77\green80\blue85;\red236\green241\blue247;\red0\green0\blue0;
\red111\green14\blue195;\red14\green110\blue109;\red24\green112\blue43;\red191\green28\blue37;\red164\green69\blue11;
\red107\green0\blue1;\red35\green22\blue178;}
{\*\expandedcolortbl;;\cssrgb\c37255\c38824\c40784;\cssrgb\c94118\c95686\c97647;\cssrgb\c0\c0\c0;
\cssrgb\c51765\c18824\c80784;\cssrgb\c0\c50196\c50196;\cssrgb\c9412\c50196\c21961;\cssrgb\c80392\c19216\c19216;\cssrgb\c70980\c34902\c3137;
\cssrgb\c50196\c0\c0;\cssrgb\c18824\c18824\c75294;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs28 \cf2 \cb3 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 // script.js\cf0 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf5 \cb3 \strokec5 import\cf0 \strokec4  \cf6 \strokec6 React\cf0 \strokec4 , \{ useState, useEffect, createContext, useContext, useRef \} \cf5 \strokec5 from\cf0 \strokec4  \cf7 \strokec7 'react'\cf0 \strokec4 ;\cb1 \
\cf5 \cb3 \strokec5 import\cf0 \strokec4  \cf6 \strokec6 ReactDOM\cf0 \strokec4  \cf5 \strokec5 from\cf0 \strokec4  \cf7 \strokec7 'react-dom/client'\cf0 \strokec4 ;\cb1 \
\cf5 \cb3 \strokec5 import\cf0 \strokec4  \{ initializeApp \} \cf5 \strokec5 from\cf0 \strokec4  \cf7 \strokec7 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js'\cf0 \strokec4 ;\cb1 \
\cf5 \cb3 \strokec5 import\cf0 \strokec4  \{ getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged \} \cf5 \strokec5 from\cf0 \strokec4  \cf7 \strokec7 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js'\cf0 \strokec4 ;\cb1 \
\cf5 \cb3 \strokec5 import\cf0 \strokec4  \{ getFirestore, collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc, addDoc, query, where, getDocs \} \cf5 \strokec5 from\cf0 \strokec4  \cf7 \strokec7 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js'\cf0 \strokec4 ;\cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 // Firebase Context\cf0 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf5 \cb3 \strokec5 const\cf0 \strokec4  \cf6 \strokec6 FirebaseContext\cf0 \strokec4  = createContext(\cf5 \strokec5 null\cf0 \strokec4 );\cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 // Firebase
\f1 \'83\'52\'83\'93\'83\'65\'83\'4c\'83\'58\'83\'67\'83\'76\'83\'8d\'83\'6f\'83\'43\'83\'5f\'81\'5b
\f0 \cf0 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf5 \cb3 \strokec5 const\cf0 \strokec4  \cf6 \strokec6 FirebaseProvider\cf0 \strokec4  = (\{ children \}) => \{\cb1 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3     \cf5 \strokec5 const\cf0 \strokec4  [db, setDb] = useState(\cf5 \strokec5 null\cf0 \strokec4 );\cb1 \
\cb3     \cf5 \strokec5 const\cf0 \strokec4  [auth, setAuth] = useState(\cf5 \strokec5 null\cf0 \strokec4 );\cb1 \
\cb3     \cf5 \strokec5 const\cf0 \strokec4  [userId, setUserId] = useState(\cf5 \strokec5 null\cf0 \strokec4 );\cb1 \
\cb3     \cf5 \strokec5 const\cf0 \strokec4  [isAuthReady, setIsAuthReady] = useState(\cf5 \strokec5 false\cf0 \strokec4 );\cb1 \
\
\cb3     useEffect(() => \{\cb1 \
\cb3         \cf2 \strokec2 // Firebase initialization\cf0 \cb1 \strokec4 \
\cb3         \cf5 \strokec5 const\cf0 \strokec4  appId = \cf5 \strokec5 typeof\cf0 \strokec4  __app_id !== \cf7 \strokec7 'undefined'\cf0 \strokec4  ? __app_id : \cf7 \strokec7 'default-app-id'\cf0 \strokec4 ;\cb1 \
\cb3         \cf5 \strokec5 const\cf0 \strokec4  firebaseConfig = \cf5 \strokec5 typeof\cf0 \strokec4  __firebase_config !== \cf7 \strokec7 'undefined'\cf0 \strokec4  ? \cf6 \strokec6 JSON\cf0 \strokec4 .parse(__firebase_config) : \{\};\cb1 \
\
\cb3         \cf5 \strokec5 try\cf0 \strokec4  \{\cb1 \
\cb3             \cf5 \strokec5 const\cf0 \strokec4  app = initializeApp(firebaseConfig);\cb1 \
\cb3             \cf5 \strokec5 const\cf0 \strokec4  firestoreDb = getFirestore(app);\cb1 \
\cb3             \cf5 \strokec5 const\cf0 \strokec4  firebaseAuth = getAuth(app);\cb1 \
\
\cb3             setDb(firestoreDb);\cb1 \
\cb3             setAuth(firebaseAuth);\cb1 \
\
\cb3             \cf2 \strokec2 // Monitor authentication state\cf0 \cb1 \strokec4 \
\cb3             \cf5 \strokec5 const\cf0 \strokec4  unsubscribe = onAuthStateChanged(firebaseAuth, \cf5 \strokec5 async\cf0 \strokec4  (user) => \{\cb1 \
\cb3                 \cf5 \strokec5 if\cf0 \strokec4  (user) \{\cb1 \
\cb3                     setUserId(user.uid);\cb1 \
\cb3                 \} \cf5 \strokec5 else\cf0 \strokec4  \{\cb1 \
\cb3                     \cf2 \strokec2 // Attempt anonymous authentication\cf0 \cb1 \strokec4 \
\cb3                     \cf5 \strokec5 try\cf0 \strokec4  \{\cb1 \
\cb3                         \cf5 \strokec5 const\cf0 \strokec4  token = \cf5 \strokec5 typeof\cf0 \strokec4  __initial_auth_token !== \cf7 \strokec7 'undefined'\cf0 \strokec4  ? __initial_auth_token : \cf5 \strokec5 null\cf0 \strokec4 ;\cb1 \
\cb3                         \cf5 \strokec5 if\cf0 \strokec4  (token) \{\cb1 \
\cb3                             \cf5 \strokec5 await\cf0 \strokec4  signInWithCustomToken(firebaseAuth, token);\cb1 \
\cb3                         \} \cf5 \strokec5 else\cf0 \strokec4  \{\cb1 \
\cb3                             \cf5 \strokec5 await\cf0 \strokec4  signInAnonymously(firebaseAuth);\cb1 \
\cb3                         \}\cb1 \
\cb3                         setUserId(firebaseAuth.currentUser?.uid || crypto.randomUUID());\cb1 \
\cb3                     \} \cf5 \strokec5 catch\cf0 \strokec4  (error) \{\cb1 \
\cb3                         console.error(\cf7 \strokec7 "Firebase Auth Error:"\cf0 \strokec4 , error);\cb1 \
\cb3                         setUserId(crypto.randomUUID()); \cf2 \strokec2 // Use random ID on auth failure\cf0 \cb1 \strokec4 \
\cb3                     \}\cb1 \
\cb3                 \}\cb1 \
\cb3                 setIsAuthReady(\cf5 \strokec5 true\cf0 \strokec4 );\cb1 \
\cb3             \});\cb1 \
\
\cb3             \cf5 \strokec5 return\cf0 \strokec4  () => unsubscribe();\cb1 \
\cb3         \} \cf5 \strokec5 catch\cf0 \strokec4  (error) \{\cb1 \
\cb3             console.error(\cf7 \strokec7 "Failed to initialize Firebase:"\cf0 \strokec4 , error);\cb1 \
\cb3             setIsAuthReady(\cf5 \strokec5 true\cf0 \strokec4 ); \cf2 \strokec2 // Set to ready state even on error\cf0 \cb1 \strokec4 \
\cb3             setUserId(crypto.randomUUID()); \cf2 \strokec2 // Use random ID even on error\cf0 \cb1 \strokec4 \
\cb3         \}\cb1 \
\cb3     \}, []);\cb1 \
\
\cb3     \cf5 \strokec5 return\cf0 \strokec4  (\cb1 \
\cb3         <\cf6 \strokec6 FirebaseContext\cf0 \strokec4 .\cf6 \strokec6 Provider\cf0 \strokec4  value=\{\{ db, auth, userId, isAuthReady \}\}>\cb1 \
\cb3             \{children\}\cb1 \
\cb3         </\cf6 \strokec6 FirebaseContext\cf0 \strokec4 .\cf6 \strokec6 Provider\cf0 \strokec4 >\cb1 \
\cb3     );\cb1 \
\cb3 \};\cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 // Hook for using Firebase in components\cf0 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf5 \cb3 \strokec5 const\cf0 \strokec4  useFirebase = () => \{\cb1 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3     \cf5 \strokec5 return\cf0 \strokec4  useContext(\cf6 \strokec6 FirebaseContext\cf0 \strokec4 );\cb1 \
\cb3 \};\cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 // Generic Modal Component\cf0 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf5 \cb3 \strokec5 const\cf0 \strokec4  \cf6 \strokec6 Modal\cf0 \strokec4  = (\{ isOpen, onClose, title, children \}) => \{\cb1 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3     \cf5 \strokec5 if\cf0 \strokec4  (!isOpen) \cf5 \strokec5 return\cf0 \strokec4  \cf5 \strokec5 null\cf0 \strokec4 ;\cb1 \
\
\cb3     \cf5 \strokec5 return\cf0 \strokec4  (\cb1 \
\cb3         <div className=\cf7 \strokec7 "fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4"\cf0 \strokec4 >\cb1 \
\cb3             <div className=\cf7 \strokec7 "bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative"\cf0 \strokec4 >\cb1 \
\cb3                 <h3 className=\cf7 \strokec7 "text-xl font-semibold text-gray-800 mb-4"\cf0 \strokec4 >\{title\}</h3>\cb1 \
\cb3                 <button onClick=\{onClose\} className=\cf7 \strokec7 "absolute top-4 right-4 text-gray-500 hover:text-gray-700"\cf0 \strokec4 >\cb1 \
\cb3                     <svg className=\cf7 \strokec7 "w-6 h-6"\cf0 \strokec4  fill=\cf7 \strokec7 "none"\cf0 \strokec4  stroke=\cf7 \strokec7 "currentColor"\cf0 \strokec4  viewBox=\cf7 \strokec7 "0 0 24 24"\cf0 \strokec4  xmlns=\cf7 \strokec7 "http://www.w3.org/2000/svg"\cf0 \strokec4 ><path strokeLinecap=\cf7 \strokec7 "round"\cf0 \strokec4  strokeLinejoin=\cf7 \strokec7 "round"\cf0 \strokec4  strokeWidth=\cf7 \strokec7 "2"\cf0 \strokec4  d=\cf7 \strokec7 "M6 18L18 6M6 6l12 12"\cf0 \strokec4 ></path></svg>\cb1 \
\cb3                 </button>\cb1 \
\cb3                 <div className=\cf7 \strokec7 "mt-2 text-sm text-gray-600"\cf0 \strokec4 >\cb1 \
\cb3                     \{children\}\cb1 \
\cb3                 </div>\cb1 \
\cb3             </div>\cb1 \
\cb3         </div>\cb1 \
\cb3     );\cb1 \
\cb3 \};\cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 // Pastel colors definition\cf0 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf5 \cb3 \strokec5 const\cf0 \strokec4  pastelColorMap = [\cb1 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3     \{ name: \cf7 \strokec7 "
\f1 \'83\'89\'83\'43\'83\'67\'83\'75\'83\'8b\'81\'5b
\f0 "\cf0 \strokec4 , tabBg: \cf7 \strokec7 "bg-blue-300"\cf0 \strokec4 , mainBg: \cf7 \strokec7 "bg-blue-50"\cf0 \strokec4  \},\cb1 \
\cb3     \{ name: \cf7 \strokec7 "
\f1 \'83\'89\'83\'43\'83\'67\'83\'4f\'83\'8a\'81\'5b\'83\'93
\f0 "\cf0 \strokec4 , tabBg: \cf7 \strokec7 "bg-green-300"\cf0 \strokec4 , mainBg: \cf7 \strokec7 "bg-green-50"\cf0 \strokec4  \},\cb1 \
\cb3     \{ name: \cf7 \strokec7 "
\f1 \'83\'89\'83\'43\'83\'67\'83\'8c\'83\'62\'83\'68
\f0 "\cf0 \strokec4 , tabBg: \cf7 \strokec7 "bg-red-300"\cf0 \strokec4 , mainBg: \cf7 \strokec7 "bg-red-50"\cf0 \strokec4  \},\cb1 \
\cb3     \{ name: \cf7 \strokec7 "
\f1 \'83\'89\'83\'43\'83\'67\'83\'70\'81\'5b\'83\'76\'83\'8b
\f0 "\cf0 \strokec4 , tabBg: \cf7 \strokec7 "bg-purple-300"\cf0 \strokec4 , mainBg: \cf7 \strokec7 "bg-purple-50"\cf0 \strokec4  \},\cb1 \
\cb3     \{ name: \cf7 \strokec7 "
\f1 \'83\'89\'83\'43\'83\'67\'83\'43\'83\'47\'83\'8d\'81\'5b
\f0 "\cf0 \strokec4 , tabBg: \cf7 \strokec7 "bg-yellow-200"\cf0 \strokec4 , mainBg: \cf7 \strokec7 "bg-yellow-50"\cf0 \strokec4  \},\cb1 \
\cb3     \{ name: \cf7 \strokec7 "
\f1 \'83\'89\'83\'43\'83\'67\'83\'73\'83\'93\'83\'4e
\f0 "\cf0 \strokec4 , tabBg: \cf7 \strokec7 "bg-pink-300"\cf0 \strokec4 , mainBg: \cf7 \strokec7 "bg-pink-50"\cf0 \strokec4  \},\cb1 \
\cb3     \{ name: \cf7 \strokec7 "
\f1 \'83\'89\'83\'43\'83\'67\'83\'43\'83\'93\'83\'66\'83\'42\'83\'53
\f0 "\cf0 \strokec4 , tabBg: \cf7 \strokec7 "bg-indigo-300"\cf0 \strokec4 , mainBg: \cf7 \strokec7 "bg-indigo-50"\cf0 \strokec4  \},\cb1 \
\cb3     \{ name: \cf7 \strokec7 "
\f1 \'83\'66\'83\'74\'83\'48\'83\'8b\'83\'67
\f0  (
\f1 \'94\'92
\f0 )"\cf0 \strokec4 , tabBg: \cf7 \strokec7 "bg-gray-200"\cf0 \strokec4 , mainBg: \cf7 \strokec7 "bg-white"\cf0 \strokec4  \}, \cf2 \strokec2 // Changed to white for default background\cf0 \cb1 \strokec4 \
\cb3 ];\cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 // Tab Settings Modal Component\cf0 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf5 \cb3 \strokec5 const\cf0 \strokec4  \cf6 \strokec6 TabSettingsModal\cf0 \strokec4  = (\{ isOpen, onClose, tabs, onAddTab, onDeleteTab, onMoveTab, onUpdateTabColor \}) => \{\cb1 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3     \cf5 \strokec5 const\cf0 \strokec4  [newTabName, setNewTabName] = useState(\cf7 \strokec7 ''\cf0 \strokec4 );\cb1 \
\cb3     \cf5 \strokec5 const\cf0 \strokec4  [draggingIndex, setDraggingIndex] = useState(\cf5 \strokec5 null\cf0 \strokec4 );\cb1 \
\cb3     \cf5 \strokec5 const\cf0 \strokec4  dragItem = useRef(\cf5 \strokec5 null\cf0 \strokec4 );\cb1 \
\cb3     \cf5 \strokec5 const\cf0 \strokec4  dragOverItem = useRef(\cf5 \strokec5 null\cf0 \strokec4 );\cb1 \
\
\cb3     \cf2 \strokec2 // List of predefined Tailwind colors for selection (using pastelColorMap)\cf0 \cb1 \strokec4 \
\cb3     \cf5 \strokec5 const\cf0 \strokec4  colors = pastelColorMap; \cf2 \strokec2 // Use the new pastelColorMap\cf0 \cb1 \strokec4 \
\
\cb3     \cf2 \strokec2 // Start drag\cf0 \cb1 \strokec4 \
\cb3     \cf5 \strokec5 const\cf0 \strokec4  handleDragStart = (e, index) => \{\cb1 \
\cb3         dragItem.current = index;\cb1 \
\cb3         setDraggingIndex(index);\cb1 \
\cb3         e.dataTransfer.effectAllowed = \cf7 \strokec7 "move"\cf0 \strokec4 ;\cb1 \
\cb3     \};\cb1 \
\
\cb3     \cf2 \strokec2 // Drag over\cf0 \cb1 \strokec4 \
\cb3     \cf5 \strokec5 const\cf0 \strokec4  handleDragEnter = (e, index) => \{\cb1 \
\cb3         dragOverItem.current = index;\cb1 \
\cb3     \};\cb1 \
\
\cb3     \cf2 \strokec2 // End drag\cf0 \cb1 \strokec4 \
\cb3     \cf5 \strokec5 const\cf0 \strokec4  handleDragEnd = () => \{\cb1 \
\cb3         \cf5 \strokec5 if\cf0 \strokec4  (dragItem.current !== \cf5 \strokec5 null\cf0 \strokec4  && dragOverItem.current !== \cf5 \strokec5 null\cf0 \strokec4 ) \{\cb1 \
\cb3             onMoveTab(dragItem.current, dragOverItem.current);\cb1 \
\cb3         \}\cb1 \
\cb3         setDraggingIndex(\cf5 \strokec5 null\cf0 \strokec4 );\cb1 \
\cb3         dragItem.current = \cf5 \strokec5 null\cf0 \strokec4 ;\cb1 \
\cb3         dragOverItem.current = \cf5 \strokec5 null\cf0 \strokec4 ;\cb1 \
\cb3     \};\cb1 \
\
\cb3     \cf2 \strokec2 // Handle drop (optional, handleDragEnd might be sufficient)\cf0 \cb1 \strokec4 \
\cb3     \cf5 \strokec5 const\cf0 \strokec4  handleDrop = (e) => \{\cb1 \
\cb3         e.preventDefault();\cb1 \
\cb3         \cf2 \strokec2 // No specific handling here as handleDragEnd takes care of it\cf0 \cb1 \strokec4 \
\cb3     \};\cb1 \
\
\cb3     \cf5 \strokec5 const\cf0 \strokec4  handleDragOver = (e) => \{\cb1 \
\cb3         e.preventDefault(); \cf2 \strokec2 // Necessary to allow dropping\cf0 \cb1 \strokec4 \
\cb3     \};\cb1 \
\
\cb3     \cf5 \strokec5 const\cf0 \strokec4  handleAddTab = () => \{\cb1 \
\cb3         \cf5 \strokec5 if\cf0 \strokec4  (newTabName.trim()) \{\cb1 \
\cb3             onAddTab(newTabName.trim());\cb1 \
\cb3             setNewTabName(\cf7 \strokec7 ''\cf0 \strokec4 );\cb1 \
\cb3         \}\cb1 \
\cb3     \};\cb1 \
\
\cb3     \cf5 \strokec5 return\cf0 \strokec4  (\cb1 \
\cb3         <\cf6 \strokec6 Modal\cf0 \strokec4  isOpen=\{isOpen\} onClose=\{onClose\} title=\cf7 \strokec7 "
\f1 \'83\'5e\'83\'75\'82\'cc\'90\'dd\'92\'e8
\f0 "\cf0 \strokec4 >\cb1 \
\cb3             <div className=\cf7 \strokec7 "mb-4"\cf0 \strokec4 >\cb1 \
\cb3                 <input\cb1 \
\cb3                     type=\cf7 \strokec7 "text"\cf0 \cb1 \strokec4 \
\cb3                     className=\cf7 \strokec7 "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"\cf0 \cb1 \strokec4 \
\cb3                     placeholder=\cf7 \strokec7 "
\f1 \'90\'56\'82\'b5\'82\'a2\'83\'5e\'83\'75\'96\'bc
\f0 "\cf0 \cb1 \strokec4 \
\cb3                     value=\{newTabName\}\cb1 \
\cb3                     onChange=\{(e) => setNewTabName(e.target.value)\}\cb1 \
\cb3                     onKeyPress=\{(e) => \{ \cf5 \strokec5 if\cf0 \strokec4  (e.key === \cf7 \strokec7 'Enter'\cf0 \strokec4 ) handleAddTab(); \}\}\cb1 \
\cb3                 />\cb1 \
\cb3                 <button\cb1 \
\cb3                     onClick=\{handleAddTab\}\cb1 \
\cb3                     className=\cf7 \strokec7 "mt-2 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-300"\cf0 \cb1 \strokec4 \
\cb3                 >\cb1 \
\cb3                     
\f1 \cf8 \strokec8 \'83\'5e\'83\'75\'82\'f0\'92\'c7\'89\'c1
\f0 \cf0 \cb1 \strokec4 \
\cb3                 </button>\cb1 \
\cb3             </div>\cb1 \
\cb3             <h4 className=\cf7 \strokec7 "font-medium text-gray-700 mb-2"\cf0 \strokec4 >
\f1 \cf8 \strokec8 \'8a\'f9\'91\'b6\'82\'cc\'83\'5e\'83\'75
\f0 \cf0 \strokec4 :</h4>\cb1 \
\cb3             <ul className=\cf7 \strokec7 "space-y-2 max-h-60 overflow-y-auto"\cf0 \strokec4 >\cb1 \
\cb3                 \{tabs.map((tab, index) => (\cb1 \
\cb3                     <li\cb1 \
\cb3                         key=\{tab.id\}\cb1 \
\cb3                         className=\{\cf7 \strokec7 `flex items-center justify-between p-3 bg-gray-50 rounded-md shadow-sm border border-gray-200 cursor-grab \cf0 \strokec4 $\{draggingIndex === index ? \cf7 \strokec7 'opacity-50 border-blue-500'\cf0 \strokec4  : \cf7 \strokec7 ''\cf0 \strokec4 \}\cf7 \strokec7 `\cf0 \strokec4 \}\cb1 \
\cb3                         draggable\cb1 \
\cb3                         onDragStart=\{(e) => handleDragStart(e, index)\}\cb1 \
\cb3                         onDragEnter=\{(e) => handleDragEnter(e, index)\}\cb1 \
\cb3                         onDragEnd=\{handleDragEnd\}\cb1 \
\cb3                         onDragOver=\{handleDragOver\}\cb1 \
\cb3                         onDrop=\{handleDrop\}\cb1 \
\cb3                     >\cb1 \
\cb3                         <div className=\cf7 \strokec7 "flex items-center"\cf0 \strokec4 >\cb1 \
\cb3                             \{\cf2 \strokec2 /* Move handle */\cf0 \strokec4 \}\cb1 \
\cb3                             <svg className=\cf7 \strokec7 "w-5 h-5 text-gray-400 mr-3"\cf0 \strokec4  fill=\cf7 \strokec7 "none"\cf0 \strokec4  stroke=\cf7 \strokec7 "currentColor"\cf0 \strokec4  viewBox=\cf7 \strokec7 "0 0 24 24"\cf0 \strokec4  xmlns=\cf7 \strokec7 "http://www.w3.org/2000/svg"\cf0 \strokec4 ><path strokeLinecap=\cf7 \strokec7 "round"\cf0 \strokec4  strokeLinejoin=\cf7 \strokec7 "round"\cf0 \strokec4  strokeWidth=\cf7 \strokec7 "2"\cf0 \strokec4  d=\cf7 \strokec7 "M4 6h16M4 12h16m-7 6h7"\cf0 \strokec4 ></path></svg>\cb1 \
\cb3                             <span className=\cf7 \strokec7 "text-gray-800"\cf0 \strokec4 >\{tab.name\}</span>\cb1 \
\cb3                         </div>\cb1 \
\cb3                         <div className=\cf7 \strokec7 "flex items-center space-x-2"\cf0 \strokec4 > \{\cf2 \strokec2 /* Added flex container for alignment */\cf0 \strokec4 \}\cb1 \
\cb3                             <select\cb1 \
\cb3                                 value=\{tab.color || pastelColorMap[\cf9 \strokec9 0\cf0 \strokec4 ].tabBg\} \cf2 \strokec2 // Default to the first pastel color\cf0 \cb1 \strokec4 \
\cb3                                 onChange=\{(e) => onUpdateTabColor(tab.id, e.target.value)\}\cb1 \
\cb3                                 className=\cf7 \strokec7 "p-1 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"\cf0 \cb1 \strokec4 \
\cb3                             >\cb1 \
\cb3                                 \{colors.map((c) => (\cb1 \
\cb3                                     <option key=\{c.tabBg\} value=\{c.tabBg\}>\{c.name\}</option>\cb1 \
\cb3                                 ))\}\cb1 \
\cb3                             </select>\cb1 \
\cb3                             <button\cb1 \
\cb3                                 onClick=\{() => onDeleteTab(tab.id)\}\cb1 \
\cb3                                 className=\cf7 \strokec7 "text-red-500 hover:text-red-700 transition duration-300 p-1 rounded-full hover:bg-red-100"\cf0 \cb1 \strokec4 \
\cb3                             >\cb1 \
\cb3                                 <svg className=\cf7 \strokec7 "w-5 h-5"\cf0 \strokec4  fill=\cf7 \strokec7 "none"\cf0 \strokec4  stroke=\cf7 \strokec7 "currentColor"\cf0 \strokec4  viewBox=\cf7 \strokec7 "0 0 24 24"\cf0 \strokec4  xmlns=\cf7 \strokec7 "http://www.w3.org/2000/svg"\cf0 \strokec4 ><path strokeLinecap=\cf7 \strokec7 "round"\cf0 \strokec4  strokeLinejoin=\cf7 \strokec7 "round"\cf0 \strokec4  strokeWidth=\cf7 \strokec7 "2"\cf0 \strokec4  d=\cf7 \strokec7 "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"\cf0 \strokec4 ></path></svg>\cb1 \
\cb3                             </button>\cb1 \
\cb3                         </div>\cb1 \
\cb3                     </li>\cb1 \
\cb3                 ))\}\cb1 \
\cb3             </ul>\cb1 \
\cb3         </\cf6 \strokec6 Modal\cf0 \strokec4 >\cb1 \
\cb3     );\cb1 \
\cb3 \};\cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 /**\cf0 \cb1 \strokec4 \
\cf2 \cb3 \strokec2  * 
\f1 \'83\'4a\'83\'5e\'83\'4a\'83\'69\'82\'f0\'82\'d0\'82\'e7\'82\'aa\'82\'c8\'82\'c9\'95\'cf\'8a\'b7\'82\'b7\'82\'e9\'83\'77\'83\'8b\'83\'70\'81\'5b\'8a\'d6\'90\'94
\f0 \cf0 \cb1 \strokec4 \
\cf2 \cb3 \strokec2  * @param \{string\} str - 
\f1 \'95\'cf\'8a\'b7\'82\'b7\'82\'e9\'95\'b6\'8e\'9a\'97\'f1
\f0 \cf0 \cb1 \strokec4 \
\cf2 \cb3 \strokec2  * @returns \{string\} 
\f1 \'95\'cf\'8a\'b7\'82\'b3\'82\'ea\'82\'bd\'95\'b6\'8e\'9a\'97\'f1
\f0 \cf0 \cb1 \strokec4 \
\cf2 \cb3 \strokec2  */\cf0 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf5 \cb3 \strokec5 const\cf0 \strokec4  convertKatakanaToHiragana = (str) => \{\cb1 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3     \cf5 \strokec5 return\cf0 \strokec4  str.replace(\cf10 \strokec10 /[\\u30a1-\\u30f6]/\cf5 \strokec5 g\cf0 \strokec4 , \cf5 \strokec5 function\cf0 \strokec4 (match) \{\cb1 \
\cb3         \cf5 \strokec5 return\cf0 \strokec4  \cf6 \strokec6 String\cf0 \strokec4 .fromCharCode(match.charCodeAt(\cf9 \strokec9 0\cf0 \strokec4 ) - \cf11 \strokec11 0x60\cf0 \strokec4 );\cb1 \
\cb3     \});\cb1 \
\cb3 \};\cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 /**\cf0 \cb1 \strokec4 \
\cf2 \cb3 \strokec2  * 
\f1 \'93\'fa\'96\'7b\'8c\'ea\'83\'65\'83\'4c\'83\'58\'83\'67\'82\'f0\'83\'7d\'81\'5b\'83\'57\'97\'70\'82\'c9\'90\'b3\'8b\'4b\'89\'bb\'82\'b7\'82\'e9\'83\'77\'83\'8b\'83\'70\'81\'5b\'8a\'d6\'90\'94
\f0 \cf0 \cb1 \strokec4 \
\cf2 \cb3 \strokec2  * 
\f1 \'83\'4a\'83\'5e\'83\'4a\'83\'69\'82\'f0\'82\'d0\'82\'e7\'82\'aa\'82\'c8\'82\'c9\'95\'cf\'8a\'b7\'82\'b5\'81\'41\'93\'c1\'92\'e8\'82\'cc\'8a\'bf\'8e\'9a\'82\'f0\'82\'d0\'82\'e7\'82\'aa\'82\'c8\'82\'c9\'95\'cf\'8a\'b7\'82\'b5\'82\'dc\'82\'b7\'81\'42
\f0 \cf0 \cb1 \strokec4 \
\cf2 \cb3 \strokec2  * @param \{string\} str - 
\f1 \'90\'b3\'8b\'4b\'89\'bb\'82\'b7\'82\'e9\'95\'b6\'8e\'9a\'97\'f1
\f0 \cf0 \cb1 \strokec4 \
\cf2 \cb3 \strokec2  * @returns \{string\} 
\f1 \'90\'b3\'8b\'4b\'89\'bb\'82\'b3\'82\'ea\'82\'bd\'95\'b6\'8e\'9a\'97\'f1
\f0 \cf0 \cb1 \strokec4 \
\cf2 \cb3 \strokec2  */\cf0 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf5 \cb3 \strokec5 const\cf0 \strokec4  normalizeJapaneseTextForMerging = (str) => \{\cb1 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3     \cf5 \strokec5 let\cf0 \strokec4  normalized = str;\cb1 \
\
\cb3     \cf2 \strokec2 // 1. 
\f1 \'83\'4a\'83\'5e\'83\'4a\'83\'69\'82\'f0\'82\'d0\'82\'e7\'82\'aa\'82\'c8\'82\'c9\'95\'cf\'8a\'b7
\f0 \cf0 \cb1 \strokec4 \
\cb3     normalized = convertKatakanaToHiragana(normalized);\cb1 \
\
\cb3     \cf2 \strokec2 // 2. 
\f1 \'93\'c1\'92\'e8\'82\'cc\'8a\'bf\'8e\'9a\'82\'f0\'82\'d0\'82\'e7\'82\'aa\'82\'c8\'82\'c9\'95\'cf\'8a\'b7
\f0 \cf0 \cb1 \strokec4 \
\cb3     \cf2 \strokec2 // 
\f1 \'92\'8d\'88\'d3
\f0 : 
\f1 \'82\'b1\'82\'ea\'82\'cd\'8a\'ae\'91\'53\'82\'c8\'8a\'bf\'8e\'9a\'95\'cf\'8a\'b7\'82\'c5\'82\'cd\'82\'a0\'82\'e8\'82\'dc\'82\'b9\'82\'f1\'81\'42\'88\'ea\'94\'ca\'93\'49\'82\'c8\'93\'c7\'82\'dd\'95\'fb\'82\'f0\'83\'4a\'83\'6f\'81\'5b\'82\'b7\'82\'e9\'8c\'c0\'92\'e8\'93\'49\'82\'c8\'91\'ce\'89\'9e\'82\'c5\'82\'b7\'81\'42
\f0 \cf0 \cb1 \strokec4 \
\cb3     \cf2 \strokec2 // 
\f1 \'97\'e1
\f0 : 
\f1 \'81\'75\'96\'cb\'81\'76\'82\'f0\'81\'75\'82\'df\'82\'f1\'81\'76\'82\'c9\'95\'cf\'8a\'b7
\f0 \cf0 \cb1 \strokec4 \
\cb3     normalized = normalized.replace(\cf7 \strokec7 '
\f1 \'96\'cb
\f0 '\cf0 \strokec4 , \cf7 \strokec7 '
\f1 \'82\'df\'82\'f1
\f0 '\cf0 \strokec4 );\cb1 \
\cb3     \cf2 \strokec2 // 
\f1 \'95\'4b\'97\'76\'82\'c9\'89\'9e\'82\'b6\'82\'c4\'91\'bc\'82\'cc\'8a\'bf\'8e\'9a
\f0 -
\f1 \'82\'d0\'82\'e7\'82\'aa\'82\'c8\'95\'cf\'8a\'b7\'83\'8b\'81\'5b\'83\'8b\'82\'f0\'92\'c7\'89\'c1\'82\'c5\'82\'ab\'82\'dc\'82\'b7\'81\'42
\f0 \cf0 \cb1 \strokec4 \
\cb3     \cf2 \strokec2 // 
\f1 \'97\'e1
\f0 : normalized = normalized.replace('
\f1 \'96\'ec\'8d\'d8
\f0 ', '
\f1 \'82\'e2\'82\'b3\'82\'a2
\f0 ');\cf0 \cb1 \strokec4 \
\cb3     \cf2 \strokec2 // 
\f1 \'97\'e1
\f0 : normalized = normalized.replace('
\f1 \'97\'91
\f0 ', '
\f1 \'82\'bd\'82\'dc\'82\'b2
\f0 ');\cf0 \cb1 \strokec4 \
\
\cb3     \cf5 \strokec5 return\cf0 \strokec4  normalized;\cb1 \
\cb3 \};\cb1 \
\
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 // History Modal Component\cf0 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf5 \cb3 \strokec5 const\cf0 \strokec4  \cf6 \strokec6 HistoryModal\cf0 \strokec4  = (\{ isOpen, onClose, historyItems, allTabs, initialActiveTabId \}) => \{\cb1 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3     \cf2 \strokec2 // State to hold the ID of the selected tab\cf0 \cb1 \strokec4 \
\cb3     \cf5 \strokec5 const\cf0 \strokec4  [selectedTabId, setSelectedTabId] = useState(initialActiveTabId);\cb1 \
\
\cb3     \cf2 \strokec2 // Set initial active tab ID when modal opens\cf0 \cb1 \strokec4 \
\cb3     useEffect(() => \{\cb1 \
\cb3         setSelectedTabId(initialActiveTabId);\cb1 \
\cb3     \}, [initialActiveTabId, isOpen]);\cb1 \
\
\cb3     \cf2 \strokec2 // Filter history items based on the selected tab\cf0 \cb1 \strokec4 \
\cb3     \cf5 \strokec5 const\cf0 \strokec4  filteredHistoryItems = selectedTabId\cb1 \
\cb3         ? historyItems.filter(item => item.tabId === selectedTabId)\cb1 \
\cb3         : historyItems; \cf2 \strokec2 // If no tab is selected, show all history (for "All History" option)\cf0 \cb1 \strokec4 \
\
\cb3     \cf2 \strokec2 // Group filtered history by month and then by memo text (normalized)\cf0 \cb1 \strokec4 \
\cb3     \cf5 \strokec5 const\cf0 \strokec4  groupedAndMergedHistory = filteredHistoryItems.reduce((acc, item) => \{\cb1 \
\cb3         \cf5 \strokec5 const\cf0 \strokec4  date = \cf5 \strokec5 new\cf0 \strokec4  \cf6 \strokec6 Date\cf0 \strokec4 (item.checkedDate);\cb1 \
\cb3         \cf5 \strokec5 const\cf0 \strokec4  yearMonth = \cf7 \strokec7 `\cf0 \strokec4 $\{date.getFullYear()\}
\f1 \cf7 \strokec7 \'94\'4e
\f0 \cf0 \strokec4 $\{date.getMonth() + \cf9 \strokec9 1\cf0 \strokec4 \}
\f1 \cf7 \strokec7 \'8c\'8e
\f0 `\cf0 \strokec4 ;\cb1 \
\cb3         \cb1 \
\cb3         \cf5 \strokec5 if\cf0 \strokec4  (!acc[yearMonth]) \{\cb1 \
\cb3             acc[yearMonth] = \{\}; \cf2 \strokec2 // Initialize with an object for memo texts\cf0 \cb1 \strokec4 \
\cb3         \}\cb1 \
\
\cb3         \cf2 \strokec2 // Use normalized text as key for merging\cf0 \cb1 \strokec4 \
\cb3         \cf5 \strokec5 const\cf0 \strokec4  memoKey = normalizeJapaneseTextForMerging(item.text); \cf2 \strokec2 // Use the new normalization function\cf0 \cb1 \strokec4 \
\cb3         \cb1 \
\cb3         \cf5 \strokec5 if\cf0 \strokec4  (!acc[yearMonth][memoKey]) \{\cb1 \
\cb3             acc[yearMonth][memoKey] = \{\cb1 \
\cb3                 text: item.text, \cf2 \strokec2 // Keep original text for display or use normalized: memoKey\cf0 \cb1 \strokec4 \
\cb3                 count: \cf9 \strokec9 0\cf0 \strokec4 ,\cb1 \
\cb3                 latestDate: item.checkedDate \cf2 \strokec2 // Store the latest date for sorting if needed\cf0 \cb1 \strokec4 \
\cb3             \};\cb1 \
\cb3         \}\cb1 \
\cb3         acc[yearMonth][memoKey].count += \cf9 \strokec9 1\cf0 \strokec4 ;\cb1 \
\
\cb3         \cf2 \strokec2 // Optionally update latestDate if you want to sort by latest occurrence within the merged item\cf0 \cb1 \strokec4 \
\cb3         \cf5 \strokec5 if\cf0 \strokec4  (\cf5 \strokec5 new\cf0 \strokec4  \cf6 \strokec6 Date\cf0 \strokec4 (item.checkedDate) > \cf5 \strokec5 new\cf0 \strokec4  \cf6 \strokec6 Date\cf0 \strokec4 (acc[yearMonth][memoKey].latestDate)) \{\cb1 \
\cb3             acc[yearMonth][memoKey].latestDate = item.checkedDate;\cb1 \
\cb3         \}\cb1 \
\
\cb3         \cf5 \strokec5 return\cf0 \strokec4  acc;\cb1 \
\cb3     \}, \{\});\cb1 \
\
\cb3     \cf2 \strokec2 // Convert groupedAndMergedHistory into a sortable array for rendering\cf0 \cb1 \strokec4 \
\cb3     \cf5 \strokec5 const\cf0 \strokec4  sortedMonths = \cf6 \strokec6 Object\cf0 \strokec4 .keys(groupedAndMergedHistory).sort((a, b) => \{\cb1 \
\cb3         \cf5 \strokec5 const\cf0 \strokec4  [yearA, monthA] = a.replace(\cf7 \strokec7 '
\f1 \'94\'4e
\f0 '\cf0 \strokec4 , \cf7 \strokec7 ' '\cf0 \strokec4 ).replace(\cf7 \strokec7 '
\f1 \'8c\'8e
\f0 '\cf0 \strokec4 , \cf7 \strokec7 ''\cf0 \strokec4 ).split(\cf7 \strokec7 ' '\cf0 \strokec4 ).map(\cf6 \strokec6 Number\cf0 \strokec4 );\cb1 \
\cb3         \cf5 \strokec5 const\cf0 \strokec4  [yearB, monthB] = b.replace(\cf7 \strokec7 '
\f1 \'94\'4e
\f0 '\cf0 \strokec4 , \cf7 \strokec7 ' '\cf0 \strokec4 ).replace(\cf7 \strokec7 '
\f1 \'8c\'8e
\f0 '\cf0 \strokec4 , \cf7 \strokec7 ''\cf0 \strokec4 ).split(\cf7 \strokec7 ' '\cf0 \strokec4 ).map(\cf6 \strokec6 Number\cf0 \strokec4 );\cb1 \
\cb3         \cf5 \strokec5 if\cf0 \strokec4  (yearA !== yearB) \cf5 \strokec5 return\cf0 \strokec4  yearB - yearA; \cf2 \strokec2 // Latest year on top\cf0 \cb1 \strokec4 \
\cb3         \cf5 \strokec5 return\cf0 \strokec4  monthB - monthA; \cf2 \strokec2 // Latest month on top\cf0 \cb1 \strokec4 \
\cb3     \});\cb1 \
\
\cb3     \cf5 \strokec5 const\cf0 \strokec4  getTabName = (tabId) => \{\cb1 \
\cb3         \cf5 \strokec5 const\cf0 \strokec4  tab = allTabs.find(t => t.id === tabId);\cb1 \
\cb3         \cf5 \strokec5 return\cf0 \strokec4  tab ? tab.name : \cf7 \strokec7 '
\f1 \'95\'73\'96\'be\'82\'c8\'83\'5e\'83\'75
\f0 '\cf0 \strokec4 ;\cb1 \
\cb3     \};\cb1 \
\
\cb3     \cf5 \strokec5 return\cf0 \strokec4  (\cb1 \
\cb3         <\cf6 \strokec6 Modal\cf0 \strokec4  isOpen=\{isOpen\} onClose=\{onClose\} title=\cf7 \strokec7 "
\f1 \'97\'9a\'97\'f0\'88\'ea\'97\'97
\f0 "\cf0 \strokec4 >\cb1 \
\cb3             <div className=\cf7 \strokec7 "mb-4"\cf0 \strokec4 >\cb1 \
\cb3                 <label htmlFor=\cf7 \strokec7 "tab-select"\cf0 \strokec4  className=\cf7 \strokec7 "block text-gray-700 text-sm font-medium mb-2"\cf0 \strokec4 >
\f1 \cf8 \strokec8 \'95\'5c\'8e\'a6\'82\'b7\'82\'e9\'83\'5e\'83\'75\'82\'f0\'91\'49\'91\'f0
\f0 \cf0 \strokec4 :</label>\cb1 \
\cb3                 <select\cb1 \
\cb3                     id=\cf7 \strokec7 "tab-select"\cf0 \cb1 \strokec4 \
\cb3                     className=\cf7 \strokec7 "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"\cf0 \cb1 \strokec4 \
\cb3                     value=\{selectedTabId || \cf7 \strokec7 ''\cf0 \strokec4 \} \cf2 \strokec2 // Allow empty string for "All History"\cf0 \cb1 \strokec4 \
\cb3                     onChange=\{(e) => setSelectedTabId(e.target.value)\}\cb1 \
\cb3                 >\cb1 \
\cb3                     <option value=\cf7 \strokec7 ""\cf0 \strokec4 >
\f1 \cf8 \strokec8 \'91\'53\'82\'c4\'82\'cc\'97\'9a\'97\'f0
\f0 \cf0 \strokec4 </option> \{\cf2 \strokec2 /* Option to display all history */\cf0 \strokec4 \}\cb1 \
\cb3                     \{allTabs.map(tab => (\cb1 \
\cb3                         <option key=\{tab.id\} value=\{tab.id\}>\{tab.name\}</option>\cb1 \
\cb3                     ))\}\cb1 \
\cb3                 </select>\cb1 \
\cb3             </div>\cb1 \
\
\cb3             \{filteredHistoryItems.length === \cf9 \strokec9 0\cf0 \strokec4  ? (\cb1 \
\cb3                 <p className=\cf7 \strokec7 "text-gray-600 text-center mt-4"\cf0 \strokec4 >
\f1 \cf8 \strokec8 \'91\'49\'91\'f0\'82\'b3\'82\'ea\'82\'bd\'83\'5e\'83\'75\'82\'c9\'82\'cd\'97\'9a\'97\'f0\'82\'aa\'82\'a0\'82\'e8\'82\'dc\'82\'b9\'82\'f1\'81\'42
\f0 \cf0 \strokec4 </p>\cb1 \
\cb3             ) : (\cb1 \
\cb3                 <div className=\cf7 \strokec7 "space-y-4 max-h-96 overflow-y-auto"\cf0 \strokec4 >\cb1 \
\cb3                     \{sortedMonths.map(month => (\cb1 \
\cb3                         <div key=\{month\} className=\cf7 \strokec7 "border-b pb-2"\cf0 \strokec4 >\cb1 \
\cb3                             <h4 className=\cf7 \strokec7 "text-lg font-semibold text-gray-800 sticky top-0 bg-white py-1"\cf0 \strokec4 >\cb1 \
\cb3                                 \{month\} (
\f1 \cf8 \strokec8 \'8a\'ae\'97\'b9\'82\'b5\'82\'bd\'83\'81\'83\'82
\f0 \cf0 \strokec4 : \{\cf6 \strokec6 Object\cf0 \strokec4 .values(groupedAndMergedHistory[month]).reduce((total, memo) => total + memo.count, \cf9 \strokec9 0\cf0 \strokec4 )\}
\f1 \cf8 \strokec8 \'8c\'c2
\f0 \cf0 \strokec4 )\cb1 \
\cb3                             </h4>\cb1 \
\cb3                             <ul className=\cf7 \strokec7 "mt-2 space-y-1"\cf0 \strokec4 >\cb1 \
\cb3                                 \{\cf6 \strokec6 Object\cf0 \strokec4 .values(groupedAndMergedHistory[month]) \cf2 \strokec2 // Convert object values to array\cf0 \cb1 \strokec4 \
\cb3                                     .sort((a, b) => \cf5 \strokec5 new\cf0 \strokec4  \cf6 \strokec6 Date\cf0 \strokec4 (b.latestDate) - \cf5 \strokec5 new\cf0 \strokec4  \cf6 \strokec6 Date\cf0 \strokec4 (a.latestDate)) \cf2 \strokec2 // Sort merged items by latest date\cf0 \cb1 \strokec4 \
\cb3                                     .map(memo => (\cb1 \
\cb3                                     <li key=\{memo.text\} className=\cf7 \strokec7 "flex justify-between items-center bg-gray-50 p-2 rounded-md"\cf0 \strokec4 >\cb1 \
\cb3                                         <span className=\cf7 \strokec7 "text-gray-700 text-sm"\cf0 \strokec4 >\{memo.text\}</span>\cb1 \
\cb3                                         <span className=\cf7 \strokec7 "text-gray-700 text-sm font-medium"\cf0 \strokec4 >\cb1 \
\cb3                                             \{memo.count\}
\f1 \cf8 \strokec8 \'8c\'c2
\f0 \cf0 \cb1 \strokec4 \
\cb3                                         </span>\cb1 \
\cb3                                     </li>\cb1 \
\cb3                                 ))\}\cb1 \
\cb3                             </ul>\cb1 \
\cb3                         </div>\cb1 \
\cb3                     ))\}\cb1 \
\cb3                 </div>\cb1 \
\cb3             )\}\cb1 \
\cb3         </\cf6 \strokec6 Modal\cf0 \strokec4 >\cb1 \
\cb3     );\cb1 \
\cb3 \};\cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 // Main Application Component\cf0 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf5 \cb3 \strokec5 function\cf0 \strokec4  \cf6 \strokec6 App\cf0 \strokec4 () \{\cb1 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3     \cf5 \strokec5 const\cf0 \strokec4  \{ db, userId, isAuthReady \} = useFirebase();\cb1 \
\
\cb3     \cf2 \strokec2 // Tab related States\cf0 \cb1 \strokec4 \
\cb3     \cf5 \strokec5 const\cf0 \strokec4  [tabs, setTabs] = useState([]);\cb1 \
\cb3     \cf5 \strokec5 const\cf0 \strokec4  [activeTabId, setActiveTabId] = useState(\cf5 \strokec5 null\cf0 \strokec4 ); \cf2 \strokec2 // ID of the currently active tab\cf0 \cb1 \strokec4 \
\cb3     \cf5 \strokec5 const\cf0 \strokec4  [tabSettingsModalOpen, setTabSettingsModalOpen] = useState(\cf5 \strokec5 false\cf0 \strokec4 );\cb1 \
\
\cb3     \cf2 \strokec2 // Input area related States\cf0 \cb1 \strokec4 \
\cb3     \cf5 \strokec5 const\cf0 \strokec4  [inputAreas, setInputAreas] = useState([]); \cf2 \strokec2 // Input areas for the current active tab\cf0 \cb1 \strokec4 \
\cb3     \cf5 \strokec5 const\cf0 \strokec4  [historyItems, setHistoryItems] = useState([]); \cf2 \strokec2 // History of completed items\cf0 \cb1 \strokec4 \
\cb3     \cf5 \strokec5 const\cf0 \strokec4  [historyModalOpen, setHistoryModalOpen] = useState(\cf5 \strokec5 false\cf0 \strokec4 );\cb1 \
\
\cb3     \cf2 \strokec2 // Firestore listener for tabs\cf0 \cb1 \strokec4 \
\cb3     useEffect(() => \{\cb1 \
\cb3         \cf5 \strokec5 if\cf0 \strokec4  (!db || !isAuthReady || !userId) \cf5 \strokec5 return\cf0 \strokec4 ;\cb1 \
\
\cb3         \cf5 \strokec5 const\cf0 \strokec4  tabsCollectionRef = collection(db, \cf7 \strokec7 `artifacts/\cf0 \strokec4 $\{userId\}\cf7 \strokec7 /public/data/tabs`\cf0 \strokec4 );\cb1 \
\cb3         \cf5 \strokec5 const\cf0 \strokec4  unsubscribeTabs = onSnapshot(query(tabsCollectionRef), (snapshot) => \{\cb1 \
\cb3             \cf5 \strokec5 const\cf0 \strokec4  fetchedTabs = snapshot.docs.map(doc => (\{ id: doc.id, ...doc.data() \}));\cb1 \
\cb3             \cf2 \strokec2 // Sort by position\cf0 \cb1 \strokec4 \
\cb3             fetchedTabs.sort((a, b) => a.position - b.position);\cb1 \
\cb3             setTabs(fetchedTabs);\cb1 \
\
\cb3             \cf2 \strokec2 // Activate the first tab on initial load or if no active tab\cf0 \cb1 \strokec4 \
\cb3             \cf5 \strokec5 if\cf0 \strokec4  (!activeTabId && fetchedTabs.length > \cf9 \strokec9 0\cf0 \strokec4 ) \{\cb1 \
\cb3                 setActiveTabId(fetchedTabs[\cf9 \strokec9 0\cf0 \strokec4 ].id);\cb1 \
\cb3             \} \cf5 \strokec5 else\cf0 \strokec4  \cf5 \strokec5 if\cf0 \strokec4  (activeTabId && !fetchedTabs.some(tab => tab.id === activeTabId)) \{\cb1 \
\cb3                 \cf2 \strokec2 // If the active tab was deleted, switch to the first remaining tab\cf0 \cb1 \strokec4 \
\cb3                 \cf5 \strokec5 if\cf0 \strokec4  (fetchedTabs.length > \cf9 \strokec9 0\cf0 \strokec4 ) \{\cb1 \
\cb3                     setActiveTabId(fetchedTabs[\cf9 \strokec9 0\cf0 \strokec4 ].id);\cb1 \
\cb3                 \} \cf5 \strokec5 else\cf0 \strokec4  \{\cb1 \
\cb3                     setActiveTabId(\cf5 \strokec5 null\cf0 \strokec4 );\cb1 \
\cb3                 \}\cb1 \
\cb3             \}\cb1 \
\cb3         \}, (error) => \{\cb1 \
\cb3             console.error(\cf7 \strokec7 "Error fetching tabs:"\cf0 \strokec4 , error);\cb1 \
\cb3         \});\cb1 \
\
\cb3         \cf5 \strokec5 const\cf0 \strokec4  historyCollectionRef = collection(db, \cf7 \strokec7 `artifacts/\cf0 \strokec4 $\{userId\}\cf7 \strokec7 /public/data/historyItems`\cf0 \strokec4 );\cb1 \
\cb3         \cf5 \strokec5 const\cf0 \strokec4  unsubscribeHistory = onSnapshot(query(historyCollectionRef), (snapshot) => \{\cb1 \
\cb3             \cf5 \strokec5 const\cf0 \strokec4  fetchedHistory = snapshot.docs.map(doc => (\{ id: doc.id, ...doc.data() \}));\cb1 \
\cb3             \cf2 \strokec2 // Sort by date (newest first)\cf0 \cb1 \strokec4 \
\cb3             fetchedHistory.sort((a, b) => \cf5 \strokec5 new\cf0 \strokec4  \cf6 \strokec6 Date\cf0 \strokec4 (b.checkedDate) - \cf5 \strokec5 new\cf0 \strokec4  \cf6 \strokec6 Date\cf0 \strokec4 (a.checkedDate));\cb1 \
\cb3             setHistoryItems(fetchedHistory);\cb1 \
\cb3         \}, (error) => \{\cb1 \
\cb3             console.error(\cf7 \strokec7 "Error fetching history items:"\cf0 \strokec4 , error);\cb1 \
\cb3         \});\cb1 \
\
\cb3         \cf5 \strokec5 return\cf0 \strokec4  () => \{\cb1 \
\cb3             unsubscribeTabs();\cb1 \
\cb3             unsubscribeHistory();\cb1 \
\cb3         \};\cb1 \
\cb3     \}, [db, userId, isAuthReady, activeTabId]);\cb1 \
\
\
\cb3     \cf2 \strokec2 // Firestore listener for input areas of the active tab\cf0 \cb1 \strokec4 \
\cb3     useEffect(() => \{\cb1 \
\cb3         \cf5 \strokec5 if\cf0 \strokec4  (!db || !isAuthReady || !activeTabId || !userId) \{\cb1 \
\cb3             setInputAreas([]); \cf2 \strokec2 // Clear if no active tab\cf0 \cb1 \strokec4 \
\cb3             \cf5 \strokec5 return\cf0 \strokec4 ;\cb1 \
\cb3         \}\cb1 \
\
\cb3         \cf5 \strokec5 const\cf0 \strokec4  inputAreasCollectionRef = collection(db, \cf7 \strokec7 `artifacts/\cf0 \strokec4 $\{userId\}\cf7 \strokec7 /public/data/inputAreas`\cf0 \strokec4 );\cb1 \
\cb3         \cf2 \strokec2 // Query only input areas associated with the current active tab\cf0 \cb1 \strokec4 \
\cb3         \cf5 \strokec5 const\cf0 \strokec4  q = query(inputAreasCollectionRef, where(\cf7 \strokec7 "tabId"\cf0 \strokec4 , \cf7 \strokec7 "=="\cf0 \strokec4 , activeTabId));\cb1 \
\
\cb3         \cf5 \strokec5 const\cf0 \strokec4  unsubscribeInputAreas = onSnapshot(q, (snapshot) => \{\cb1 \
\cb3             \cf5 \strokec5 const\cf0 \strokec4  fetchedInputAreas = snapshot.docs.map(doc => (\{ id: doc.id, ...doc.data() \}));\cb1 \
\cb3             \cf2 \strokec2 // Sort by position\cf0 \cb1 \strokec4 \
\cb3             fetchedInputAreas.sort((a, b) => a.position - b.position);\cb1 \
\cb3             setInputAreas(fetchedInputAreas);\cb1 \
\cb3         \}, (error) => \{\cb1 \
\cb3             console.error(\cf7 \strokec7 "Error fetching input areas:"\cf0 \strokec4 , error);\cb1 \
\cb3         \});\cb1 \
\
\cb3         \cf5 \strokec5 return\cf0 \strokec4  () => unsubscribeInputAreas();\cb1 \
\cb3     \}, [db, userId, isAuthReady, activeTabId]);\cb1 \
\
\
\cb3     \cf2 \strokec2 // Add a tab\cf0 \cb1 \strokec4 \
\cb3     \cf5 \strokec5 const\cf0 \strokec4  handleAddTab = \cf5 \strokec5 async\cf0 \strokec4  (name) => \{\cb1 \
\cb3         \cf5 \strokec5 if\cf0 \strokec4  (!db || !userId) \cf5 \strokec5 return\cf0 \strokec4 ;\cb1 \
\cb3         \cf5 \strokec5 try\cf0 \strokec4  \{\cb1 \
\cb3             \cf5 \strokec5 const\cf0 \strokec4  newTabRef = doc(collection(db, \cf7 \strokec7 `artifacts/\cf0 \strokec4 $\{userId\}\cf7 \strokec7 /public/data/tabs`\cf0 \strokec4 ));\cb1 \
\cb3             \cf5 \strokec5 const\cf0 \strokec4  newPosition = tabs.length > \cf9 \strokec9 0\cf0 \strokec4  ? \cf6 \strokec6 Math\cf0 \strokec4 .max(...tabs.map(t => t.position)) + \cf9 \strokec9 1\cf0 \strokec4  : \cf9 \strokec9 0\cf0 \strokec4 ;\cb1 \
\cb3             \cf5 \strokec5 await\cf0 \strokec4  setDoc(newTabRef, \{\cb1 \
\cb3                 name: name,\cb1 \
\cb3                 position: newPosition,\cb1 \
\cb3                 color: pastelColorMap[\cf9 \strokec9 0\cf0 \strokec4 ].tabBg, \cf2 \strokec2 // Default to the first pastel color\cf0 \cb1 \strokec4 \
\cb3                 createdAt: \cf5 \strokec5 new\cf0 \strokec4  \cf6 \strokec6 Date\cf0 \strokec4 ().toISOString()\cb1 \
\cb3             \});\cb1 \
\cb3             setActiveTabId(newTabRef.id); \cf2 \strokec2 // Activate the new tab\cf0 \cb1 \strokec4 \
\cb3             console.log(\cf7 \strokec7 "Tab added with ID: "\cf0 \strokec4 , newTabRef.id);\cb1 \
\cb3         \} \cf5 \strokec5 catch\cf0 \strokec4  (e) \{\cb1 \
\cb3             console.error(\cf7 \strokec7 "Error adding tab: "\cf0 \strokec4 , e);\cb1 \
\cb3         \}\cb1 \
\cb3     \};\cb1 \
\
\cb3     \cf2 \strokec2 // Update tab color\cf0 \cb1 \strokec4 \
\cb3     \cf5 \strokec5 const\cf0 \strokec4  handleUpdateTabColor = \cf5 \strokec5 async\cf0 \strokec4  (tabId, newColor) => \{\cb1 \
\cb3         \cf5 \strokec5 if\cf0 \strokec4  (!db || !userId) \cf5 \strokec5 return\cf0 \strokec4 ;\cb1 \
\cb3         \cf5 \strokec5 try\cf0 \strokec4  \{\cb1 \
\cb3             \cf5 \strokec5 await\cf0 \strokec4  updateDoc(doc(db, \cf7 \strokec7 `artifacts/\cf0 \strokec4 $\{userId\}\cf7 \strokec7 /public/data/tabs`\cf0 \strokec4 , tabId), \{ color: newColor \});\cb1 \
\cb3             console.log(\cf7 \strokec7 `Tab \cf0 \strokec4 $\{tabId\}\cf7 \strokec7  color updated to \cf0 \strokec4 $\{newColor\}\cf7 \strokec7 .`\cf0 \strokec4 );\cb1 \
\cb3         \} \cf5 \strokec5 catch\cf0 \strokec4  (e) \{\cb1 \
\cb3             console.error(\cf7 \strokec7 "Error updating tab color: "\cf0 \strokec4 , e);\cb1 \
\cb3         \}\cb1 \
\cb3     \};\cb1 \
\
\cb3     \cf2 \strokec2 // Delete a tab\cf0 \cb1 \strokec4 \
\cb3     \cf5 \strokec5 const\cf0 \strokec4  handleDeleteTab = \cf5 \strokec5 async\cf0 \strokec4  (tabIdToDelete) => \{\cb1 \
\cb3         \cf5 \strokec5 if\cf0 \strokec4  (!db || !userId) \cf5 \strokec5 return\cf0 \strokec4 ;\cb1 \
\cb3         \cf5 \strokec5 if\cf0 \strokec4  (tabs.length === \cf9 \strokec9 1\cf0 \strokec4 ) \{\cb1 \
\cb3             console.warn(\cf7 \strokec7 "
\f1 \'8d\'c5\'8c\'e3\'82\'cc\'83\'5e\'83\'75\'82\'cd\'8d\'ed\'8f\'9c\'82\'c5\'82\'ab\'82\'dc\'82\'b9\'82\'f1\'81\'42
\f0 "\cf0 \strokec4 );\cb1 \
\cb3             \cf5 \strokec5 return\cf0 \strokec4 ;\cb1 \
\cb3         \}\cb1 \
\cb3         \cf5 \strokec5 try\cf0 \strokec4  \{\cb1 \
\cb3             \cf2 \strokec2 // Delete all input areas for the tab being deleted\cf0 \cb1 \strokec4 \
\cb3             \cf5 \strokec5 const\cf0 \strokec4  q = query(collection(db, \cf7 \strokec7 `artifacts/\cf0 \strokec4 $\{userId\}\cf7 \strokec7 /public/data/inputAreas`\cf0 \strokec4 ), where(\cf7 \strokec7 "tabId"\cf0 \strokec4 , \cf7 \strokec7 "=="\cf0 \strokec4 , tabIdToDelete));\cb1 \
\cb3             \cf5 \strokec5 const\cf0 \strokec4  snapshot = \cf5 \strokec5 await\cf0 \strokec4  getDocs(q);\cb1 \
\cb3             snapshot.forEach(\cf5 \strokec5 async\cf0 \strokec4  (docToDelete) => \{\cb1 \
\cb3                 \cf5 \strokec5 await\cf0 \strokec4  deleteDoc(doc(db, \cf7 \strokec7 `artifacts/\cf0 \strokec4 $\{userId\}\cf7 \strokec7 /public/data/inputAreas`\cf0 \strokec4 , docToDelete.id));\cb1 \
\cb3             \});\cb1 \
\
\cb3             \cf2 \strokec2 // Delete history items for the tab being deleted\cf0 \cb1 \strokec4 \
\cb3             \cf5 \strokec5 const\cf0 \strokec4  historyQ = query(collection(db, \cf7 \strokec7 `artifacts/\cf0 \strokec4 $\{userId\}\cf7 \strokec7 /public/data/historyItems`\cf0 \strokec4 ), where(\cf7 \strokec7 "tabId"\cf0 \strokec4 , \cf7 \strokec7 "=="\cf0 \strokec4 , tabIdToDelete));\cb1 \
\cb3             \cf5 \strokec5 const\cf0 \strokec4  historySnapshot = \cf5 \strokec5 await\cf0 \strokec4  getDocs(historyQ);\cb1 \
\cb3             historySnapshot.forEach(\cf5 \strokec5 async\cf0 \strokec4  (docToDelete) => \{\cb1 \
\cb3                 \cf5 \strokec5 await\cf0 \strokec4  deleteDoc(doc(db, \cf7 \strokec7 `artifacts/\cf0 \strokec4 $\{userId\}\cf7 \strokec7 /public/data/historyItems`\cf0 \strokec4 , docToDelete.id));\cb1 \
\cb3             \});\cb1 \
\
\
\cb3             \cf5 \strokec5 await\cf0 \strokec4  deleteDoc(doc(db, \cf7 \strokec7 `artifacts/\cf0 \strokec4 $\{userId\}\cf7 \strokec7 /public/data/tabs`\cf0 \strokec4 , tabIdToDelete));\cb1 \
\cb3             console.log(\cf7 \strokec7 "Tab, its input areas, and history items deleted successfully."\cf0 \strokec4 );\cb1 \
\
\cb3             \cf2 \strokec2 // If the deleted tab was active, switch to another tab\cf0 \cb1 \strokec4 \
\cb3             \cf5 \strokec5 if\cf0 \strokec4  (activeTabId === tabIdToDelete) \{\cb1 \
\cb3                 \cf5 \strokec5 const\cf0 \strokec4  remainingTabs = tabs.filter(tab => tab.id !== tabIdToDelete);\cb1 \
\cb3                 \cf5 \strokec5 if\cf0 \strokec4  (remainingTabs.length > \cf9 \strokec9 0\cf0 \strokec4 ) \{\cb1 \
\cb3                     setActiveTabId(remainingTabs[\cf9 \strokec9 0\cf0 \strokec4 ].id);\cb1 \
\cb3                 \} \cf5 \strokec5 else\cf0 \strokec4  \{\cb1 \
\cb3                     setActiveTabId(\cf5 \strokec5 null\cf0 \strokec4 );\cb1 \
\cb3                 \}\cb1 \
\cb3             \}\cb1 \
\cb3         \} \cf5 \strokec5 catch\cf0 \strokec4  (e) \{\cb1 \
\cb3             console.error(\cf7 \strokec7 "Error deleting tab: "\cf0 \strokec4 , e);\cb1 \
\cb3         \}\cb1 \
\cb3     \};\cb1 \
\
\cb3     \cf2 \strokec2 // Reorder tabs\cf0 \cb1 \strokec4 \
\cb3     \cf5 \strokec5 const\cf0 \strokec4  handleMoveTab = \cf5 \strokec5 async\cf0 \strokec4  (fromIndex, toIndex) => \{\cb1 \
\cb3         \cf5 \strokec5 if\cf0 \strokec4  (!db || !userId) \cf5 \strokec5 return\cf0 \strokec4 ;\cb1 \
\
\cb3         \cf5 \strokec5 const\cf0 \strokec4  newTabs = [...tabs];\cb1 \
\cb3         \cf5 \strokec5 const\cf0 \strokec4  [movedTab] = newTabs.splice(fromIndex, \cf9 \strokec9 1\cf0 \strokec4 );\cb1 \
\cb3         newTabs.splice(toIndex, \cf9 \strokec9 0\cf0 \strokec4 , movedTab);\cb1 \
\
\cb3         \cf2 \strokec2 // Calculate new positions and update Firestore\cf0 \cb1 \strokec4 \
\cb3         \cf5 \strokec5 const\cf0 \strokec4  batch = db.batch();\cb1 \
\cb3         newTabs.forEach((tab, index) => \{\cb1 \
\cb3             \cf5 \strokec5 const\cf0 \strokec4  tabRef = doc(db, \cf7 \strokec7 `artifacts/\cf0 \strokec4 $\{userId\}\cf7 \strokec7 /public/data/tabs`\cf0 \strokec4 , tab.id);\cb1 \
\cb3             batch.update(tabRef, \{ position: index \});\cb1 \
\cb3         \});\cb1 \
\
\cb3         \cf5 \strokec5 try\cf0 \strokec4  \{\cb1 \
\cb3             \cf5 \strokec5 await\cf0 \strokec4  batch.commit();\cb1 \
\cb3             setTabs(newTabs); \cf2 \strokec2 // Update UI\cf0 \cb1 \strokec4 \
\cb3             console.log(\cf7 \strokec7 "Tabs reordered successfully."\cf0 \strokec4 );\cb1 \
\cb3         \} \cf5 \strokec5 catch\cf0 \strokec4  (e) \{\cb1 \
\cb3             console.error(\cf7 \strokec7 "Error reordering tabs: "\cf0 \strokec4 , e);\cb1 \
\cb3         \}\cb1 \
\cb3     \};\cb1 \
\
\
\cb3     \cf2 \strokec2 // Add an input area\cf0 \cb1 \strokec4 \
\cb3     \cf5 \strokec5 const\cf0 \strokec4  handleAddInputArea = \cf5 \strokec5 async\cf0 \strokec4  () => \{\cb1 \
\cb3         \cf5 \strokec5 if\cf0 \strokec4  (!db || !activeTabId || !userId) \cf5 \strokec5 return\cf0 \strokec4 ;\cb1 \
\cb3         \cf5 \strokec5 try\cf0 \strokec4  \{\cb1 \
\cb3             \cf5 \strokec5 const\cf0 \strokec4  newInputRef = doc(collection(db, \cf7 \strokec7 `artifacts/\cf0 \strokec4 $\{userId\}\cf7 \strokec7 /public/data/inputAreas`\cf0 \strokec4 ));\cb1 \
\cb3             \cf5 \strokec5 const\cf0 \strokec4  newPosition = inputAreas.length > \cf9 \strokec9 0\cf0 \strokec4  ? \cf6 \strokec6 Math\cf0 \strokec4 .max(...inputAreas.map(item => item.position)) + \cf9 \strokec9 1\cf0 \strokec4  : \cf9 \strokec9 0\cf0 \strokec4 ;\cb1 \
\cb3             \cf5 \strokec5 await\cf0 \strokec4  setDoc(newInputRef, \{\cb1 \
\cb3                 tabId: activeTabId,\cb1 \
\cb3                 text: \cf7 \strokec7 ''\cf0 \strokec4 ,\cb1 \
\cb3                 checked: \cf5 \strokec5 false\cf0 \strokec4 ,\cb1 \
\cb3                 position: newPosition,\cb1 \
\cb3                 createdAt: \cf5 \strokec5 new\cf0 \strokec4  \cf6 \strokec6 Date\cf0 \strokec4 ().toISOString()\cb1 \
\cb3             \});\cb1 \
\cb3             console.log(\cf7 \strokec7 "Input area added for tab: "\cf0 \strokec4 , activeTabId);\cb1 \
\cb3         \} \cf5 \strokec5 catch\cf0 \strokec4  (e) \{\cb1 \
\cb3             console.error(\cf7 \strokec7 "Error adding input area: "\cf0 \strokec4 , e);\cb1 \
\cb3         \}\cb1 \
\cb3     \};\cb1 \
\
\cb3     \cf2 \strokec2 // Update input area text\cf0 \cb1 \strokec4 \
\cb3     \cf5 \strokec5 const\cf0 \strokec4  handleUpdateInputAreaText = \cf5 \strokec5 async\cf0 \strokec4  (id, newText) => \{\cb1 \
\cb3         \cf5 \strokec5 if\cf0 \strokec4  (!db || !userId) \cf5 \strokec5 return\cf0 \strokec4 ;\cb1 \
\cb3         \cf5 \strokec5 try\cf0 \strokec4  \{\cb1 \
\cb3             \cf5 \strokec5 await\cf0 \strokec4  updateDoc(doc(db, \cf7 \strokec7 `artifacts/\cf0 \strokec4 $\{userId\}\cf7 \strokec7 /public/data/inputAreas`\cf0 \strokec4 , id), \{ text: newText \});\cb1 \
\cb3         \} \cf5 \strokec5 catch\cf0 \strokec4  (e) \{\cb1 \
\cb3             console.error(\cf7 \strokec7 "Error updating input area text: "\cf0 \strokec4 , e);\cb1 \
\cb3         \}\cb1 \
\cb3     \};\cb1 \
\
\cb3     \cf2 \strokec2 // Toggle input area check status (move to history)\cf0 \cb1 \strokec4 \
\cb3     \cf5 \strokec5 const\cf0 \strokec4  handleToggleCheck = \cf5 \strokec5 async\cf0 \strokec4  (id, currentText) => \{\cb1 \
\cb3         \cf5 \strokec5 if\cf0 \strokec4  (!db || !userId) \cf5 \strokec5 return\cf0 \strokec4 ;\cb1 \
\cb3         \cf5 \strokec5 try\cf0 \strokec4  \{\cb1 \
\cb3             \cf2 \strokec2 // Add to history\cf0 \cb1 \strokec4 \
\cb3             \cf5 \strokec5 await\cf0 \strokec4  addDoc(collection(db, \cf7 \strokec7 `artifacts/\cf0 \strokec4 $\{userId\}\cf7 \strokec7 /public/data/historyItems`\cf0 \strokec4 ), \{\cb1 \
\cb3                 originalInputAreaId: id,\cb1 \
\cb3                 tabId: activeTabId, \cf2 \strokec2 // Record which tab it came from\cf0 \cb1 \strokec4 \
\cb3                 text: currentText,\cb1 \
\cb3                 checkedDate: \cf5 \strokec5 new\cf0 \strokec4  \cf6 \strokec6 Date\cf0 \strokec4 ().toISOString(),\cb1 \
\cb3             \});\cb1 \
\cb3             \cf2 \strokec2 // Delete the original input area\cf0 \cb1 \strokec4 \
\cb3             \cf5 \strokec5 await\cf0 \strokec4  deleteDoc(doc(db, \cf7 \strokec7 `artifacts/\cf0 \strokec4 $\{userId\}\cf7 \strokec7 /public/data/inputAreas`\cf0 \strokec4 , id));\cb1 \
\cb3             console.log(\cf7 \strokec7 "Input area checked and moved to history."\cf0 \strokec4 );\cb1 \
\cb3         \} \cf5 \strokec5 catch\cf0 \strokec4  (e) \{\cb1 \
\cb3             console.error(\cf7 \strokec7 "Error toggling check/moving to history: "\cf0 \strokec4 , e);\cb1 \
\cb3         \}\cb1 \
\cb3     \};\cb1 \
\
\cb3     \cf2 \strokec2 // Delete an input area\cf0 \cb1 \strokec4 \
\cb3     \cf5 \strokec5 const\cf0 \strokec4  handleDeleteInputArea = \cf5 \strokec5 async\cf0 \strokec4  (id) => \{\cb1 \
\cb3         \cf5 \strokec5 if\cf0 \strokec4  (!db || !userId) \cf5 \strokec5 return\cf0 \strokec4 ;\cb1 \
\cb3         \cf5 \strokec5 try\cf0 \strokec4  \{\cb1 \
\cb3             \cf5 \strokec5 await\cf0 \strokec4  deleteDoc(doc(db, \cf7 \strokec7 `artifacts/\cf0 \strokec4 $\{userId\}\cf7 \strokec7 /public/data/inputAreas`\cf0 \strokec4 , id));\cb1 \
\cb3             console.log(\cf7 \strokec7 "Input area deleted."\cf0 \strokec4 );\cb1 \
\cb3         \} \cf5 \strokec5 catch\cf0 \strokec4  (e) \{\cb1 \
\cb3             console.error(\cf7 \strokec7 "Error deleting input area: "\cf0 \strokec4 , e);\cb1 \
\cb3         \}\cb1 \
\cb3     \};\cb1 \
\
\cb3     \cf2 \strokec2 // Determine the main content area background color\cf0 \cb1 \strokec4 \
\cb3     \cf5 \strokec5 const\cf0 \strokec4  activeTab = tabs.find(tab => tab.id === activeTabId);\cb1 \
\cb3     \cf5 \strokec5 const\cf0 \strokec4  mainBackgroundColor = activeTab ? pastelColorMap.find(c => c.tabBg === activeTab.color)?.mainBg || \cf7 \strokec7 'bg-gray-100'\cf0 \strokec4  : \cf7 \strokec7 'bg-gray-100'\cf0 \strokec4 ; \cf2 \strokec2 // Default light gray if no tab or color\cf0 \cb1 \strokec4 \
\
\cb3     \cf5 \strokec5 if\cf0 \strokec4  (!isAuthReady) \{\cb1 \
\cb3         \cf5 \strokec5 return\cf0 \strokec4  (\cb1 \
\cb3             <div className=\cf7 \strokec7 "flex justify-center items-center h-screen bg-gray-100"\cf0 \strokec4 >\cb1 \
\cb3                 <div className=\cf7 \strokec7 "text-gray-600 text-lg"\cf0 \strokec4 >
\f1 \cf8 \strokec8 \'93\'c7\'82\'dd\'8d\'9e\'82\'dd\'92\'86
\f0 \cf0 \strokec4 ...</div>\cb1 \
\cb3             </div>\cb1 \
\cb3         );\cb1 \
\cb3     \}\cb1 \
\
\cb3     \cf5 \strokec5 return\cf0 \strokec4  (\cb1 \
\cb3         <div className=\cf7 \strokec7 "min-h-screen flex flex-col font-inter"\cf0 \strokec4 > \{\cf2 \strokec2 /* Removed bg-gray-100 here */\cf0 \strokec4 \}\cb1 \
\cb3             \{\cf2 \strokec2 /* 
\f1 \'83\'77\'83\'62\'83\'5f\'81\'5b
\f0  */\cf0 \strokec4 \}\cb1 \
\cb3             <header className=\cf7 \strokec7 "bg-white shadow-md flex flex-col sticky top-0 z-10"\cf0 \strokec4 >\cb1 \
\cb3                 \{\cf2 \strokec2 /* 
\f1 \'8f\'e3\'95\'94\'83\'52\'83\'93\'83\'67\'83\'8d\'81\'5b\'83\'8b\'83\'6f\'81\'5b\'81\'69\'89\'45\'91\'a4\'82\'c9\'83\'41\'83\'43\'83\'52\'83\'93\'8c\'51\'81\'6a
\f0  */\cf0 \strokec4 \}\cb1 \
\cb3                 <div className=\cf7 \strokec7 "flex items-center p-4 justify-end"\cf0 \strokec4 > \{\cf2 \strokec2 /* justify-end
\f1 \'82\'c5\'89\'45\'8a\'f1\'82\'b9
\f0  */\cf0 \strokec4 \}\cb1 \
\cb3                     \{\cf2 \strokec2 /* 
\f1 \'89\'45\'91\'a4\'82\'cc\'83\'41\'83\'43\'83\'52\'83\'93\'8c\'51
\f0  */\cf0 \strokec4 \}\cb1 \
\cb3                     <div className=\cf7 \strokec7 "flex space-x-2"\cf0 \strokec4 >\cb1 \
\cb3                         <button\cb1 \
\cb3                             onClick=\{() => setHistoryModalOpen(\cf5 \strokec5 true\cf0 \strokec4 )\} \cf2 \strokec2 // 
\f1 \'97\'9a\'97\'f0\'83\'41\'83\'43\'83\'52\'83\'93\'82\'f0\'8d\'b6\'82\'c9
\f0 \cf0 \cb1 \strokec4 \
\cb3                             className=\cf7 \strokec7 "p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-200 shadow-sm"\cf0 \cb1 \strokec4 \
\cb3                             aria-label=\cf7 \strokec7 "
\f1 \'97\'9a\'97\'f0\'88\'ea\'97\'97
\f0 "\cf0 \cb1 \strokec4 \
\cb3                         >\cb1 \
\cb3                             <svg className=\cf7 \strokec7 "w-6 h-6"\cf0 \strokec4  fill=\cf7 \strokec7 "none"\cf0 \strokec4  stroke=\cf7 \strokec7 "currentColor"\cf0 \strokec4  viewBox=\cf7 \strokec7 "0 0 24 24"\cf0 \strokec4  xmlns=\cf7 \strokec7 "http://www.w3.org/2000/svg"\cf0 \strokec4 ><path strokeLinecap=\cf7 \strokec7 "round"\cf0 \strokec4  strokeLinejoin=\cf7 \strokec7 "round"\cf0 \strokec4  strokeWidth=\cf7 \strokec7 "2"\cf0 \strokec4  d=\cf7 \strokec7 "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"\cf0 \strokec4 ></path></svg>\cb1 \
\cb3                         </button>\cb1 \
\cb3                         <button\cb1 \
\cb3                             onClick=\{() => setTabSettingsModalOpen(\cf5 \strokec5 true\cf0 \strokec4 )\} \cf2 \strokec2 // 
\f1 \'8e\'95\'8e\'d4\'83\'41\'83\'43\'83\'52\'83\'93\'82\'f0\'89\'45\'82\'c9
\f0 \cf0 \cb1 \strokec4 \
\cb3                             className=\cf7 \strokec7 "p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-200 shadow-sm"\cf0 \cb1 \strokec4 \
\cb3                             aria-label=\cf7 \strokec7 "
\f1 \'83\'5e\'83\'75\'90\'dd\'92\'e8
\f0 "\cf0 \cb1 \strokec4 \
\cb3                         >\cb1 \
\cb3                             <svg className=\cf7 \strokec7 "w-6 h-6"\cf0 \strokec4  fill=\cf7 \strokec7 "none"\cf0 \strokec4  stroke=\cf7 \strokec7 "currentColor"\cf0 \strokec4  viewBox=\cf7 \strokec7 "0 0 24 24"\cf0 \strokec4  xmlns=\cf7 \strokec7 "http://www.w3.org/2000/svg"\cf0 \strokec4 ><path strokeLinecap=\cf7 \strokec7 "round"\cf0 \strokec4  strokeLinejoin=\cf7 \strokec7 "round"\cf0 \strokec4  strokeWidth=\cf7 \strokec7 "2"\cf0 \strokec4  d=\cf7 \strokec7 "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"\cf0 \strokec4 ></path><path strokeLinecap=\cf7 \strokec7 "round"\cf0 \strokec4  strokeLinejoin=\cf7 \strokec7 "round"\cf0 \strokec4  strokeWidth=\cf7 \strokec7 "2"\cf0 \strokec4  d=\cf7 \strokec7 "M15 12a3 3 0 11-6 0 3 3 0 016 0z"\cf0 \strokec4 ></path></svg>\cb1 \
\cb3                         </button>\cb1 \
\cb3                     </div>\cb1 \
\cb3                 </div>\cb1 \
\
\cb3                 \{\cf2 \strokec2 /* 
\f1 \'83\'5e\'83\'75\'83\'6f\'81\'5b\'81\'69\'83\'5e\'83\'75\'82\'cc\'82\'dd\'81\'6a
\f0  */\cf0 \strokec4 \}\cb1 \
\cb3                 <div className=\cf7 \strokec7 "flex overflow-x-auto whitespace-nowrap scrollbar-hide w-full border-b border-gray-200 px-4 pb-2"\cf0 \strokec4 >\cb1 \
\cb3                     \{tabs.map((tab) => \{\cb1 \
\cb3                         \cf5 \strokec5 return\cf0 \strokec4  (\cb1 \
\cb3                             <button\cb1 \
\cb3                                 key=\{tab.id\}\cb1 \
\cb3                                 onClick=\{() => setActiveTabId(tab.id)\}\cb1 \
\cb3                                 className=\{\cf7 \strokec7 `flex-shrink-0 px-3 py-2 text-sm font-medium transition-colors duration-200 relative pb-2 \cf0 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf7 \cb3 \strokec7                                     \cf0 \strokec4 $\{activeTabId === tab.id\cb1 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3                                         ? \cf7 \strokec7 `\cf0 \strokec4 $\{tab.color || pastelColorMap[\cf9 \strokec9 0\cf0 \strokec4 ].tabBg\}\cf7 \strokec7  text-white font-semibold rounded-t-md`\cf0 \strokec4  \cf2 \strokec2 // 
\f1 \'83\'41\'83\'4e\'83\'65\'83\'42\'83\'75\'8e\'9e\'82\'cd\'90\'dd\'92\'e8\'90\'46\'94\'77\'8c\'69\'82\'c6\'94\'92\'95\'b6\'8e\'9a
\f0 \cf0 \cb1 \strokec4 \
\cb3                                         : \cf7 \strokec7 'text-gray-700 hover:bg-gray-100 rounded-t-md'\cf0 \strokec4  \cf2 \strokec2 // 
\f1 \'94\'f1\'83\'41\'83\'4e\'83\'65\'83\'42\'83\'75\'8e\'9e\'82\'cd\'83\'7a\'83\'6f\'81\'5b\'8c\'f8\'89\'ca
\f0 \cf0 \cb1 \strokec4 \
\cb3                                     \}\cb1 \
\pard\pardeftab720\partightenfactor0
\cf7 \cb3 \strokec7                                 `\cf0 \strokec4 \}\cb1 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3                             >\cb1 \
\cb3                                 \{tab.name\}\cb1 \
\cb3                                 \{activeTabId === tab.id && (\cb1 \
\cb3                                     <span className=\{\cf7 \strokec7 `absolute bottom-0 left-0 w-full h-0.5 \cf0 \strokec4 $\{tab.color || pastelColorMap[\cf9 \strokec9 0\cf0 \strokec4 ].tabBg\}\cf7 \strokec7  rounded-full`\cf0 \strokec4 \}></span>\cb1 \
\cb3                                 )\}\cb1 \
\cb3                             </button>\cb1 \
\cb3                         );\cb1 \
\cb3                     \})\}\cb1 \
\cb3                 </div>\cb1 \
\cb3             </header>\cb1 \
\
\cb3             \{\cf2 \strokec2 /* 
\f1 \'83\'81\'83\'43\'83\'93\'83\'52\'83\'93\'83\'65\'83\'93\'83\'63\'83\'47\'83\'8a\'83\'41
\f0  */\cf0 \strokec4 \}\cb1 \
\cb3             <main className=\{\cf7 \strokec7 `flex-grow p-4 overflow-y-auto relative \cf0 \strokec4 $\{mainBackgroundColor\}\cf7 \strokec7 `\cf0 \strokec4 \}> \{\cf2 \strokec2 /* 
\f1 \'93\'ae\'93\'49\'82\'c9\'94\'77\'8c\'69\'90\'46\'82\'f0\'93\'4b\'97\'70
\f0  */\cf0 \strokec4 \}\cb1 \
\cb3                 <div className=\cf7 \strokec7 "max-w-xl mx-auto space-y-4"\cf0 \strokec4 >\cb1 \
\cb3                     \{inputAreas.length === \cf9 \strokec9 0\cf0 \strokec4  && (\cb1 \
\cb3                         <p className=\cf7 \strokec7 "text-center text-gray-500 text-lg mt-10"\cf0 \strokec4 >\cb1 \
\cb3                             \{activeTabId ? \cf7 \strokec7 "
\f1 \'82\'b1\'82\'cc\'83\'5e\'83\'75\'82\'c9\'82\'cd\'93\'fc\'97\'cd\'83\'47\'83\'8a\'83\'41\'82\'aa\'82\'a0\'82\'e8\'82\'dc\'82\'b9\'82\'f1\'81\'42\'89\'ba\'82\'cc
\f0  + 
\f1 \'83\'7b\'83\'5e\'83\'93\'82\'c5\'92\'c7\'89\'c1\'82\'b5\'82\'c4\'82\'ad\'82\'be\'82\'b3\'82\'a2\'81\'42
\f0 "\cf0 \strokec4  : \cf7 \strokec7 "
\f1 \'83\'5e\'83\'75\'82\'f0\'91\'49\'91\'f0\'82\'b7\'82\'e9\'82\'a9\'81\'41\'83\'5e\'83\'75\'90\'dd\'92\'e8\'82\'c5\'90\'56\'82\'b5\'82\'a2\'83\'5e\'83\'75\'82\'f0\'8d\'ec\'90\'ac\'82\'b5\'82\'c4\'82\'ad\'82\'be\'82\'b3\'82\'a2\'81\'42
\f0 "\cf0 \strokec4 \}\cb1 \
\cb3                         </p>\cb1 \
\cb3                     )\}\cb1 \
\cb3                     \{inputAreas.map((item) => (\cb1 \
\cb3                         <div key=\{item.id\} className=\cf7 \strokec7 "flex items-center bg-white p-3 rounded-lg shadow-sm border border-gray-200"\cf0 \strokec4 >\cb1 \
\cb3                             <input\cb1 \
\cb3                                 type=\cf7 \strokec7 "checkbox"\cf0 \cb1 \strokec4 \
\cb3                                 checked=\{item.checked\}\cb1 \
\cb3                                 onChange=\{() => handleToggleCheck(item.id, item.text)\}\cb1 \
\cb3                                 className=\cf7 \strokec7 "form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 mr-3 cursor-pointer"\cf0 \cb1 \strokec4 \
\cb3                             />\cb1 \
\cb3                             <input\cb1 \
\cb3                                 type=\cf7 \strokec7 "text"\cf0 \cb1 \strokec4 \
\cb3                                 value=\{item.text\}\cb1 \
\cb3                                 onChange=\{(e) => handleUpdateInputAreaText(item.id, e.target.value)\}\cb1 \
\cb3                                 className=\cf7 \strokec7 "flex-grow px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 text-gray-800"\cf0 \cb1 \strokec4 \
\cb3                                 placeholder=\cf7 \strokec7 "
\f1 \'82\'b1\'82\'b1\'82\'c9\'93\'fc\'97\'cd\'82\'b5\'82\'c4\'82\'ad\'82\'be\'82\'b3\'82\'a2
\f0 ..."\cf0 \cb1 \strokec4 \
\cb3                             />\cb1 \
\cb3                             <button\cb1 \
\cb3                                 onClick=\{() => handleDeleteInputArea(item.id)\}\cb1 \
\cb3                                 className=\cf7 \strokec7 "ml-3 p-2 text-gray-400 hover:text-red-500 transition duration-200 rounded-full hover:bg-red-100"\cf0 \cb1 \strokec4 \
\cb3                                 aria-label=\cf7 \strokec7 "
\f1 \'93\'fc\'97\'cd\'83\'47\'83\'8a\'83\'41\'82\'f0\'8d\'ed\'8f\'9c
\f0 "\cf0 \cb1 \strokec4 \
\cb3                             >\cb1 \
\cb3                                 <svg className=\cf7 \strokec7 "w-5 h-5"\cf0 \strokec4  fill=\cf7 \strokec7 "none"\cf0 \strokec4  stroke=\cf7 \strokec7 "currentColor"\cf0 \strokec4  viewBox=\cf7 \strokec7 "0 0 24 24"\cf0 \strokec4  xmlns=\cf7 \strokec7 "http://www.w3.org/2000/svg"\cf0 \strokec4 ><path strokeLinecap=\cf7 \strokec7 "round"\cf0 \strokec4  strokeLinejoin=\cf7 \strokec7 "round"\cf0 \strokec4  strokeWidth=\cf7 \strokec7 "2"\cf0 \strokec4  d=\cf7 \strokec7 "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"\cf0 \strokec4 ></path></svg>\cb1 \
\cb3                             </button>\cb1 \
\cb3                         </div>\cb1 \
\cb3                     ))\}\cb1 \
\cb3                     \{activeTabId && (\cb1 \
\cb3                         <div className=\cf7 \strokec7 "fixed bottom-4 right-8 z-20"\cf0 \strokec4 > \{\cf2 \strokec2 /* right-8
\f1 \'82\'c9\'95\'cf\'8d\'58
\f0  */\cf0 \strokec4 \}\cb1 \
\cb3                             <button\cb1 \
\cb3                                 onClick=\{handleAddInputArea\}\cb1 \
\cb3                                 className=\cf7 \strokec7 "p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"\cf0 \cb1 \strokec4 \
\cb3                                 aria-label=\cf7 \strokec7 "
\f1 \'93\'fc\'97\'cd\'83\'47\'83\'8a\'83\'41\'82\'f0\'92\'c7\'89\'c1
\f0 "\cf0 \cb1 \strokec4 \
\cb3                             >\cb1 \
\cb3                                 <svg className=\cf7 \strokec7 "w-8 h-8"\cf0 \strokec4  fill=\cf7 \strokec7 "none"\cf0 \strokec4  stroke=\cf7 \strokec7 "currentColor"\cf0 \strokec4  viewBox=\cf7 \strokec7 "0 0 24 24"\cf0 \strokec4  xmlns=\cf7 \strokec7 "http://www.w3.org/2000/svg"\cf0 \strokec4 ><path strokeLinecap=\cf7 \strokec7 "round"\cf0 \strokec4  strokeLinejoin=\cf7 \strokec7 "round"\cf0 \strokec4  strokeWidth=\cf7 \strokec7 "2"\cf0 \strokec4  d=\cf7 \strokec7 "M12 6v6m0 0v6m0-6h6m-6 0H6"\cf0 \strokec4 ></path></svg>\cb1 \
\cb3                             </button>\cb1 \
\cb3                         </div>\cb1 \
\cb3                     )\}\cb1 \
\cb3                 </div>\cb1 \
\cb3             </main>\cb1 \
\
\cb3             \{\cf2 \strokec2 /* 
\f1 \'83\'5e\'83\'75\'90\'dd\'92\'e8\'83\'82\'81\'5b\'83\'5f\'83\'8b
\f0  */\cf0 \strokec4 \}\cb1 \
\cb3             <\cf6 \strokec6 TabSettingsModal\cf0 \cb1 \strokec4 \
\cb3                 isOpen=\{tabSettingsModalOpen\}\cb1 \
\cb3                 onClose=\{() => setTabSettingsModalOpen(\cf5 \strokec5 false\cf0 \strokec4 )\}\cb1 \
\cb3                 tabs=\{tabs\}\cb1 \
\cb3                 onAddTab=\{handleAddTab\}\cb1 \
\cb3                 onDeleteTab=\{handleDeleteTab\}\cb1 \
\cb3                 onMoveTab=\{handleMoveTab\}\cb1 \
\cb3                 onUpdateTabColor=\{handleUpdateTabColor\}\cb1 \
\cb3             />\cb1 \
\
\cb3             \{\cf2 \strokec2 /* 
\f1 \'97\'9a\'97\'f0\'83\'82\'81\'5b\'83\'5f\'83\'8b
\f0  */\cf0 \strokec4 \}\cb1 \
\cb3             <\cf6 \strokec6 HistoryModal\cf0 \cb1 \strokec4 \
\cb3                 isOpen=\{historyModalOpen\}\cb1 \
\cb3                 onClose=\{() => setHistoryModalOpen(\cf5 \strokec5 false\cf0 \strokec4 )\}\cb1 \
\cb3                 historyItems=\{historyItems\}\cb1 \
\cb3                 allTabs=\{tabs\}\cb1 \
\cb3                 initialActiveTabId=\{activeTabId\}\cb1 \
\cb3             />\cb1 \
\
\cb3             \{\cf2 \strokec2 /* 
\f1 \'83\'66\'83\'6f\'83\'62\'83\'4f\'8f\'ee\'95\'f1
\f0  (
\f1 \'8a\'4a\'94\'ad\'92\'86\'82\'cc\'82\'dd\'95\'5c\'8e\'a6
\f0 ) */\cf0 \strokec4 \}\cb1 \
\cb3             \{\cf2 \strokec2 /*\cf0 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2             <footer className="p-2 bg-gray-800 text-white text-xs text-center">\cf0 \cb1 \strokec4 \
\cf2 \cb3 \strokec2                 User ID: \{userId\}\cf0 \cb1 \strokec4 \
\cf2 \cb3 \strokec2             </footer>\cf0 \cb1 \strokec4 \
\cf2 \cb3 \strokec2             */\cf0 \strokec4 \}\cb1 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3         </div>\cb1 \
\cb3     );\cb1 \
\cb3 \}\cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 // App
\f1 \'83\'52\'83\'93\'83\'7c\'81\'5b\'83\'6c\'83\'93\'83\'67\'82\'f0
\f0 FirebaseProvider
\f1 \'82\'c5\'83\'89\'83\'62\'83\'76\'82\'b5\'82\'c4\'83\'47\'83\'4e\'83\'58\'83\'7c\'81\'5b\'83\'67
\f0 \cf0 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf5 \cb3 \strokec5 const\cf0 \strokec4  root = \cf6 \strokec6 ReactDOM\cf0 \strokec4 .createRoot(document.getElementById(\cf7 \strokec7 'root'\cf0 \strokec4 ));\cb1 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3 root.render(\cb1 \
\cb3     <\cf6 \strokec6 React\cf0 \strokec4 .\cf6 \strokec6 StrictMode\cf0 \strokec4 >\cb1 \
\cb3         <\cf6 \strokec6 FirebaseProvider\cf0 \strokec4 >\cb1 \
\cb3             <\cf6 \strokec6 App\cf0 \strokec4  />\cb1 \
\cb3         </\cf6 \strokec6 FirebaseProvider\cf0 \strokec4 >\cb1 \
\cb3     </\cf6 \strokec6 React\cf0 \strokec4 .\cf6 \strokec6 StrictMode\cf0 \strokec4 >\cb1 \
\cb3 );\cb1 \
\
}