const itemsData = [
    { id: 1, name: "フシギダネ", tags: ["evo_フシギダネ_0"], image: "cardimg/SIK-001.jpeg" },
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
        div.onclick = () => openOverlay(item);
        itemContainer.appendChild(div);
    });
}

// カード要素を生成する共通関数
function createItemElement(item, isSelected = false) {
    const div = document.createElement("div");
    div.classList.add("item");

    if (isSelected) {
        div.classList.add("selected");
    }

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.name;
    img.style.width = "200px";
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
    const overlayRelatedContainer = document.getElementById("overlay-related-container");

    // 前回の内容をクリア
    overlayRelatedContainer.innerHTML = "";

    // 関連カードを取得し、選択したカードは強調表示
    const relatedItems = getRelatedItems(selectedItem);
    relatedItems.forEach(item => {
        const div = createItemElement(item, item.id === selectedItem.id);
        div.onclick = () => openOverlay(item);
        overlayRelatedContainer.appendChild(div);
    });

    // オーバーレイを表示
    overlay.classList.remove("hidden");
}

// 進化系統（関連カード）を取得する関数
function getRelatedItems(selectedItem) {
    const evoTag = selectedItem.tags.find(tag => tag.startsWith("evo_"));
    if (!evoTag) return [];

    const evoBase = evoTag.split("_")[1];

    const related = itemsData.filter(item =>
        item.tags.some(tag => tag.startsWith(`evo_${evoBase}_`))
    );

    const uniqueRelated = {};
    related.forEach(item => {
        const level = parseInt(item.tags[0].split("_")[2], 10);
        if (!(level in uniqueRelated) || item.id < uniqueRelated[level].id) {
            uniqueRelated[level] = item;
        }
    });

    return [0, 1, 2].map(level => uniqueRelated[level]).filter(Boolean);
}

// 閉じるボタンの処理
document.getElementById("close-btn").addEventListener("click", function() {
    document.getElementById("overlay").classList.add("hidden");
});

// 初期表示
renderItems();
