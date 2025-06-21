const monsters = [
  {
    name: "テストモンスター",
    属性: { text: "炎", tags: ["炎"] },
    撃種: { text: "反射", tags: ["反射"] },
    ショットスキル: { text: "味方に触れると回復する", tags: ["回復", "ステータス"] },
    アシストスキル: { text: "攻撃力アップ", tags: ["バフ"] },
    アビリティ: { text: "アンチ重力バリア", tags: ["AGB"] }
  },
  {
    name: "スピードドラゴン",
    属性: { text: "水", tags: ["水"] },
    撃種: { text: "貫通", tags: ["貫通"] },
    ショットスキル: { text: "スピードアップ", tags: ["バフ"] },
    アシストスキル: { text: "防御力ダウン", tags: ["デバフ"] },
    アビリティ: { text: "アンチワープ", tags: ["AW"] }
  }
];

function createMonsterCard(monster) {
  return `
    <div class="monster-card">
      <h3>${monster.name}</h3>
      <p><strong>属性:</strong> ${monster.属性.text} ${formatTags(monster.属性.tags)}</p>
      <p><strong>撃種:</strong> ${monster.撃種.text} ${formatTags(monster.撃種.tags)}</p>
      <p><strong>ショットスキル:</strong> ${monster.ショットスキル.text} ${formatTags(monster.ショットスキル.tags)}</p>
      <p><strong>アシストスキル:</strong> ${monster.アシストスキル.text} ${formatTags(monster.アシストスキル.tags)}</p>
      <p><strong>アビリティ:</strong> ${monster.アビリティ.text} ${formatTags(monster.アビリティ.tags)}</p>
    </div>
  `;
}

function formatTags(tags) {
  return tags.map(tag => `<span class="tag">${tag}</span>`).join(" ");
}

function searchByTags() {
  const input = document.getElementById("tagInput").value.trim();
  const keywords = input.split(",").map(t => t.trim()).filter(Boolean);

  const filtered = monsters.filter(monster => {
    const allTags = [
      ...monster.属性.tags,
      ...monster.撃種.tags,
      ...monster.ショットスキル.tags,
      ...monster.アシストスキル.tags,
      ...monster.アビリティ.tags
    ];
    return keywords.every(keyword => allTags.includes(keyword));
  });

  renderMonsters(filtered);
}

function renderMonsters(list) {
  const container = document.getElementById("monster-list");
  container.innerHTML = list.length
    ? list.map(createMonsterCard).join("")
    : "<p>該当するモンスターが見つかりませんでした。</p>";
}

// 初期表示
renderMonsters(monsters);
