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
  if (!input) {
    renderMonsters(monsters);
    return;
  }

  const conditions = parseConditionsWithCommas(input);
  const filtered = monsters.filter(monster => {
    const allTags = [
      ...monster.属性.tags,
      ...monster.撃種.tags,
      ...monster.ショットスキル.tags,
      ...monster.アシストスキル.tags,
      ...monster.アビリティ.tags
    ];
    return matchConditions(allTags, conditions);
  });

  renderMonsters(filtered);
}

// 新しい条件解析関数（カンマ前提）
function parseConditionsWithCommas(input) {
  const orParts = input.split(/\s+or\s+/i).map(part => part.trim());

  const orGroups = orParts.map(part => {
    if (part.startsWith("(") && part.endsWith(")")) {
      return part.slice(1, -1).split(",").map(t => t.trim()).filter(Boolean);
    } else {
      return [part].flatMap(p => p.split(",").map(t => t.trim()).filter(Boolean));
    }
  });

  // AND条件として使われるのは or に含まれていないタグ（再構成で見つける）
  const orTagsFlat = orGroups.flat();
  const allTags = input.split(",").map(t => t.replace(/[()]/g, '').trim()).filter(Boolean);
  const andTags = allTags.filter(t => !orTagsFlat.includes(t) && t.toLowerCase() !== "or");

  return { orGroups, andTags };
}

function matchConditions(tags, { orGroups, andTags }) {
  const orMatch = orGroups.length === 0 || orGroups.some(group =>
    group.every(tag => tags.includes(tag))
  );
  const andMatch = andTags.every(tag => tags.includes(tag));
  return orMatch && andMatch;
}

function renderMonsters(list) {
  const container = document.getElementById("monster-list");
  container.innerHTML = list.length
    ? list.map(createMonsterCard).join("")
    : "<p>該当するモンスターが見つかりませんでした。</p>";
}

function renderTagList() {
  const tagList = document.getElementById("tag-list");
  tagList.innerHTML = availableTagGroups.map(group => {
    const titleHTML = `<div class="tag-group-title">${group.title}</div>`;
    const tagButtons = group.tags.map(tag =>
      `<div class="clickable-tag" onclick="addTagToInput('${tag}')">${tag}</div>`
    ).join("");
    return `<div class="tag-group">${titleHTML}<div class="tag-buttons">${tagButtons}</div></div>`;
  }).join("");
}

function addTagToInput(tag) {
  const input = document.getElementById("tagInput");
  const currentTags = input.value.trim();
  if (!currentTags) {
    input.value = tag;
    return;
  }
  input.value = currentTags + ", " + tag;
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof monsters !== "undefined") {
    renderMonsters(monsters);
  }
  if (typeof availableTagGroups !== "undefined") {
    renderTagList();
  }
});
