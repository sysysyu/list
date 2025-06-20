// Function to convert Katakana to Hiragana
// カタカナをひらがなに変換する関数
function katakanaToHiragana(str) {
    return str.replace(/[\u30a1-\u30f6]/g, function(match) {
        return String.fromCharCode(match.charCodeAt(0) - 0x60);
    });
}

// Helper to generate a reverse map for canonical names
// 複数の表記を一つの標準的な名前にマッピングするためのヘルパー関数
const generateCanonicalMap = (sourceMap) => {
    const map = {};
    for (const canonical in sourceMap) {
        sourceMap[canonical].forEach(variant => {
            // すべてひらがな小文字に変換してマップに登録
            map[katakanaToHiragana(variant.toLowerCase())] = canonical;
        });
    }
    return map;
};

// Canonical names mapping for auto-categorization and history normalization
// 標準化された名前のマップ定義
const canonicalNamesMap = generateCanonicalMap({
    'しょうゆ': ['しょうゆ', 'ショウユ', '醤油'],
    'じゃがいも': ['じゃがいも', 'ジャガイモ', '馬鈴薯'],
    'たまねぎ': ['たまねぎ', 'タマネギ', '玉ねぎ'],
    'にんじん': ['にんじん', 'ニンジン', '人参'],
    'お茶': ['お茶', 'おちゃ', 'オチャ', '茶'],
    '牛乳': ['牛乳', 'ぎゅうにゅう', 'ギュウニュウ', 'ミルク'],
    'パン': ['パン', 'ぱん', '食パン'],
    'りんご': ['りんご', 'リンゴ', '林檎'],
    'ぶどう': ['ぶどう', 'ブドウ', '葡萄'],
    '牛肉': ['牛肉', 'ぎゅうにく', 'ギュウニク'],
    '豚肉': ['豚肉', 'ぶたにく', 'ブタニク'],
    '鶏肉': ['鶏肉', 'とりにく', 'トリニク'],
    '鮭': ['鮭', 'しゃけ', 'シャケ', 'サーモン'],
    'エビ': ['エビ', 'えび', '海老'],
    'タコ': ['タコ', 'たこ', '蛸'],
    'イカ': ['イカ', 'いか', '烏賊'],
    '魚': ['魚', 'さかな'],
    'ビール': ['ビール', 'びーる'],
    'ワイン': ['ワイン', 'わいん'],
    'コーヒー': ['コーヒー', 'こーひー'],
    '紅茶': ['紅茶', 'こうちゃ', 'コウチャ'],
    '卵': ['卵', 'たまご', 'タマゴ'],
    'チーズ': ['チーズ', 'ちーず'],
    'ヨーグルト': ['ヨーグルト', 'よーぐると'],
    '豆腐': ['豆腐', 'とうふ', 'トウフ'],
    '納豆': ['納豆', 'なっとう', 'ナットウ'],
    'ティッシュ': ['ティッシュ', 'てぃっしゅ', 'ちり紙'],
    'トイレットペーパー': ['トイレットペーパー', 'といれっとぺーぱー', '便所紙'],
    '洗剤': ['洗剤', 'せんざい'],
    'シャンプー': ['シャンプー', 'しゃんぷー'],
    'リンス': ['リンス', 'りんす'],
    '歯ブラシ': ['歯ブラシ', 'はぶらし'],
    '石鹸': ['石鹸', 'せっけん'],
    'ゴミ袋': ['ゴミ袋', 'ごみ袋', 'ごみぶくろ'],
    'ラップ': ['ラップ', 'らっぷ'],
    'アルミホイル': ['アルミホイル', 'あるみほいる'],
    '電池': ['電池', 'でんち'], 
    'マスク': ['マスク', 'ますく'],
    '風邪薬': ['風邪薬', 'かぜぐすり'],
    '絆創膏': ['絆創膏', 'ばんそうこう'],
    '胃薬': ['胃薬', 'いぐすり'],
    '鎮痛剤': ['鎮痛剤', 'ちんつうざい'],
    '消毒液': ['消毒液', 'しょうどくえき'],
    '本': ['本', 'ほん', '書籍'],
    '新聞': ['新聞', 'しんぶん'],
    '雑誌': ['雑誌', 'ざっし'],
    '切手': ['切手', 'きって'],
    'ハガキ': ['ハガキ', 'はがき', '葉書'],
    'ペン': ['ペン', 'ぺん', '筆記用具'],
    'ノート': ['ノート', 'のーと'],
    'ハサミ': ['ハサミ', 'はさみ', '鋏'],
    'のり': ['のり', '糊', '接着剤'],
    '消しゴム': ['消しゴム', 'けしごむ'],
    'テープ': ['テープ', 'てーぷ'], 
    '輪ゴム': ['輪ゴム', 'わごむ'],
    'クリップ': ['クリップ', 'くりっぷ'],
    '付箋': ['付箋', 'ふせん'],
    '電卓': ['電卓', 'でんたく'],
    '印鑑': ['印鑑', 'いんかん'],
    '朱肉': ['朱肉', 'しゅにく'],
    '名刺': ['名刺', 'めいし'],
    '封筒': ['封筒', 'ふうとう'],
    '便箋': ['便箋', 'びんせん'],
    '切手': ['切手', 'きって'],
    'ハガキ': ['ハガキ', 'はがき'],
    '筆ペン': ['筆ペン', 'ふでぺん'],
    '色鉛筆': ['色鉛筆', 'いろえんぴつ'],
    'クレヨン': ['クレヨン', 'くれよん'],
    '絵の具': ['絵の具', 'えのぐ'],
    '画用紙': ['画用紙', 'がようし'],
    '定規': ['定規', 'じょうぎ'],
    'コンパス': ['コンパス', 'こんぱす'],
    '分度器': ['分度器', 'ぶんどき'],
    '電球': ['電球', 'でんきゅう', '電灯'],
    '蛍光灯': ['蛍光灯', 'けいこうとう'],
    'LED電球': ['LED電球', 'えるいーでぃーでんきゅう'],
    '延長コード': ['延長コード', 'えんちょうこーど'],
    '変換プラグ': ['変換プラグ', 'へんかんぷらぐ'],
    '充電器': ['充電器', 'じゅうでんき'],
    'モバイルバッテリー': ['モバイルバッテリー', 'もばいるばってりー'],
    'イヤホン': ['イヤホン', 'いやほん'],
    'ヘッドホン': ['ヘッドホン', 'へっどほん'],
    'スピーカー': ['スピーカー', 'すぴーかー'],
    'USBケーブル': ['USBケーブル', 'ゆーえすびーけーぶる'],
    'HDMIケーブル': ['HDMIケーブル', 'えいちでぃーえむあいけーぶる'],
    'Wi-Fiルーター': ['Wi-Fiルーター', 'わいふぁいるーたー'],
    'ウェブカメラ': ['ウェブカメラ', 'うぇぶかめら'],
    'マイク': ['マイク', 'まいく'],
    'キーボード': ['キーボード', 'きーぼーど'],
    'マウス': ['マウス', 'まうす'],
    'マウスパッド': ['マウスパッド', 'まうすぱっど'],
    'プリンター': ['プリンター', 'ぷりんたー'],
    'スキャナー': ['スキャナー', 'すきゃなー'],
    'シュレッダー': ['シュレッダー', 'しゅれっだー'],
    'インクカートリッジ': ['インクカートリッジ', 'いんくかーとりっじ'],
    '用紙': ['用紙', 'ようし'],
    'CD': ['CD', 'しーでぃー'],
    'DVD': ['DVD', 'でぃーぶいでぃー'],
    'ブルーレイ': ['ブルーレイ', 'ぶるーれい'],
    'ゲームソフト': ['ゲームソフト', 'げーむそふと'],
    'ゲーム機': ['ゲーム機', 'げーむき'],
    'リモコン': ['リモコン', 'りもこん'],
    '懐中電灯': ['懐中電灯', 'かいちゅうでんとう'],
    '非常食': ['非常食', 'ひじょうしょく'],
    '水': ['水', 'みず'],
    '簡易トイレ': ['簡易トイレ', 'かんいといれ'],
    '寝袋': ['寝袋', 'ねぶくろ'],
    'ブランケット': ['ブランケット', 'ぶらんけっと'],
    '毛布': ['毛布', 'もうふ'],
    'ラジオ': ['ラジオ', 'らじお'],
    '軍手': ['軍手', 'ぐんて'],
    'レインコート': ['レインコート', 'れいんこーと'],
    'ヘルメット': ['ヘルメット', 'へるめっと'],
    '笛': ['笛', 'ふえ'],
    'マッチ': ['マッチ', 'まっち'],
    'ライター': ['ライター', 'らいたー'],
    'ろうそく': ['ろうそく', '蝋燭'],
    '着替え': ['着替え', 'きがえ'],
    '救急セット': ['救急セット', 'きゅうきゅうせっと'],
    '常備薬': ['常備薬', 'じょうびやく'],
    '現金': ['現金', 'げんきん'],
    '通帳': ['通帳', 'つうちょう'],
    '免許証': ['免許証', 'めんきょしょう'],
    '健康保険証': ['健康保険証', 'けんこうほけんしょう'],
    'パスポート': ['パスポート', 'ぱすぽーと'],
    '住民票': ['住民票', 'じゅうみんひょう'],
    '母子手帳': ['母子手帳', 'ぼしてちょう'],
    '薬手帳': ['薬手帳', 'くすりてちょう'],
    '歯磨き粉': ['歯磨き粉', 'はみがきこ'],
    'デンタルフロス': ['デンタルフロス', 'でんたるふろす'],
    'マウスウォッシュ': ['マウスウォッシュ', 'まうすうぉっしゅ'],
    '入れ歯洗浄剤': ['入れ歯洗浄剤', 'いればせんじょうざい'],
    'コンタクトレンズケア用品': ['コンタクトレンズケア用品', 'こんたくとれんずけあようひん'],
    'メガネ拭き': ['メガネ拭き', 'めがねふき'],
    '使い捨てコンタクトレンズ': ['使い捨てコンタクトレンズ', 'つかいすてこんたくとれんず'],
    '生理用品': ['生理用品', 'せいりようひん'],
    'おりものシート': ['おりものシート', 'おりものしーと'],
    'パンティライナー': ['パンティライナー', 'ぱんてぃらいなー'],
    'ナプキン': ['ナプキン', 'なぷきん'],
    'タンポン': ['タンポン', 'たんぽん'],
    'ナプキン': ['ナプキン', 'なぷきん'], // 重複ですが念のため
    'ハンドクリーム': ['ハンドクリーム', 'はんどくりーむ'],
    'ボディクリーム': ['ボディクリーム', 'ぼでぃくりーむ'],
    'ヘアオイル': ['ヘアオイル', 'へあおいる'],
    'ヘアミルク': ['ヘアミルク', 'へあみるく'],
    'ヘアワックス': ['ヘアワックス', 'へあわっくす'],
    'ヘアアイロン': ['ヘアアイロン', 'へああいろん'],
    'コテ': ['コテ', 'こて'],
    'くし': ['くし'],
    'ブラシ': ['ブラシ', 'ぶらし'],
    'ヘアゴム': ['ヘアゴム', 'へあごむ'],
    'ヘアピン': ['ヘアピン', 'へあぴん'],
    'カチューシャ': ['カチューシャ', 'かちゅーしゃ'],
    'ヘアバンド': ['ヘアバンド', 'へあばんど'],
    'シュシュ': ['シュシュ', 'しゅしゅ'],
    'バレッタ': ['バレッタ', 'ばれった'],
    'リボン': ['リボン', 'りぼん'], 
    'カミソリ': ['カミソリ', 'かみそり'],
    'シェービングフォーム': ['シェービングフォーム', 'しぇーびんぐふぉーむ'],
    '脱毛クリーム': ['脱毛クリーム', 'だつもうくりーむ'],
    '除毛クリーム': ['除毛クリーム', 'じょもうくりーむ'],
    '制汗剤': ['制汗剤', 'せいかんざい'],
    '消臭剤': ['消臭剤', 'しょうしゅうざい'],
    '芳香剤': ['芳香剤', 'ほうこうざい'],
    '殺虫剤': ['殺虫剤', 'さっちゅうざい'],
    '粘着クリーナー': ['粘着クリーナー', 'ねんちゃくくりーなー'],
    'ウェットシート': ['ウェットシート', 'うぇっとしーと'],
    '除菌シート': ['除菌シート', 'じょきんしーと'],
    'アルコールスプレー': ['アルコールスプレー', 'あるこーるすぷれー'],
    'ゴム手袋': ['ゴム手袋', 'ごむてぶくろ'],
    '洗車ブラシ': ['洗車ブラシ', 'せんしゃぶらし'],
    '洗車スポンジ': ['洗車スポンジ', 'せんしゃすぽんじ'],
    'バケツ': ['バケツ', 'ばけつ'],
    'ホース': ['ホース', 'ほーす'],
    '拭き上げクロス': ['拭き上げクロス', 'ふきあげくろす'],
    '窓拭き': ['窓拭き', 'まどふき'],
    '虫除け': ['虫除け', 'むしよけ'],
    '日傘': ['日傘', 'ひがさ'],
    '帽子': ['帽子', 'ぼうし'],
    'サングラス': ['サングラス', 'さんぐらす'],
    '扇子': ['扇子', 'せんす'],
    'うちわ': ['うちわ'],
    '冷感スプレー': ['冷感スプレー', 'れいかんすぷれー'],
    '保冷剤': ['保冷剤', 'ほれいざい'],
    '虫刺され薬': ['虫刺され薬', 'むしさされぐすり'],
    'かゆみ止め': ['かゆみ止め', 'かゆみどめ'],
    '蚊取り線香': ['蚊取り線香', 'かとりせんこう'],
    '電池式蚊取り': ['電池式蚊取り', 'でんちしきかとり'],
    '虫除けスプレー': ['虫除けスプレー', 'むしよけすぷれー'],
    '殺虫スプレー': ['殺虫スプレー', 'さっちゅうすぷれー'],
    'ゴキブリホイホイ': ['ゴキブリホイホイ', 'ごきぶりほいほい'],
    'ねずみ捕り': ['ねずみ捕り', 'ねずみとり'],
    '除草剤': ['除草剤', 'じょそうざい'],
    '肥料': ['肥料', 'ひりょう'],
    '園芸用手袋': ['園芸用手袋', 'えんげいようてぶくろ'],
    '剪定バサミ': ['剪定バサミ', 'せんていばさみ'],
    'ジョウロ': ['ジョウロ', 'じょうろ'],
    '植木鉢': ['植木鉢', 'うえきばち'],
    'プランター': ['プランター', 'ぷらんたー'],
    '土': ['土', 'つち'],
    '培養土': ['培養土', 'ばいようど'],
    '防虫ネット': ['防虫ネット', 'ぼうちゅうねっと'],
    '支柱': ['支柱', 'しちゅう'],
    '誘引テープ': ['誘引テープ', 'ゆういんてーぷ'],
    '結束バンド': ['結束バンド', 'けっそくばんど'], 
    '長靴': ['長靴', 'ながぐつ'],
    '作業着': ['作業着', 'さぎょうぎ'],
    '軽食': ['軽食', 'けいしょく'],
    '掃除機': ['掃除機', 'そうじき'],
    'フローリングワイパー': ['フローリングワイパー', 'ふろーりんぐわいぱー'],
    '粘着ローラー': ['粘着ローラー', 'ねんちゃくろーらー'],
    'ゴミ箱': ['ゴミ箱', 'ごみばこ'],
    '脱臭剤': ['脱臭剤', 'だっしゅうざい'],
    '消臭スプレー': ['消臭スプレー', 'しょうしゅうすぷれー'],
    '除湿剤': ['除湿剤', 'じょしつざい'],
    '防虫剤': ['防虫剤', 'ぼうちゅうざい'],
    '防カビ剤': ['防カビ剤', 'ぼうかびざい'],
    'カビ取り剤': ['カビ取り剤', 'かびとりざい'],
    '排水溝洗剤': ['排水溝洗剤', 'はいすいこうせんざい'],
    'トイレ用洗剤': ['トイレ用洗剤', 'といれようせんざい'],
    'お風呂用洗剤': ['お風呂用洗剤', 'おふろようせんざい'],
    '柔軟剤': ['柔軟剤', 'じゅうなんざい'],
    '漂白剤': ['漂白剤', 'ひょうはくざい'],
    'アイロン': ['アイロン', 'あいろん'],
    'アイロン台': ['アイロン台', 'あいろんだい'],
    '洗濯ネット': ['洗濯ネット', 'せんたくねっと'],
    'ハンガー': ['ハンガー', 'はんがー'],
    '洗濯バサミ': ['洗濯バサミ', 'せんたくばさみ'],
    '物干し竿': ['物干し竿', 'ものほしざお'],
    '物干しラック': ['物干しラック', 'ものほしらっく'],
    '洗面器': ['洗面器', 'せんめんき'],
    '風呂桶': ['風呂桶', 'ふろおけ'],
    'イス': ['イス', 'いす', '椅子'],
    'テーブル': ['テーブル', 'てーぶる'],
    'カーテン': ['カーテン', 'かーてん'],
    'ラグ': ['ラグ', 'らぐ'],
    'カーペット': ['カーペット', 'かーぺっと'],
    'クッション': ['クッション', 'くっしょん'],
    '枕': ['枕', 'まくら'],
    '布団': ['布団', 'ふとん'],
    'ベッドシーツ': ['ベッドシーツ', 'べっどしーつ'],
    'パジャマ': ['パジャマ', 'ぱじゃま'],
    '下着': ['下着', 'したぎ'],
    '靴下': ['靴下', 'くつした'],
    'Tシャツ': ['Tシャツ', 'てぃーしゃつ'],
    'ズボン': ['ズボン', 'ずぼん'],
    'スカート': ['スカート', 'すかーと'],
    'シャツ': ['シャツ', 'しゃつ'],
    'セーター': ['セーター', 'せーたー'],
    'ジャケット': ['ジャケット', 'じゃけっと'],
    'コート': ['コート', 'こーと'],
    'ワンピース': ['ワンピース', 'わんぴーす'],
    'スーツ': ['スーツ', 'すーつ'],
    'ネクタイ': ['ネクタイ', 'ねくたい'],
    'ベルト': ['ベルト', 'べると'],
    '手袋': ['手袋', 'てぶくろ'],
    'マフラー': ['マフラー', 'まふらー'],
    'ストール': ['ストール', 'すとーる'],
    '傘': ['傘', 'かさ'],
    'スニーカー': ['スニーカー', 'すにーかー'],
    '革靴': ['革靴', 'かわぐつ'],
    'サンダル': ['サンダル', 'さんだる'],
    'ブーツ': ['ブーツ', 'ぶーつ'],
    'バッグ': ['バッグ', 'ばっぐ'],
    'リュック': ['リュック', 'りゅっく'],
    '財布': ['財布', 'さいふ'],
    '時計': ['時計', 'とけい'],
    '眼鏡': ['眼鏡', 'めがね', 'メガネ'],
    'コンタクトレンズ': ['コンタクトレンズ', 'こんたくとれんず'],
    'アクセサリー': ['アクセサリー', 'あくせさりー'],
    'ネックレス': ['ネックレス', 'ねっくれす'],
    'ピアス': ['ピアス', 'ぴあす'],
    '指輪': ['指輪', 'ゆびわ'],
    'ブレスレット': ['ブレスレット', 'ぶれすれっと'],
    '香水': ['香水', 'こうすい'],
    '化粧品': ['化粧品', 'けしょうひん'],
    'メイク用品': ['メイク用品', 'めいくようひん'],
    'クリーム': ['クリーム', 'くりーむ'],
    'ファンデーション': ['ファンデーション', 'ふぁんでーしょん'],
    '化粧下地': ['化粧下地', 'けしょうしたじ'],
    'パウダー': ['パウダー', 'ぱうだー'],
    'チーク': ['チーク', 'ちーく'],
    'アイシャドウ': ['アイシャドウ', 'あいしゃどう'],
    'アイライナー': ['あいらいなー'],
    'マスカラ': ['マスカラ', 'ますから'],
    'リップ': ['リップ', 'りっぷ'], 
    '口紅': ['口紅', 'くちべに'],
    'グロス': ['グロス', 'ぐろす'],
    'アイブロウ': ['アイブロウ', 'あいぶろう'],
    '眉ペンシル': ['眉ペンシル', 'まゆぺんしる'],
    '眉マスカラ': ['眉マスカラ', 'まゆますから'],
    'ビューラー': ['ビューラー', 'びゅーらー'],
    'つけまつげ': ['つけまつげ'],
    'ネイル': ['ネイル', 'ねいる'],
    '除光液': ['除光液', 'じょこうえき'],
});

