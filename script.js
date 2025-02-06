console.log("ページが読み込まれました。");

// アイテムのデータを配列として定義
const itemsData = [
  { img: "cardimg/SIK-056.png", name: "カメックスex", tags: "水 カメックス カメックスex" },
  { img: "cardimg/SIK-076.png", name: "スターミーex", tags: "水 スターミー スターミーex" },
  { img: "cardimg/SIK-094.png", name: "ピカチュウ", tags: "雷 ピカチュウ" },
  { img: "cardimg/SIK-095.png", name: "ライチュウ", tags: "雷 ライチュウ" },
  { img: "cardimg/SIK-096.png", name: "ピカチュウex", tags: "雷 ピカチュウ ピカチュウex" }
];

// アイテムを動的に生成する関数
function generateItems() {
  console.log("generateItems() が実行されました。");

  const itemList = document.getElementById("itemList");
  itemList.innerHTML = ""; // 既存のアイテムをクリア
  console.log("itemList の中身をクリアしました。");

  itemsData.forEach((item, index) => {
    console.log(`アイテム ${index + 1}: ${item.name} を生成します。`);

    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");
    itemDiv.setAttribute("data-tags", item.tags);

    const img = document.createElement("img");
    img.src = item.img;
    img.alt = item.name;

    const span = document.createElement("span");
    span.textContent = item.name;

    itemDiv.appendChild(img);
    itemDiv.appendChild(span);
    itemList.appendChild(itemDiv);

    console.log(`アイテム ${index + 1}: ${item.name} を itemList に追加しました。`);
  });

  console.log("すべてのアイテムが追加されました。");
}

// ページ読み込み時にアイテムを生成
window.onload = () => {
  console.log("window.onload が実行されました。");
  generateItems();
};

// 検索機能
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', () => {
  console.log("検索ボックスの入力が変更されました。");

  const query = searchInput.value.toLowerCase();
  console.log(`検索クエリ: ${query}`);

  const items = document.querySelectorAll('.item');
  items.forEach((item, index) => {
    const text = item.textContent.toLowerCase();
    const tags = item.getAttribute('data-tags').toLowerCase();
    if (text.includes(query) || tags.includes(query)) {
      item.classList.remove('hidden');
      console.log(`アイテム ${index + 1}: 表示`);
    } else {
      item.classList.add('hidden');
      console.log(`アイテム ${index + 1}: 非表示`);
    }
  });
});
