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

  const conditions = parseConditions(input);
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

function parseConditions(input) {
  // 括弧で囲まれた部分をグループとする
  const orParts = input.split(/\s+or\s+/i);

  const groups = orParts.map(part => {
    const group = [];
    const match = part.match(/\((.*?)\)/);
    if (match) {
      group.push(...match[1].split(",").map(t => t.trim()).filter(Boolean));
    } else {
      group.push(...part.split(",").map(t => t.trim()).filter(Boolean));
    }
    return group;
  });

  // AND条件として共通するタグを抽出
  const rest = input.split(/\s+or\s+/i).join(",");
  const restTags = rest.replace(/\([^)]*\)/g, "").split(",").map(t => t.trim()).filter(t => t && t.toLowerCase() !== "or");

  return { orGroups: groups, andTags: restTags };
}

function matchConditions(tags, { orGroups, andTags }) {
  // ORグループがあればどれか1グループが一致していればOK
  const orValid = orGroups.length === 0 || orGroups.some(group =>
    group.every(tag => tags.includes(tag))
  );

  // ANDタグはすべて含んでいること
  const andValid = andTags.every(tag => tags.includes(tag));

  return orValid && andValid;
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