// Helper to get the canonical name for a given text
const getCanonicalName = (text) => {
    const normalizedText = katakanaToHiragana(text || '').toLowerCase(); // null/undefined対策と小文字化
    // canonicalNamesMapはvariant to canonicalなので、直接参照
    if (canonicalNamesMap[normalizedText]) {
        return canonicalNamesMap[normalizedText];
    }
    // マップに見つからなければ、正規化されたテキスト自体を返す
    return normalizedText;
};


document.addEventListener('DOMContentLoaded', () => {
    // Prevent zoom on button taps: Add touch-action to body and overflow-x hidden
    document.body.style.touchAction = 'manipulation';
    document.body.style.overflowX = 'hidden'; // Ensure no horizontal scroll for tab transitions

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

    // Makes the addInputAreaBtn perfectly round
    if (addInputAreaBtn) {
        addInputAreaBtn.style.borderRadius = '9999px'; // Makes it perfectly round
        addInputAreaBtn.style.width = '48px'; // Set a fixed width
        addInputAreaBtn.style.height = '48px'; // Set a fixed height to make it a circle
        addInputAreaBtn.style.display = 'flex';
        addInputAreaBtn.style.alignItems = 'center';
        addInputAreaBtn.style.justifyContent = 'center';
    }

    // タブとリストの背景色はCSSで固定されるため、JSのデフォルト色設定を削除または固定値に
    const initialDefaultTabColor = '#ffffff'; // 白
    const initialDefaultListColor = '#ffffff'; // リストアイテムの背景色（白に固定）

    let tabs = JSON.parse(localStorage.getItem('tabs')) || [{ id: 'default', name: 'デフォルト', tabBgColor: initialDefaultTabColor, listBgColor: initialDefaultListColor }];
    
    // Ensure `items` is initialized for all tabs from localStorage or default
    let items = JSON.parse(localStorage.getItem('items')) || {};
    tabs.forEach(tab => {
        if (!items[tab.id]) {
            items[tab.id] = [];
            console.log(`[INIT] items[${tab.id}] initialized as empty array.`);
        }
    });

    let activeTabId = localStorage.getItem('activeTabId') || tabs[0].id;
    console.log(`[INIT] Initial activeTabId: ${activeTabId}`);
    let history = JSON.parse(localStorage.getItem('history')) || [];

    // データ保存ヘルパー関数を早期に定義
    const saveTabs = () => {
        localStorage.setItem('tabs', JSON.stringify(tabs));
        console.log('[SAVE] Tabs saved.');
    };
    const saveItems = () => {
        localStorage.setItem('items', JSON.stringify(items));
        console.log('[SAVE] Items saved. Current items state:', JSON.parse(JSON.stringify(items)));
    };
    const saveHistory = () => {
        localStorage.setItem('history', JSON.stringify(history));
        console.log('[SAVE] History saved.');
    };
    const saveActiveTab = () => {
        localStorage.setItem('activeTabId', activeTabId);
        console.log(`[SAVE] Active tab ID saved: ${activeTabId}`);
    };

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

    // renderTabContents は、タブが切り替わったときや初期表示時に全体のDOMを再構築するために使用
    const renderTabContents = () => {
        console.log('--- renderTabContents called ---');
        console.log('Current activeTabId:', activeTabId);
        tabContentWrapper.innerHTML = ''; // Clear existing content
        
        // Explicitly set width of tabContentWrapper to span all tab contents
        tabContentWrapper.style.display = 'flex';
        tabContentWrapper.style.width = `${tabs.length * 100}vw`; // Set explicit total width
        tabContentWrapper.style.transition = 'transform 0.3s ease-in-out'; 
        tabContentWrapper.style.overflow = 'hidden'; 
        tabContentWrapper.style.position = 'relative';
        tabContentWrapper.style.height = 'auto'; // Will be set by updateTabContentDisplay

        tabs.forEach(tab => {
            console.log(`Building content for tab: ${tab.name} (ID: ${tab.id})`);
            const tabContentDiv = document.createElement('div');
            tabContentDiv.id = `tab-content-${tab.id}`;
            // Keep px-4 on tabContentDiv for overall list padding
            tabContentDiv.className = 'tab-content py-4 px-4 space-y-4 overflow-y-auto'; 
            tabContentDiv.style.width = '100vw'; // Each tab content is exactly one viewport width
            tabContentDiv.style.flexShrink = '0'; // Explicitly prevent shrinking
            tabContentDiv.style.flexGrow = '0'; // Explicitly prevent growing beyond 100vw
            

            if (!items[tab.id]) {
                items[tab.id] = [];
                console.warn(`items[${tab.id}] was undefined, initialized to empty array.`);
            }
            console.log(`Items for ${tab.name} (${tab.id}):`, JSON.parse(JSON.stringify(items[tab.id])));


            // Display message if no tasks
            if (items[tab.id].length === 0) {
                const noTaskMessage = document.createElement('div');
                noTaskMessage.className = 'text-center text-gray-500 py-8';
                noTaskMessage.textContent = '＋ボタンからリストを追加してください';
                tabContentDiv.appendChild(noTaskMessage);
                console.log(`Added 'no task message' to ${tab.name} (${tab.id})`);
            } else {
                let lastCategory = null;
                
                items[tab.id].forEach(item => {
                    const itemCategory = item.category || '未分類';

                    // カテゴリが変わった場合、または最初のアイテムの場合に新しいカテゴリサブタイトルを作成
                    // かつ、そのカテゴリのアイテムが少なくとも1つ存在する場合にのみ表示
                    if (itemCategory !== lastCategory) {
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
                    // アイテムをタブコンテンツに直接追加
                    tabContentDiv.appendChild(createInputArea(item));
                });
                console.log(`Added ${items[tab.id].length} items to ${tab.name} (${tab.id})`);
            }
            tabContentWrapper.appendChild(tabContentDiv);
        });
        updateTabContentDisplay();
        console.log('--- renderTabContents finished ---');
    };

    const updateTabContentDisplay = () => {
        const activeTabIndex = tabs.findIndex(tab => tab.id === activeTabId);
        if (activeTabIndex !== -1) {
            // Calculate translation based on 100vw units
            tabContentWrapper.style.transform = `translateX(-${activeTabIndex * 100}vw)`;
            const activeContentDiv = document.getElementById(`tab-content-${activeTabId}`);
            if (activeContentDiv) {
                // Adjust wrapper height to active tab content height
                tabContentWrapper.style.height = `${activeContentDiv.scrollHeight}px`;
                console.log(`[DISPLAY] Active tab ${activeTabId} scrollHeight: ${activeContentDiv.scrollHeight}px`);
            }
        }
    };

    const switchTab = (id) => {
        console.log(`[SWITCH] Attempting to switch from ${activeTabId} to ${id}`);
        // --- START: Save current tab's input values before switching ---
        const currentActiveContentDiv = document.getElementById(`tab-content-${activeTabId}`);
        if (currentActiveContentDiv) {
            console.log(`[SWITCH] Saving inputs from OLD activeTabId: ${activeTabId}`);
            const inputs = currentActiveContentDiv.querySelectorAll('input[type="text"]');
            inputs.forEach(inputElement => {
                const itemId = inputElement.closest('[id^="item-"]').id.replace('item-', '');
                const itemToUpdate = items[activeTabId].find(item => item.id === itemId);
                if (itemToUpdate && itemToUpdate.text !== inputElement.value) { // Only update if value changed
                    updateItemText(itemId, inputElement.value); 
                    console.log(`[SWITCH] Saved item ${itemId}: ${inputElement.value}`);
                }
            });
        }
        // --- END: Save current tab's input values ---

        activeTabId = id;
        saveActiveTab();
        console.log(`[SWITCH] Switched to NEW activeTabId: ${activeTabId}`);
        renderTabs();
        sortCurrentTabItems(); // タブ切り替え時にアイテムをソート
        renderTabContents(); // This will rebuild all tabs and show the correct one
        updateTabContentDisplay();
        window.scrollTo(0, 0); // Scroll to top of the page on tab switch
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
                // カテゴリが同じ場合はテキストでソート (オプション)
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
        // Removed px-4 from itemDiv to make it expand to full width within tabContentDiv's padding.
        // This is crucial for "画面いっぱい" and trash icon visibility.
        itemDiv.className = 'flex items-center w-full py-2 rounded-xl shadow-md transition-all duration-300 transform space-x-2';
        
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
        // Enterキーでの新規リスト追加と空リスト削除の機能
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // デフォルトのEnter動作を防止

                if (input.value.trim() === '') {
                    // 入力エリアが空の場合は削除
                    deleteInputArea(itemData.id);
                } else {
                    // 入力エリアにテキストがある場合は新しいリストアイテムを追加
                    addNewItem(); // Call the unified add function
                }
            }
        });
        // フォーカスアウト時にソートと再レンダリングを実行
        input.onblur = () => {
            // updateItemTextはoninputで呼ばれているため、onblurでは不要だが、
            // 空になった場合の削除処理は残しておく
            if (input.value.trim() === '') {
                deleteInputArea(itemData.id);
            }
            // Sort and render contents only on tab switch to avoid keyboard closing
            // sortCurrentTabItems();
            // renderTabContents();
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
                
                // Remove the item's DOM element directly
                if (itemElement && itemElement.parentNode) {
                    itemElement.parentNode.removeChild(itemElement);
                }

                // If the last item was deleted and now the tab is empty, show the message
                const currentTabContentDiv = document.getElementById(`tab-content-${activeTabId}`);
                if (items[activeTabId].length === 0 && currentTabContentDiv.querySelector('.no-task-message') === null) {
                    const noTaskMessage = document.createElement('div');
                    noTaskMessage.className = 'text-center text-gray-500 py-8 no-task-message';
                    noTaskMessage.textContent = '＋ボタンからリストを追加してください';
                    currentTabContentDiv.appendChild(noTaskMessage);
                } else if (items[activeTabId].length > 0 && currentTabContentDiv.querySelector('.no-task-message')) {
                     // If items are now present, remove the 'no task message'
                    const msg = currentTabContentDiv.querySelector('.no-task-message');
                    if (msg) msg.remove();
                }

                // Sorting will happen on tab switch, not on every check
                // sortCurrentTabItems(); 
                // renderTabContents(); 
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
            // No need to re-render for category change in this direct-update model
            // sortCurrentTabItems(); // Sorting is done on tab switch now
            // renderTabContents(); // Full re-render not needed here
        }
    };

    // 入力エリアのカテゴリを更新 (自動設定されるため、手動変更は考慮しない)
    // この関数は、現状の自動カテゴリ設定では直接使用されない
    const updateItemCategory = (id, newCategory) => {
        const currentItems = items[activeTabId];
        const item = currentItems.find(item => item.id === id);
        if (item) {
            item.category = newCategory;
            saveItems();
            // sortCurrentTabItems(); // Sorting is done on tab switch now
            // renderTabContents(); // Full re-render not needed here
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
            if (items[activeTabId]) { // Ensure the array exists
                 items[activeTabId] = items[activeTabId].filter(item => item.id !== id);
                 console.log(`[DELETE] Item ${id} removed. Remaining items for tab ${activeTabId}:`, JSON.parse(JSON.stringify(items[activeTabId])));
            } else {
                 console.warn(`[DELETE] Attempted to delete from non-existent items array for tab ${activeTabId}`);
            }
           
            saveItems();
            // Remove the item's DOM element directly
            if (itemElement && itemElement.parentNode) {
                itemElement.parentNode.removeChild(itemElement);
            }

            // If the last item was deleted and now the tab is empty, show the message
            const currentTabContentDiv = document.getElementById(`tab-content-${activeTabId}`);
            if (items[activeTabId].length === 0 && currentTabContentDiv.querySelector('.no-task-message') === null) {
                const noTaskMessage = document.createElement('div');
                noTaskMessage.className = 'text-center text-gray-500 py-8 no-task-message';
                noTaskMessage.textContent = '＋ボタンからリストを追加してください';
                currentTabContentDiv.appendChild(noTaskMessage);
            } else if (items[activeTabId].length > 0 && currentTabContentDiv.querySelector('.no-task-message')) {
                // If items are now present, remove the 'no task message'
                const msg = currentTabContentDiv.querySelector('.no-task-message');
                if (msg) msg.remove();
            }

            // sortCurrentTabItems(); // Sorting is done on tab switch now
            // renderTabContents(); // Full re-render not needed here
            updateTabContentDisplay();
        }, 500); // Wait for transition
    };

    // Unified function to add a new item, avoiding full re-render
    const addNewItem = () => {
        console.log('--- addNewItem called ---');
        console.log('Current activeTabId BEFORE new item ADDITION:', activeTabId); 

        // Force save current focused input before adding a new item
        const activeElement = document.activeElement;
        if (activeElement && activeElement.tagName === 'INPUT' && activeElement.type === 'text') {
            const closestItemDiv = activeElement.closest('[id^="item-"]');
            if (closestItemDiv) {
                const itemId = closestItemDiv.id.replace('item-', '');
                const itemToUpdate = items[activeTabId].find(item => item.id === itemId);
                if (itemToUpdate && itemToUpdate.text !== activeElement.value) { // Only update if value changed
                    updateItemText(itemId, activeElement.value); 
                    console.log(`[ADD] Forced save of active input ${itemId}: ${activeElement.value}`);
                }
            }
        }

        const newItem = {
            id: Date.now().toString(),
            text: '',
            checked: false,
            category: '未分類', 
            itemColor: duskyColors['オフホワイト']
        };
        
        if (!items[activeTabId]) {
            items[activeTabId] = [];
            console.warn(`[ADD] items[${activeTabId}] was undefined during add, initialized to empty array.`);
        }
        
        items[activeTabId].push(newItem);
        console.log(`[ADD] New item added to tab ${activeTabId}. Current items for this tab:`, JSON.parse(JSON.stringify(items[activeTabId])));

        saveItems(); // Save items immediately after adding to data model

        const currentTabContentDiv = document.getElementById(`tab-content-${activeTabId}`);
        if (currentTabContentDiv) {
            // If "no task message" is present, remove it
            const noTaskMessage = currentTabContentDiv.querySelector('.no-task-message');
            if (noTaskMessage) {
                noTaskMessage.remove();
            }

            const newItemDiv = createInputArea(newItem);
            currentTabContentDiv.appendChild(newItemDiv);
            console.log(`[ADD] Appended new item DOM element ${newItem.id} to tab ${activeTabId}.`);

            // Focus the newly added input
            // Using requestAnimationFrame for better timing with DOM updates
            requestAnimationFrame(() => {
                const newlyAddedInput = newItemDiv.querySelector('input[type="text"]');
                if (newlyAddedInput) {
                    newlyAddedInput.focus();
                    newlyAddedInput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    console.log(`[ADD] Focused on new input: ${newItem.id} in tab: ${activeTabId}`);
                } else {
                    console.error(`[ADD] Failed to find new input element for focusing: ${newItem.id} in tab: ${activeTabId}.`);
                }
                // Update wrapper height after appending new item
                updateTabContentDisplay();
            });
        } else {
            console.error(`[ADD] Could not find current tab content div for tab: ${activeTabId}`);
            // Fallback to full re-render if current tab content div is unexpectedly missing
            renderTabContents();
            updateTabContentDisplay();
        }
    };

    addInputAreaBtn.onclick = () => addNewItem();

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
                // ここでgetCanonicalNameを使用
                // Ensure getCanonicalName is accessible and correct
                const canonicalTaskText = getCanonicalName(item.text || '（テキストなし）');
                const category = item.category || '未分類';
                const key = `${category} - ${canonicalTaskText}`; // 正規化された名前をキーに使用
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
    let startY = 0; 
    let initialTranslateX = 0; // Renamed for clarity: this is the translateX at the start of the touch
    let isDragging = false;
    let swipeDirectionDetermined = false; 

    // Add touch listeners directly to the tabContentWrapper, which is the main scrollable area
    // This ensures that swipes on the "background" (empty areas or between tasks) are also captured.
    tabContentWrapper.addEventListener('touchstart', (e) => {
        // Only consider single touches for swiping
        if (e.touches.length !== 1) return;

        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY; 
        
        // Get the current computed transform value in pixels at the start of touch
        const computedTransform = getComputedStyle(tabContentWrapper).transform;
        const matrix = new DOMMatrixReadOnly(computedTransform);
        initialTranslateX = matrix.m41; 

        isDragging = false; 
        swipeDirectionDetermined = false; 
        tabContentWrapper.style.transition = 'none'; // Disable transition during drag for direct manipulation
    }, { passive: true }); // passive: true for touchstart is generally good for scroll performance

    tabContentWrapper.addEventListener('touchmove', (e) => {
        if (e.touches.length !== 1) { // If multiple touches, reset and don't swipe
            isDragging = false;
            swipeDirectionDetermined = false;
            return;
        }

        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = currentX - startX; 
        const diffY = currentY - startY; 
        const threshold = 15; // Adjusted threshold for sensitivity (pixels)

        if (!swipeDirectionDetermined) {
            // Determine if it's a horizontal swipe or vertical scroll
            if (Math.abs(diffX) > threshold && Math.abs(diffX) > Math.abs(diffY)) { 
                // Horizontal swipe detected: significant horizontal movement AND horizontal dominance
                isDragging = true;
                swipeDirectionDetermined = true;
                e.preventDefault(); // Prevent default vertical scrolling of the page/container
            } else if (Math.abs(diffY) > threshold) { 
                // Vertical scroll detected: significant vertical movement
                swipeDirectionDetermined = true;
                return; // Let browser handle vertical scroll normally
            } else {
                return; // Not enough movement yet to determine direction
            }
        }

        if (isDragging) {
            e.preventDefault(); // Continue preventing default if identified as horizontal swipe
            let newTransformX = initialTranslateX + diffX; 

            // Define boundaries for translation (pixels)
            const maxAllowedX = 0; 
            const minAllowedX = -(tabs.length - 1) * window.innerWidth; 

            // Clamp the newTransformX within the allowed boundaries
            newTransformX = Math.max(minAllowedX, Math.min(newTransformX, maxAllowedX));

            tabContentWrapper.style.transform = `translateX(${newTransformX}px)`;
        }
    }, { passive: false }); // passive: false because e.preventDefault() is called

    tabContentWrapper.addEventListener('touchend', () => {
        if (!isDragging) return; // Only process if it was a horizontal drag

        isDragging = false;
        swipeDirectionDetermined = false; // Reset for next touch event
        tabContentWrapper.style.transition = 'transform 0.3s ease-in-out'; // Re-enable transition for snapping

        // Get the final computed transform value in pixels after the touch ends
        const computedTransform = getComputedStyle(tabContentWrapper).transform;
        const matrix = new DOMMatrixReadOnly(computedTransform);
        const finalTransformX = matrix.m41; 

        // Determine the target tab index based on the final position.
        // Divide by window.innerWidth to get the "tab unit" and round to the nearest integer.
        // Negate because translateX is negative for moving left (to next tabs).
        let newActiveTabIndex = Math.round(-finalTransformX / window.innerWidth);

        // Ensure the new index is within valid bounds
        newActiveTabIndex = Math.max(0, Math.min(newActiveTabIndex, tabs.length - 1));

        // Switch to the newly determined tab. This function will re-render tabs and update transform.
        // This ensures the snap to the nearest tab is smooth.
        switchTab(tabs[newActiveTabIndex].id);
        
        // After potential tab switch or snap back, ensure content height is correct
        // A slight delay allows the CSS transition to begin before recalculating height.
        setTimeout(() => {
            const activeContentDiv = document.getElementById(`tab-content-${activeTabId}`);
            if (activeContentDiv) {
                tabContentWrapper.style.height = `${activeContentDiv.scrollHeight}px`;
            }
        }, 300); 
    });

    // Window resize handler: update content display to adjust for new window width
    window.addEventListener('resize', () => {
        updateTabContentDisplay();
    });

    // Initial rendering of tabs and their contents when the page loads
    renderTabs();
    renderTabContents();
});
