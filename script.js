const itemsData = [
    { id: 1, name: "フシギダネ", tags: ["evo_フシギダネ_0"], image: "cardimg/SIK-001.png" },
    { id: 2, name: "フシギソウ", tags: ["evo_フシギダネ_1"], image: "cardimg/SIK-002.png" },
    { id: 3, name: "フシギバナ", tags: ["evo_フシギダネ_2"], image: "cardimg/SIK-003.png" },
    { id: 4, name: "フェニックス Lv.0", tags: ["evo_phoenix_0"], image: "img/phoenix0.jpg" },
    { id: 5, name: "キャタピー", tags: ["evo_キャタピー_0"], image: "cardimg/SIK-005.png" },
    { id: 6, name: "トランセル", tags: ["evo_キャタピー_1"], image: "cardimg/SIK-006.png" },
    { id: 7, name: "バタフリー", tags: ["evo_キャタピー_2"], image: "cardimg/SIK-007.png" }
];

const itemContainer = document.getElementById("item-container");

// メイン画面にカードを表示
function renderItems() {
    itemContainer.innerHTML = "";
    itemsData.forEach(item => {
        const div = createItemElement(item);
        // カードクリック時にオーバーレイを開く
        div.onclick = () => openOverlay(item);
        itemContainer.appendChild(div);
    });
}

// カード要素を生成する共通関数
function createItemElement(item) {
    const div = document.createElement("div");
    div.classList.add("item");

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.name;
    // ※CSSでサイズ指定しているため、こちらのスタイル指定は任意です
    img.style.width = "70px";
    img.style.height = "auto";

    const name = document.createElement("p");
    name.textContent = item.name;

    div.appendChild(img);
    div.appendChild(name);

    return div;
}

// オーバーレイを開く関数
function openOverlay(selectedItem) {
    const overlay = document.getElementById("overlay");
    const overlaySelectedContainer = document.getElementById("overlay-selected-container");
    const overlayRelatedContainer = document.getElementById("overlay-related-container");

    // 前回の内容をクリア
    overlaySelectedContainer.innerHTML = "";
    overlayRelatedContainer.innerHTML = "";

    // 選んだカードを上部に追加
    const selectedDiv = createItemElement(selectedItem);
    selectedDiv.classList.add("selected");
    overlaySelectedContainer.appendChild(selectedDiv);

    // 関連（進化系統）カードを取得して下部に追加
    const relatedItems = getRelatedItems(selectedItem);
    relatedItems.forEach(item => {
        const div = createItemElement(item);
        div.classList.add("related-item");
        // 関連カードクリックでそのカードのオーバーレイを再表示
        div.onclick = () => openOverlay(item);
        overlayRelatedContainer.appendChild(div);
    });

    // オーバーレイを表示
    overlay.classList.remove("hidden");
}

// 進化系統（関連カード）を取得する関数
function getRelatedItems(selectedItem) {
    // evo_タグを取得
    const evoTag = selectedItem.tags.find(tag => tag.startsWith("evo_"));
    if (!evoTag) return [];

    // 進化名（例："フシギダネ"）を取得
    const evoBase = evoTag.split("_")[1];

    // 同じ進化名を持つカードを抽出
    const related = itemsData.filter(item =>
        item.tags.some(tag => tag.startsWith(`evo_${evoBase}_`))
    );

    // レベルごとにidの小さいカードを代表として選択
    const uniqueRelated = {};
    related.forEach(item => {
        const level = parseInt(item.tags[0].split("_")[2], 10);
        if (!(level in uniqueRelated) || item.id < uniqueRelated[level].id) {
            uniqueRelated[level] = item;
        }
    });

    // 0 → 1 → 2 の順に並べて返す
    return [0, 1, 2].map(level => uniqueRelated[level]).filter(Boolean);
}

// カード要素を生成する関数（オーバーレイ用サイズ適用）
function createItemElement(item, isOverlay = false) {
    const div = document.createElement("div");
    div.classList.add("item");

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.name;

    // 画像サイズの調整
    if (isOverlay) {
        img.classList.add("overlay-img"); // オーバーレイ用のサイズを適用
    } else {
        img.style.width = "70px";
        img.style.height = "auto";
    }

    const name = document.createElement("p");
    name.textContent = item.name;

    div.appendChild(img);
    div.appendChild(name);

    return div;
}

// オーバーレイを開く関数の変更
function openOverlay(selectedItem) {
    const overlay = document.getElementById("overlay");
    const overlaySelectedContainer = document.getElementById("overlay-selected-container");
    const overlayRelatedContainer = document.getElementById("overlay-related-container");

    overlaySelectedContainer.innerHTML = "";
    overlayRelatedContainer.innerHTML = "";

    // 選んだカード（大きく表示）
    const selectedDiv = createItemElement(selectedItem, true);
    selectedDiv.classList.add("selected");
    overlaySelectedContainer.appendChild(selectedDiv);

    // 関連カードの表示（少し大きく）
    const relatedItems = getRelatedItems(selectedItem);
    relatedItems.forEach(item => {
        const div = createItemElement(item, true);
        div.classList.add("related-item");
        div.onclick = () => openOverlay(item);
        overlayRelatedContainer.appendChild(div);
    });

    overlay.classList.remove("hidden");
}

// 閉じるボタンの処理
document.getElementById("close-btn").addEventListener("click", function() {
    document.getElementById("overlay").classList.add("hidden");
});

// 初期表示
renderItems();
