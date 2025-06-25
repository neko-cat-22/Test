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

  const { groups, orPairs } = parseInputToGroups(input);

  const filtered = monsters.filter(monster => {
    const allTags = [
      ...monster.属性.tags,
      ...monster.撃種.tags,
      ...monster.ショットスキル.tags,
      ...monster.アシストスキル.tags,
      ...monster.アビリティ.tags
    ];
    return matchConditions(allTags, groups, orPairs);
  });

  renderMonsters(filtered);
}

function parseInputToGroups(input) {
  const tokens = input.split(",").map(t => t.trim()).filter(Boolean);
  const groups = [];
  const orPairs = [];

  let currentGroup = [];
  let multiMode = false;
  let groupIndex = 0;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === "(") {
      multiMode = true;
      currentGroup = [];
    } else if (token === ")") {
      multiMode = false;
      groups.push(currentGroup);
      currentGroup = [];
      groupIndex++;
    } else if (token.toLowerCase() === "or") {
      orPairs.push([groupIndex - 1, groupIndex]); // 直前と次のグループにOR条件
    } else {
      if (multiMode) {
        currentGroup.push(token);
      } else {
        groups.push([token]);
        groupIndex++;
      }
    }
  }

  return { groups, orPairs };
}

function matchConditions(tags, groups, orPairs) {
  const matchedGroups = groups.map(group =>
    group.every(tag => tags.includes(tag))
  );

  // ORの条件で、どちらかがtrueなら成立
  const orResults = orPairs.map(([i, j]) => matchedGroups[i] || matchedGroups[j]);

  // AND条件のグループ（ORに含まれていない）→全てtrueならOK
  const orGroupIndices = new Set(orPairs.flat());
  const andResults = matchedGroups
    .map((matched, idx) => (orGroupIndices.has(idx) ? true : matched));

  return [...orResults, ...andResults].every(v => v);
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
