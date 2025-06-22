// 属性ごとのボーダーカラー設定
const attributeColors = {
  "炎": "#FF5050",
  "水": "#38BCFF",
  "木": "#55FF00",
  "光": "#FFFF00",
  "闇": "#AEFC00"
};

function createMonsterCard(monster) {
  const attr = monster.属性.tags[0];
  const borderColor = attributeColors[attr] || "#ccc";

  return `
    <div class="monster-card" style="border: 4px solid ${borderColor}">
      <h3>${monster.name}</h3>
      <p><strong>属性:</strong> ${monster.属性.text}</p>
      <p><strong>撃種:</strong> ${monster.撃種.text}</p>
      <p><strong>ショットスキル:</strong> ${monster.ショットスキル.text} ${formatTags(monster.ショットスキル.tags)}</p>
      <p><strong>アシストスキル:</strong> ${monster.アシストスキル.text} ${formatTags(monster.アシストスキル.tags)}</p>
      <p><strong>アビリティ:</strong> ${monster.アビリティ.text}</p>
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

// タググループを表示
function renderTagList() {
  const tagList = document.getElementById("tag-list");
  tagList.innerHTML = availableTagGroups.map(group => {
    const groupHTML = group.map(tag =>
      `<div class="clickable-tag" onclick="addTagToInput('${tag}')">${tag}</div>`
    ).join("");
    return `<div class="tag-group">${groupHTML}</div>`;
  }).join("");
}

function addTagToInput(tag) {
  const input = document.getElementById("tagInput");
  const currentTags = input.value.split(",").map(t => t.trim()).filter(Boolean);

  if (!currentTags.includes(tag)) {
    currentTags.push(tag);
    input.value = currentTags.join(", ");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof monsters !== "undefined") {
    renderMonsters(monsters);
  }
  if (typeof availableTagGroups !== "undefined") {
    renderTagList();
  }
});
