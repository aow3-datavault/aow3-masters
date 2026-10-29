const DebugLogger = {
  log(event, payload = {}) {
    console.info("[Masters demo]", event, payload);
  }
};

const STORAGE_KEY = "aow-masters-preview-v1";
const LANGUAGE_STORAGE_KEY = "aow-masters-preview-language";
const localization = globalThis.MastersI18n || {
  translate: (text) => String(text == null ? "" : text),
  resolveLanguage: (search, stored) => stored === "en" || stored === "ru" ? stored : "ru",
  apply: () => null
};
function readLanguagePreference() {
  try {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch (error) {
    return null;
  }
}
let language = localization.resolveLanguage(window.location?.search || "", readLanguagePreference());
const playerRecords = tournamentData.players.map((player, index) => ({
  id: "summer-" + index,
  name: player.name,
  clan: player.clan || "Без клана",
  faction: player.faction,
  avatar: player.name,
  seed: index + 1
}));
const reserveRecords = [
  { id: "reserve-01", name: "Reserve Pilot 01", clan: "Резервный состав", faction: "confederation", avatar: "Reserve Pilot 01" },
  { id: "reserve-02", name: "Reserve Pilot 02", clan: "Резервный состав", faction: "resistance", avatar: "Reserve Pilot 02" },
  { id: "reserve-03", name: "Reserve Pilot 03", clan: "Резервный состав", faction: "confederation", avatar: "Reserve Pilot 03" },
  { id: "reserve-04", name: "Reserve Pilot 04", clan: "Резервный состав", faction: "resistance", avatar: "Reserve Pilot 04" }
];
const playerByName = new Map(playerRecords.concat(reserveRecords).map((player) => [player.name, player]));
const returnInvitees = new Set(["Koroleva Zadrot", "ALTAIR_SON_OF_DARK"]);
const statusNames = {
  invited: "Ожидает ответа",
  confirmed: "Подтверждён",
  declined: "Отклонено",
  expired: "Истекло"
};
const statusClasses = {
  invited: "status-invited",
  confirmed: "status-confirmed",
  declined: "status-declined",
  expired: "status-expired"
};
const views = {
  overview: "ОБЗОР",
  cabinet: "МОЁ УЧАСТИЕ",
  players: "УЧАСТНИКИ",
  bracket: "СЕТКА",
  streams: "ТРАНСЛЯЦИИ",
  clans: "КЛАНЫ",
  admin: "ПРИГЛАШЕНИЯ"
};
const scheduleOptions = [
  ["slot-a", "Вариант A · 18:00"],
  ["slot-b", "Вариант B · 19:30"],
  ["slot-c", "Вариант C · 21:00"]
];
const page = document.getElementById("main-content");
const modal = document.getElementById("app-modal");
const modalContent = document.getElementById("modal-content");
let lastModalTrigger = null;
let mobileBracketRound = 0;

function createDefaultState() {
  return {
    authenticated: false,
    slots: playerRecords.map((player, index) => {
      const status = index === 0 || index === 8 ? "invited" : [24, 26, 30].includes(index) ? "declined" : index === 31 ? "expired" : "confirmed";
      return {
        rank: player.seed,
        seedPlayer: player.name,
        source: returnInvitees.has(player.name) ? "returning" : "qualifier",
        status,
        activePlayer: player,
        history: []
      };
    }),
    schedule: "slot-a",
    chat: []
  };
}

function loadState() {
  const defaults = createDefaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const saved = JSON.parse(raw);
    if (!saved || !Array.isArray(saved.slots) || saved.slots.length !== playerRecords.length) return defaults;
    const slots = defaults.slots.map((slot, index) => {
      const candidate = saved.slots[index];
      if (!candidate || !["invited", "confirmed", "declined", "expired"].includes(candidate.status)) return slot;
      const activePlayer = playerByName.get(candidate.activeName) || slot.activePlayer;
      const history = Array.isArray(candidate.history) ? candidate.history.filter((item) => item && typeof item === "object").map((item) => ({
        player: playerByName.get(item.playerName) || null,
        status: ["invited", "confirmed", "declined", "expired"].includes(item.status) ? item.status : "declined"
      })).filter((item) => item.player) : [];
      return { ...slot, status: candidate.status, activePlayer, history };
    });
    const chat = Array.isArray(saved.chat) ? saved.chat.slice(-30).filter((item) => item && typeof item.text === "string").map((item) => ({
      text: item.text.slice(0, 500),
      time: Number.isFinite(item.time) ? item.time : Date.now()
    })) : [];
    return {
      authenticated: Boolean(saved.authenticated),
      slots,
      schedule: scheduleOptions.some(([key]) => key === saved.schedule) ? saved.schedule : "slot-a",
      chat
    };
  } catch (error) {
    DebugLogger.log("state_load_failed", { message: String(error && error.message || error) });
    return defaults;
  }
}

let state = loadState();
let activeView = "overview";

function persistState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      authenticated: state.authenticated,
      slots: state.slots.map((slot) => ({
        status: slot.status,
        activeName: slot.activePlayer.name,
        history: slot.history.map((item) => ({ playerName: item.player.name, status: item.status }))
      })),
      schedule: state.schedule,
      chat: state.chat
    }));
  } catch (error) {
    DebugLogger.log("state_save_failed", { message: String(error && error.message || error) });
  }
}

function escapeHTML(value) {
  return String(value == null ? "" : value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[character]);
}

function translateText(value) {
  return localization.translate(value, language);
}

function applyLocalization(rootElement = document) {
  localization.apply(rootElement, language);
  if (document.documentElement) document.documentElement.lang = language;
  if (language === "en") document.title = "Art of War Masters — Tournament Preview";
  else document.title = "Art of War Masters — турнирное превью";
  const switchButton = document.getElementById("language-switch");
  if (switchButton) {
    switchButton.textContent = language === "en" ? "RU" : "EN";
    switchButton.setAttribute("aria-label", language === "en" ? "Switch to Russian" : "Переключить язык на английский");
    switchButton.setAttribute("title", language === "en" ? "Switch to Russian" : "Переключить язык на английский");
  }
  if (typeof document.querySelectorAll === "function") {
    document.querySelectorAll("option[data-reserve-id]").forEach((option) => {
      const reserve = reserveRecords.find((record) => record.id === option.dataset.reserveId);
      if (reserve) option.textContent = reserve.name + " · " + translateText(reserve.faction === "resistance" ? "Сопротивление" : "Конфедерация");
    });
  }
}

function setLanguage(nextLanguage) {
  language = nextLanguage === "en" ? "en" : "ru";
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    DebugLogger.log("language_save_failed", { message: String(error && error.message || error) });
  }
  try {
    if (window.history?.replaceState && window.location?.href) {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", language);
      window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    }
  } catch (error) {
    DebugLogger.log("language_url_update_failed", { message: String(error && error.message || error) });
  }
  applyLocalization();
  DebugLogger.log("language_changed", { language: language });
}

function displayClan(player) {
  if (player && player.id && player.id.startsWith("reserve-")) return language === "en" ? "Reserve roster" : "Резервный состав";
  const clan = player && player.clan || "Без клана";
  return clan === "Без клана" && language === "en" ? "No clan" : clan;
}

function iconPath(name) {
  return "icons/" + encodeURIComponent(String(name)) + ".png";
}

function avatar(name, className = "player-thumb") {
  const record = playerByName.get(name);
  const initial = escapeHTML(String(name || "?").trim().slice(0, 1).toUpperCase());
  if (!record || record.id.startsWith("reserve-")) return "<span class=\"" + className + "\">" + initial + "</span>";
  return "<span class=\"" + className + "\">" + initial + "<img src=\"" + escapeHTML(iconPath(record.avatar)) + "\" alt=\"\" loading=\"lazy\" onerror=\"this.remove()\"></span>";
}

function playerCell(player, subline = "") {
  return "<div class=\"player-cell\">" + avatar(player.name) + "<span><strong data-i18n-ignore>" + escapeHTML(player.name) + "</strong><small>" + escapeHTML(subline) + "</small></span></div>";
}

function statusPill(status) {
  const className = statusClasses[status] || "status-expired";
  const label = statusNames[status] || "Нет статуса";
  return "<span class=\"status-pill " + className + "\">" + label + "</span>";
}

function sourcePill(source) {
  return source === "returning"
    ? "<span class=\"source-pill source-returning\">ВОЗВРАЩАЮЩИЙСЯ ПОБЕДИТЕЛЬ</span>"
    : "<span class=\"source-pill\">ARENA QUALIFIER</span>";
}

function getSlotForPlayer(name) {
  return state.slots.find((slot) => slot.seedPlayer === name);
}

function getFeaturedSlot() {
  const slot = getSlotForPlayer("Hero Dominator");
  if (slot.activePlayer.name === "Hero Dominator") return slot;
  const previous = slot.history.find((item) => item.player.name === "Hero Dominator");
  return { ...slot, activePlayer: playerByName.get("Hero Dominator"), status: previous?.status === "expired" ? "expired" : "declined", replaced: true };
}

function countStatuses() {
  return state.slots.reduce((counts, slot) => {
    counts[slot.status] += 1;
    return counts;
  }, { invited: 0, confirmed: 0, declined: 0, expired: 0 });
}

function activePlayerCount() {
  return state.slots.length;
}

function demoStrip() {
  return "<div class=\"demo-strip\"><span class=\"demo-icon\">◈</span><strong>ИНТЕРАКТИВНОЕ ПРЕВЬЮ</strong><span>Данные летнего сезона · статусы и действия сохраняются только в этом браузере</span></div>";
}

function viewHeading(kicker, title, subtitle, action = "") {
  return "<div class=\"view-heading\"><div><div class=\"eyebrow\">" + escapeHTML(kicker) + "</div><h1 class=\"page-title\">" + escapeHTML(title) + "</h1><p class=\"page-subtitle\">" + escapeHTML(subtitle) + "</p></div>" + action + "</div>";
}

function metric(label, value, suffix, mark) {
  return "<div class=\"metric-card\"><span class=\"metric-mark\">" + escapeHTML(mark || "◈") + "</span><div class=\"metric-label\">" + escapeHTML(label) + "</div><div class=\"metric-value\">" + escapeHTML(value) + "<small>" + escapeHTML(suffix || "") + "</small></div></div>";
}

function heroView() {
  const counts = countStatuses();
  const slot = getFeaturedSlot();
  const status = slot.status;
  const statusText = status === "invited" ? "Ожидает ответа" : statusNames[status];
  const authCta = state.authenticated
    ? "<button class=\"button button-primary\" type=\"button\" data-view=\"cabinet\">Открыть кабинет <span class=\"icon-arrow\">↗</span></button>"
    : "<button class=\"button button-primary\" type=\"button\" data-action=\"open-auth\">Посмотреть приглашение <span class=\"icon-arrow\">↗</span></button>";
  return demoStrip() +
    "<section class=\"hero\"><div class=\"hero-main\"><div class=\"hero-overline\"><span>◈</span> ART OF WAR · COMPETITIVE SERIES · 2026</div><h1 class=\"hero-title\">ART OF WAR<span>MASTERS</span></h1><p class=\"hero-copy\">32 игрока. Один чемпион. Победители прошлого сезона и лучшие бойцы Arena Qualifier встретятся в дуэлях один на один.</p><div class=\"hero-tags\"><span class=\"hero-tag gold\">32 ИГРОКА</span><span class=\"hero-tag\">30 МЕСТ · ARENA QUALIFIER</span><span class=\"hero-tag\">2 ВОЗВРАЩАЮЩИХСЯ ПОБЕДИТЕЛЯ</span></div><div class=\"hero-actions\">" +
    authCta +
    "<button class=\"button button-secondary\" type=\"button\" data-view=\"bracket\">Открыть сетку <span class=\"icon-arrow\">↗</span></button></div></div><div class=\"hero-side\"><div class=\"invitation-card\"><div class=\"invitation-top\">ПЕРСОНАЛЬНЫЙ СТАТУС <span>DEMO / 01</span></div><div class=\"invitation-body\">" + avatar("Hero Dominator", "player-avatar") + "<div class=\"invitation-name\"><strong data-i18n-ignore>Hero Dominator</strong><small>Пример приглашения · seed сохраняется</small></div></div><div class=\"invitation-status\"><span class=\"pulse-dot\"></span>" + escapeHTML(statusText) + "</div><button class=\"button button-primary button-small\" type=\"button\" " + (state.authenticated ? "data-view=\"cabinet\"" : "data-action=\"open-auth\"") + ">" + (state.authenticated ? "Продолжить в кабинете" : "Действия по приглашению") + " <span class=\"icon-arrow\">↗</span></button></div><p class=\"hero-side-note\">Публичной регистрации нет · состав готовит организатор</p></div></section>" +
    "<section class=\"metrics-grid\" aria-label=\"Состав превью\">" +
    metric("СЛОТОВ В СЕТКЕ", activePlayerCount(), "участника", "⌘") +
    metric("ПОДТВЕРДИЛИ", counts.confirmed, "готовы играть", "✓") +
    metric("ЖДУТ ОТВЕТА", counts.invited, "приглашения", "◷") +
    metric("МАТЧЕЙ", 32, "на пути к титулу", "↗") +
    "</section>" +
    "<div class=\"overview-lower\"><section class=\"panel\"><div class=\"panel-heading\"><h2>ФОРМАТ ТУРНИРА</h2><small>КАРТА МАТЧЕЙ</small></div><div class=\"format-list\"><div class=\"format-step\"><strong>32 → 16</strong><span>Раунд 32 · BO1</span></div><div class=\"format-step\"><strong>16 → 8</strong><span>Раунд 16 · BO1</span></div><div class=\"format-step\"><strong>8 → 4</strong><span>Четвертьфинал · BO1</span></div><div class=\"format-step\"><strong>4 → 1</strong><span>Полуфинал и финал · BO3</span></div></div><div class=\"format-footer\"><strong>+ матч за 3-е место · BO1</strong><span>·</span><span>32 матча в сетке</span></div></section><section class=\"panel\"><div class=\"panel-heading\"><h2>РАЗДЕЛЫ</h2><small>БЫСТРЫЙ ДОСТУП</small></div><div class=\"quick-links\"><button class=\"quick-link\" type=\"button\" data-view=\"players\"><span class=\"quick-glyph\">◎</span><span class=\"quick-link-copy\"><strong>Состав участников</strong><small>Поиск и фильтры состава</small></span><b>↗</b></button><button class=\"quick-link\" type=\"button\" data-view=\"streams\"><span class=\"quick-glyph\">▷</span><span class=\"quick-link-copy\"><strong>Архив трансляций</strong><small>Записи летнего турнира</small></span><b>↗</b></button><button class=\"quick-link\" type=\"button\" data-view=\"clans\"><span class=\"quick-glyph\">⬡</span><span class=\"quick-link-copy\"><strong>Клановый рейтинг</strong><small>Исторические очки SUMMER</small></span><b>↗</b></button></div></section></div>";
}

function cabinetView() {
  const slot = getFeaturedSlot();
  const status = slot.status;
  if (!state.authenticated) {
    return demoStrip() + viewHeading("УЧАСТНИК", "МОЁ УЧАСТИЕ", "Личный кабинет приглашённого игрока и ответы по заявке.") +
      "<section class=\"card signed-out\"><div class=\"signed-out-mark\">⌂</div><h2>Войти в кабинет</h2><p>Откройте демонстрационную сессию, чтобы посмотреть приглашение Hero Dominator, подтвердить участие, выбрать пример времени и написать сообщение в локальный чат.</p><button class=\"button button-primary\" type=\"button\" data-action=\"open-auth\">Войти через Discord или Telegram <span class=\"icon-arrow\">↗</span></button><div class=\"demo-disclaimer\">Демонстрация входа; аккаунт не подключается и данные не отправляются.</div></section>";
  }
  const player = slot.activePlayer;
  const accepted = status === "confirmed";
  const declined = status === "declined";
  let actionBlock = "";
  if (status === "invited") {
    actionBlock = "<div class=\"invitation-state\"><div class=\"invitation-state-copy\"><strong>Вам доступно место в турнирном составе</strong><small>Seed #" + slot.rank + " остаётся закреплён за приглашением.</small></div>" + statusPill(status) + "</div><label class=\"confirm-rule\"><input id=\"accept-rules\" type=\"checkbox\"><span>Я ознакомился(лась) с правилами и подтверждаю участие в демонстрационном составе.</span></label><div class=\"cabinet-actions\"><button class=\"button button-primary\" type=\"button\" data-action=\"confirm-invitation\" disabled id=\"confirm-invitation\">Подтвердить участие <span class=\"icon-arrow\">↗</span></button><button class=\"button button-danger\" type=\"button\" data-action=\"open-decline\">Отклонить приглашение</button></div>";
  } else if (accepted) {
    actionBlock = "<div class=\"invitation-state\"><div class=\"invitation-state-copy\"><strong>Участие подтверждено</strong><small>Подтверждение сохранено в демо-сессии этого браузера.</small></div>" + statusPill(status) + "</div><div class=\"cabinet-actions\" style=\"margin-top:12px\"><button class=\"button button-quiet\" type=\"button\" data-view=\"players\">Открыть список участников</button><button class=\"button button-quiet\" type=\"button\" data-view=\"bracket\">Посмотреть сетку</button></div>";
  } else {
    actionBlock = "<div class=\"invitation-state\"><div class=\"invitation-state-copy\"><strong>" + (declined ? "Приглашение отклонено" : "Срок ответа на приглашение истёк") + "</strong><small>Слот и исходный seed доступны организатору для демонстрации замены резервом.</small></div>" + statusPill(status) + "</div><button class=\"button button-quiet\" type=\"button\" data-action=\"reset-demo\" style=\"margin-top:12px\">Вернуть исходные демо-данные</button>";
  }
  let matchBlock = "";
  if (accepted) {
    const scheduleValue = scheduleOptions.some(([key]) => key === state.schedule) ? state.schedule : "slot-a";
    matchBlock = "<section class=\"next-match\"><div class=\"match-code\">ВАШ СЛЕДУЮЩИЙ МАТЧ · ПРИМЕР</div><div class=\"match-versus\"><div class=\"match-person\"><strong data-i18n-ignore>" + escapeHTML(player.name) + "</strong><small>Ваш слот · seed #" + slot.rank + "</small></div><span class=\"versus-mark\">VS</span><div class=\"match-person\"><strong>Соперник назначается</strong><small>После подтверждения состава</small></div></div><div class=\"match-meta\"><span>Раунд 32</span><span>BO1</span><span>Турнирная сетка превью</span></div><div class=\"schedule-row\"><label for=\"schedule-select\">Удобное время</label><select class=\"schedule-select\" id=\"schedule-select\" data-action=\"schedule-select\">" + scheduleOptions.map(([key, label]) => "<option value=\"" + key + "\" " + (key === scheduleValue ? "selected" : "") + ">" + escapeHTML(label) + "</option>").join("") + "</select><span class=\"small-note\">Локальный пример · без даты и записи на сервере</span></div><div class=\"schedule-explanation\"><strong>Правило будущего расписания:</strong> В полной системе оба игрока выберут общий доступный слот до дедлайна; организатор разрешит конфликт, если предпочтения не совпадут. Эти элементы управления показывают только локальный пример для одного игрока и не подтверждают время матча.</div></section>" +
      "<section class=\"card chat-card\"><div class=\"panel-heading\"><h3>ЧАТ МАТЧА</h3><small>LOCAL SIMULATION</small></div><div class=\"chat-note\">Сообщения остаются в этом браузере и не отправляются другим игрокам.</div><div class=\"chat-messages\" id=\"chat-messages\">" + renderChatMessages() + "</div><form class=\"chat-form\" id=\"chat-form\"><input class=\"chat-input\" name=\"message\" maxlength=\"500\" placeholder=\"Сообщение в демо-чат…\" autocomplete=\"off\"><button class=\"button button-primary button-small\" type=\"submit\">Отправить</button></form></section>";
  }
  return demoStrip() + viewHeading("УЧАСТНИК", "МОЁ УЧАСТИЕ", "Статус приглашения, матч-превью и локальные настройки демо-сессии.") +
    "<div class=\"content-grid\"><div class=\"stack\"><section class=\"profile-hero\">" + avatar(player.name, "profile-avatar") + "<div class=\"profile-info\"><h2 data-i18n-ignore>" + escapeHTML(player.name) + "</h2><p><span data-i18n-ignore>" + escapeHTML(displayClan(player)) + "</span> · <span class=\"faction-label\">" + (player.faction === "resistance" ? "Сопротивление" : "Конфедерация") + "</span></p></div><span class=\"profile-source\">" + (slot.source === "returning" ? "ВОЗВРАЩАЮЩИЙСЯ ПОБЕДИТЕЛЬ" : "ARENA QUALIFIER") + "</span></section><section class=\"card\"><div class=\"panel-heading\"><h3>ПРИГЛАШЕНИЕ</h3><small>SEED #" + slot.rank + "</small></div><div class=\"card-pad\">" + actionBlock + "</div></section>" + matchBlock + "</div><aside class=\"stack\"><section class=\"card card-pad\"><div class=\"eyebrow\">ДЕМО-СЕССИЯ</div><h2 class=\"card-title\" style=\"margin-top:8px\">Вход выполнен</h2><p class=\"muted\" style=\"font-size:11px\">Вы вошли как пример игрока. Реальная авторизация через Discord и Telegram не подключена.</p><button class=\"button button-quiet button-small\" type=\"button\" data-action=\"sign-out\">Завершить демо-вход</button><div class=\"rule-divider\"></div><div class=\"small-note\">Можно сбросить весь локальный прогресс кнопкой в меню или в панели организатора.</div></section><section class=\"card card-pad\"><div class=\"eyebrow\">СОСТАВ</div><h2 class=\"card-title\" style=\"margin-top:8px\">30 + 2</h2><p class=\"muted\" style=\"font-size:10px\">30 мест от Arena Qualifier и 2 слота возвращающихся победителей. Публичная регистрация не предусмотрена.</p><button class=\"button button-secondary button-small\" type=\"button\" data-view=\"admin\">Открыть демо-таблицу</button></section></aside></div>";
}

function participantRows() {
  const query = String(document.getElementById("player-search")?.value || "").trim().toLowerCase();
  const faction = document.getElementById("player-faction")?.value || "all";
  const status = document.getElementById("player-status")?.value || "all";
  const rows = state.slots.filter((slot) => {
    const player = slot.activePlayer;
    const text = (player.name + " " + player.clan).toLowerCase();
    return (!query || text.includes(query)) && (faction === "all" || player.faction === faction) && (status === "all" || slot.status === status);
  });
  const body = rows.map((slot) => "<tr><td class=\"seed-cell\">#" + slot.rank + "</td><td>" + playerCell(slot.activePlayer, slot.history.length ? "Резерв · исходный seed " + slot.rank : slot.source === "returning" ? "Возвращающийся победитель" : "Arena Qualifier") + "</td><td><span class=\"clan-name\" data-i18n-ignore>" + escapeHTML(displayClan(slot.activePlayer)) + "</span></td><td><span class=\"faction-label " + (slot.activePlayer.faction === "resistance" ? "resistance" : "") + "\">" + (slot.activePlayer.faction === "resistance" ? "Сопротивление" : "Конфедерация") + "</span></td><td>" + statusPill(slot.status) + "</td><td><button class=\"row-action\" type=\"button\" data-action=\"player-detail\" data-rank=\"" + slot.rank + "\">Карточка</button></td></tr>").join("");
  document.getElementById("players-tbody").innerHTML = body || "<tr><td colspan=\"6\"><div class=\"empty-state\">По этим фильтрам игроков не найдено.</div></td></tr>";
  const count = document.getElementById("player-result-count");
  if (count) count.textContent = rows.length + " из " + activePlayerCount();
  applyLocalization(document.getElementById("players-tbody"));
  if (count) applyLocalization(count);
}

function playersView() {
  const body = state.slots.map((slot) => "<tr><td class=\"seed-cell\">#" + slot.rank + "</td><td>" + playerCell(slot.activePlayer, slot.history.length ? "Резерв · исходный seed " + slot.rank : slot.source === "returning" ? "Возвращающийся победитель" : "Arena Qualifier") + "</td><td><span class=\"clan-name\" data-i18n-ignore>" + escapeHTML(displayClan(slot.activePlayer)) + "</span></td><td><span class=\"faction-label " + (slot.activePlayer.faction === "resistance" ? "resistance" : "") + "\">" + (slot.activePlayer.faction === "resistance" ? "Сопротивление" : "Конфедерация") + "</span></td><td>" + statusPill(slot.status) + "</td><td><button class=\"row-action\" type=\"button\" data-action=\"player-detail\" data-rank=\"" + slot.rank + "\">Карточка</button></td></tr>").join("");
  return demoStrip() + viewHeading("СОСТАВ", "УЧАСТНИКИ", "32 исторических образа для проверки состава, поиска и статусов приглашений.") +
    "<section class=\"card\"><div class=\"panel-heading\"><h2>РОСТЕР · 32 СЛОТА</h2><small>ПРИМЕР СОСТАВА · SUMMER DEMO</small></div><div class=\"toolbar\" style=\"padding:12px\"><input id=\"player-search\" type=\"search\" placeholder=\"Поиск игрока или клана\" aria-label=\"Поиск игрока или клана\"><select id=\"player-faction\" aria-label=\"Фильтр по фракции\"><option value=\"all\">Все фракции</option><option value=\"confederation\">Конфедерация</option><option value=\"resistance\">Сопротивление</option></select><select id=\"player-status\" aria-label=\"Фильтр по статусу\"><option value=\"all\">Все статусы</option><option value=\"confirmed\">Подтверждён</option><option value=\"invited\">Ожидает ответа</option><option value=\"declined\">Отклонено</option><option value=\"expired\">Истекло</option></select><span class=\"result-count\" id=\"player-result-count\">" + activePlayerCount() + " из " + activePlayerCount() + "</span></div><div class=\"table-wrap\"><table class=\"data-table\"><thead><tr><th>SEED</th><th>ИГРОК</th><th>КЛАН</th><th>ФРАКЦИЯ</th><th>СТАТУС</th><th></th></tr></thead><tbody id=\"players-tbody\">" + body + "</tbody></table></div></section><p class=\"small-note\" style=\"margin:10px 2px 0\">Имена и эмблемы взяты из исторических данных летнего турнира. Это демонстрационные записи, а не подтверждённый состав нового события.</p>";
}

function getMatchResult(match) {
  return match[4] || null;
}

function matchCard(match, round, index, extraClass = "") {
  const playerA = tournamentData.players[match[0]];
  const playerB = tournamentData.players[match[1]];
  const result = getMatchResult(match);
  const scoreA = result && result.scores ? result.scores[0] : "–";
  const scoreB = result && result.scores ? result.scores[1] : "–";
  const eliminatedA = Boolean(result && result.eliminated && result.eliminated[0]);
  const eliminatedB = Boolean(result && result.eliminated && result.eliminated[1]);
  const winnerA = result && result.eliminated && !result.eliminated[0];
  const winnerB = result && result.eliminated && !result.eliminated[1];
  const link = isSafeYouTubeUrl(match[2]) ? "<a class=\"vod-link\" href=\"" + escapeHTML(match[2]) + "\" target=\"_blank\" rel=\"noopener noreferrer\">VOD ↗</a>" : "<span>архив</span>";
  function matchPlayer(player, score, eliminated, winner) {
    return "<div class=\"match-player " + (eliminated ? "eliminated " : "") + (winner ? "winner" : "") + "\"><span class=\"mini-avatar\">" + escapeHTML(player.name.slice(0, 1)) + "<img src=\"" + escapeHTML(iconPath(player.name)) + "\" alt=\"\" loading=\"lazy\" onerror=\"this.remove()\"></span><span class=\"match-name\" data-i18n-ignore>" + escapeHTML(player.name) + "</span><span class=\"score\">" + escapeHTML(score) + "</span></div>";
  }
  return "<article class=\"match-card " + extraClass + "\">" + matchPlayer(playerA, scoreA, eliminatedA, winnerA) + matchPlayer(playerB, scoreB, eliminatedB, winnerB) + "<div class=\"match-card-foot\"><span>" + escapeHTML(round.format) + (result && result.status === "technicalLoss" ? " · тех. поражение" : result && result.status === "technicalSubstitution" ? " · тех. замена" : "") + "</span>" + link + "</div></article>";
}

function renderBracketRound(index) {
  const round = tournamentData.rounds[index];
  if (!round) return;
  mobileBracketRound = index;
  const list = document.getElementById("mobile-match-list");
  if (list) {
    list.innerHTML = round.matches.map((match, matchIndex) => matchCard(match, round, matchIndex)).join("");
    applyLocalization(list);
  }
  document.querySelectorAll(".round-tab").forEach((button) => {
    const selected = Number(button.dataset.round) === index;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-selected", selected ? "true" : "false");
  });
}

function bracketView() {
  const columns = tournamentData.rounds.map((round, roundIndex) => "<section class=\"round-column\"><div class=\"round-header\"><span>" + escapeHTML(round.title) + "</span><small>" + escapeHTML(round.format) + " · " + round.matches.length + " МАТЧЕЙ</small></div>" + round.matches.map((match, matchIndex) => matchCard(match, round, matchIndex, roundIndex === 4 ? "final-match" : "")).join("") + "</section>").join("");
  const tabs = tournamentData.rounds.map((round, index) => "<button class=\"round-tab " + (index === mobileBracketRound ? "active" : "") + "\" type=\"button\" data-action=\"bracket-round\" data-round=\"" + index + "\" role=\"tab\" aria-selected=\"" + (index === mobileBracketRound ? "true" : "false") + "\">" + escapeHTML(round.title) + "</button>").join("");
  const bronze = tournamentData.thirdPlace.match;
  return demoStrip() + viewHeading("ИСТОРИЧЕСКИЙ МАТЧ-АРХИВ", "ТУРНИРНАЯ СЕТКА", "Результаты летнего сезона с записями доступных трансляций.") +
    "<div class=\"bracket-note\"><span>◈</span><span><strong>Исторический пример сетки.</strong> Эта сетка летнего турнира независима от демонстрационного списка приглашений и его локальных статусов.</span></div><section class=\"card card-pad\"><div class=\"bracket-scroll\"><div class=\"bracket-full\">" + columns + "</div></div><div class=\"mobile-bracket\"><div class=\"mobile-round-tabs\" role=\"tablist\" aria-label=\"Раунды турнира\">" + tabs + "</div><div class=\"mobile-match-list\" id=\"mobile-match-list\"></div></div><div class=\"bronze-panel\"><div><h3>Матч за 3-е место</h3><p>Летний архив · формат BO1</p></div><div class=\"match-card\">" + matchCard(bronze, { format: "BO1" }, 0) + "</div></div></section>";
}

function isSafeYouTubeUrl(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    return url.protocol === "https:" && (host === "youtube.com" || host.endsWith(".youtube.com") || host === "youtu.be");
  } catch (error) {
    return false;
  }
}

function streamsView() {
  const streams = tournamentData.rounds[0].matches.map((match, index) => ({ match, index })).filter(({ match }) => isSafeYouTubeUrl(match[2]));
  const cards = streams.map(({ match, index }) => {
    const first = tournamentData.players[match[0]].name;
    const second = tournamentData.players[match[1]].name;
    return "<a class=\"stream-card\" href=\"" + escapeHTML(match[2]) + "\" target=\"_blank\" rel=\"noopener noreferrer\"><span class=\"stream-top\"><span>ЛЕТНИЙ АРХИВ · 1/16</span><span>MATCH " + String(index + 1).padStart(2, "0") + "</span></span><span class=\"stream-play\">▷</span><strong data-i18n-ignore>" + escapeHTML(first + " vs " + second) + "</strong><small>Открыть запись на YouTube ↗</small></a>";
  }).join("");
  return demoStrip() + viewHeading("АРХИВ · YOUTUBE", "ТРАНСЛЯЦИИ", "Записи матчей первого раунда летнего сезона из предоставленного архива.") +
    "<div class=\"stream-filter\"><p>Ссылки ведут на YouTube и открываются в новой вкладке.</p><span class=\"source-pill\">" + streams.length + " ИСТОРИЧЕСКИХ ЗАПИСЕЙ</span></div><section class=\"stream-grid\">" + cards + "</section>";
}

function clansView() {
  const ranking = tournamentData.ranking.slice().filter((record) => record.clan).sort((left, right) => right.points - left.points || left.clan.localeCompare(right.clan));
  const leaders = ranking.slice(0, 3).map((record, index) => "<article class=\"leader-card\" data-rank=\"0" + (index + 1) + "\"><div class=\"leader-rank\">0" + (index + 1) + " / SUMMER</div><div class=\"leader-clan\" data-i18n-ignore>" + escapeHTML(record.clan) + "</div><div class=\"leader-player\"><span>Игрок: </span><span data-i18n-ignore>" + escapeHTML(record.players.join(", ")) + "</span></div><div class=\"leader-points\">" + record.points + "<small>очков</small></div></article>").join("");
  const rows = ranking.map((record, index) => "<tr><td><span class=\"rank-number\">#" + (index + 1) + "</span></td><td><span class=\"clan-name\" data-i18n-ignore>" + escapeHTML(record.clan) + "</span></td><td data-i18n-ignore>" + escapeHTML(record.players.join(", ")) + "</td><td><span class=\"points-number\">" + record.points + "</span></td></tr>").join("");
  const points = tournamentData.points.map(([label, value]) => "<span>" + escapeHTML(label) + " · <strong>" + escapeHTML(value) + "</strong></span>").join("");
  return demoStrip() + viewHeading("КЛАНОВЫЙ ЗАЛ", "РЕЙТИНГ КЛАНОВ", "Очки и места из исторической таблицы SUMMER, сохранённой для этого превью.") +
    "<section class=\"leaderboard\">" + leaders + "</section><section class=\"card\"><div class=\"panel-heading\"><h2>ТАБЛИЦА КЛАНОВ</h2><small>ИСТОРИЧЕСКИЕ ОЧКИ · SUMMER</small></div><div class=\"table-wrap\"><table class=\"data-table\"><thead><tr><th>МЕСТО</th><th>КЛАН</th><th>ПРЕДСТАВИТЕЛЬ</th><th>ОЧКИ</th></tr></thead><tbody>" + rows + "</tbody></table></div></section><section class=\"panel\" style=\"margin-top:14px\"><div class=\"panel-heading\"><h2>ШКАЛА ОЧКОВ</h2><small>ЗА РЕЗУЛЬТАТ ТУРНИРА</small></div><div class=\"points-key\">" + points + "</div></section><p class=\"small-note\" style=\"margin-top:9px\">Рейтинг и баллы относятся к летнему сезону. Они не определяют места или приглашения в текущем превью.</p>";
}

function adminRows() {
  const query = String(document.getElementById("admin-search")?.value || "").trim().toLowerCase();
  const filter = document.getElementById("admin-status")?.value || "all";
  const slots = state.slots.filter((slot) => {
    const haystack = (slot.activePlayer.name + " " + slot.activePlayer.clan + " " + slot.seedPlayer).toLowerCase();
    return (!query || haystack.includes(query)) && (filter === "all" || slot.status === filter);
  });
  const body = slots.map((slot) => {
    const record = slot.activePlayer;
    const wasReplaced = slot.history.length > 0;
    const actions = "<div class=\"admin-actions\"><button class=\"row-action\" type=\"button\" data-action=\"slot-detail\" data-rank=\"" + slot.rank + "\">Подробнее</button>" + (slot.status === "declined" || slot.status === "expired" ? "<button class=\"row-action\" type=\"button\" data-action=\"open-reserve\" data-rank=\"" + slot.rank + "\">Назначить резерв</button>" : "") + "</div>";
    const oldStatus = wasReplaced ? "<small class=\"reserve-name\"><span>Ранее: </span><span data-i18n-ignore>" + escapeHTML(slot.history[slot.history.length - 1].player.name) + "</span> · " + escapeHTML(statusNames[slot.history[slot.history.length - 1].status]) + "</small>" : "";
    return "<tr><td class=\"seed-cell\">#" + slot.rank + "</td><td>" + playerCell(record, wasReplaced ? "Резерв · исходный seed #" + slot.rank : slot.source === "returning" ? "Возвращающийся победитель" : "Arena Qualifier") + oldStatus + "</td><td>" + sourcePill(slot.source) + "</td><td>" + statusPill(slot.status) + "</td><td>" + actions + "</td></tr>";
  }).join("");
  document.getElementById("admin-tbody").innerHTML = body || "<tr><td colspan=\"5\"><div class=\"empty-state\">Поиск не нашёл подходящих приглашений.</div></td></tr>";
  const count = document.getElementById("admin-result-count");
  if (count) count.textContent = slots.length + " из 32";
  applyLocalization(document.getElementById("admin-tbody"));
  if (count) applyLocalization(count);
}

function adminView() {
  const counts = countStatuses();
  const used = new Set(state.slots.map((slot) => slot.activePlayer.id));
  const reserveCards = reserveRecords.map((player) => "<div class=\"reserve-card\"><strong data-i18n-ignore>" + escapeHTML(player.name) + "</strong><small>" + (used.has(player.id) ? "назначен в слот" : "свободен для демонстрации") + "</small></div>").join("");
  const rows = state.slots.map((slot) => "<tr><td class=\"seed-cell\">#" + slot.rank + "</td><td>" + playerCell(slot.activePlayer, slot.source === "returning" ? "Возвращающийся победитель" : "Arena Qualifier") + "</td><td>" + sourcePill(slot.source) + "</td><td>" + statusPill(slot.status) + "</td><td><button class=\"row-action\" type=\"button\" data-action=\"slot-detail\" data-rank=\"" + slot.rank + "\">Подробнее</button>" + (slot.status === "declined" || slot.status === "expired" ? " <button class=\"row-action\" type=\"button\" data-action=\"open-reserve\" data-rank=\"" + slot.rank + "\">Назначить резерв</button>" : "") + "</td></tr>").join("");
  return demoStrip() + viewHeading("ОРГАНИЗАТОР", "ПРИГЛАШЕНИЯ", "Локальная таблица слотов, статусов и демонстрация замены резервом.", "<button class=\"button button-secondary button-small\" type=\"button\" data-action=\"export-csv\">Экспорт CSV ↗</button>") +
    "<div class=\"admin-banner\"><b>!</b><span><strong>Панель работает локально.</strong> Записи — исторические примеры; приглашения, замены и CSV не отправляются во внешние сервисы. Исходный seed каждого слота остаётся прежним.</span></div><section class=\"admin-summary\">" + metric("ВСЕ АКТИВНЫЕ СЛОТЫ", activePlayerCount(), "из 32", "⌘") + metric("ПОДТВЕРЖДЕНЫ", counts.confirmed, "игроков", "✓") + metric("ОЖИДАЮТ", counts.invited, "ответа", "◷") + metric("ОТКАЗ / СРОК", counts.declined + counts.expired, "записей", "↻") + "</section><section class=\"card\"><div class=\"panel-heading\"><h2>РЕЗЕРВНЫЙ СОСТАВ</h2><small>4 ОБРАЗЦА ДЛЯ ЗАМЕНЫ</small></div><div class=\"reserve-list\">" + reserveCards + "</div></section><section class=\"card admin-table\" style=\"margin-top:13px\"><div class=\"panel-heading\"><h2>32 ПЕРСОНАЛЬНЫХ СЛОТА</h2><small>ARENA QUALIFIER + RETURNING INVITEES</small></div><div class=\"toolbar\" style=\"padding:11px\"><input id=\"admin-search\" type=\"search\" placeholder=\"Поиск по игроку или клану\" aria-label=\"Поиск по игроку или клану\"><select id=\"admin-status\" aria-label=\"Фильтр статуса\"><option value=\"all\">Все статусы</option><option value=\"confirmed\">Подтверждён</option><option value=\"invited\">Ожидает ответа</option><option value=\"declined\">Отклонено</option><option value=\"expired\">Истекло</option></select><span class=\"result-count\" id=\"admin-result-count\">32 из 32</span></div><div class=\"table-wrap\"><table class=\"data-table\"><thead><tr><th>SEED</th><th>ИГРОК / ИСТОРИЯ</th><th>ИСТОЧНИК СЛОТА</th><th>СТАТУС</th><th>ДЕЙСТВИЯ · ДЕМО</th></tr></thead><tbody id=\"admin-tbody\">" + rows + "</tbody></table></div></section>";
}

function renderChatMessages() {
  if (!state.chat.length) return "<div class=\"empty-state\">Здесь пока нет сообщений. Они видны только в этой демо-сессии.</div>";
  return state.chat.map((item) => "<div class=\"chat-message mine\"><span data-i18n-ignore>" + escapeHTML(item.text) + "</span><time>" + escapeHTML(new Date(item.time).toLocaleTimeString(language === "en" ? "en-GB" : "ru-RU", { hour: "2-digit", minute: "2-digit" })) + " · local</time></div>").join("");
}

function render() {
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === activeView);
  });
  document.getElementById("breadcrumb-current").textContent = views[activeView] || views.overview;
  document.getElementById("user-pill-label").textContent = state.authenticated ? "Hero Dominator" : "Гость";
  const viewRenderers = {
    overview: heroView,
    cabinet: cabinetView,
    players: playersView,
    bracket: bracketView,
    streams: streamsView,
    clans: clansView,
    admin: adminView
  };
  page.innerHTML = (viewRenderers[activeView] || heroView)();
  if (activeView === "bracket") renderBracketRound(mobileBracketRound);
  applyLocalization();
  if (activeView === "cabinet" && state.authenticated && state.slots.some((slot) => slot.history.length)) DebugLogger.log("cabinet_replacement_visible", { slotCount: state.slots.filter((slot) => slot.history.length).length });
  document.body.classList.remove("menu-open");
  document.querySelector(".menu-trigger")?.setAttribute("aria-expanded", "false");
}

function showView(view) {
  if (!Object.prototype.hasOwnProperty.call(views, view)) return;
  activeView = view;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
  DebugLogger.log("view_opened", { view });
}

function openModal(markup, trigger = document.activeElement) {
  lastModalTrigger = trigger;
  modalContent.innerHTML = markup;
  if (!modal.open) modal.showModal();
  applyLocalization(modalContent);
  const first = modal.querySelector("button, input, select, textarea");
  if (first) first.focus();
}

function modalHeader(title, subtitle) {
  return "<div class=\"modal-head\"><div><h2 id=\"modal-title\">" + escapeHTML(title) + "</h2><p>" + escapeHTML(subtitle) + "</p></div><button class=\"modal-close\" type=\"button\" data-action=\"close-modal\" aria-label=\"Закрыть\">×</button></div>";
}

function authModal() {
  openModal(modalHeader("Демо-вход", "Выберите способ входа для просмотра кабинета.") +
    "<div class=\"modal-body\"><div class=\"auth-options\"><button class=\"auth-option\" type=\"button\" data-action=\"demo-sign-in\" data-provider=\"Discord\"><span class=\"auth-logo\">D</span><span><strong>Продолжить с Discord</strong><small>Демо-сессия · Hero Dominator</small></span></button><button class=\"auth-option\" type=\"button\" data-action=\"demo-sign-in\" data-provider=\"Telegram\"><span class=\"auth-logo\">T</span><span><strong>Продолжить с Telegram</strong><small>Демо-сессия · Hero Dominator</small></span></button></div><div class=\"demo-disclaimer\">Демонстрация входа; аккаунт не подключается. OAuth, токены и внешние запросы отсутствуют.</div></div>");
  DebugLogger.log("demo_auth_opened", {});
}

function signIn(provider) {
  state.authenticated = true;
  persistState();
  modal.close();
  DebugLogger.log("demo_sign_in", { provider: provider, demoPlayer: "Hero Dominator" });
  showView("cabinet");
}

function confirmInvitation() {
  const slot = getFeaturedSlot();
  if (!slot || slot.status !== "invited") {
    DebugLogger.log("invitation_confirmation_skipped", { status: slot && slot.status });
    return;
  }
  const checkbox = document.getElementById("accept-rules");
  if (!checkbox || !checkbox.checked) return;
  slot.status = "confirmed";
  persistState();
  DebugLogger.log("invitation_confirmed", { player: "Hero Dominator", seed: slot.rank });
  render();
}

function declineModal() {
  const slot = getFeaturedSlot();
  if (!slot || slot.status !== "invited") return;
  openModal(modalHeader("Отклонить приглашение?", "Действие обновит только локальный демо-статус.") +
    "<div class=\"modal-body\"><p class=\"muted\" style=\"margin-top:0;font-size:11px\">Приглашение Hero Dominator будет отмечено как отклонённое. Организатор сможет выбрать этот слот для демонстрации замены; seed #" + slot.rank + " сохранится.</p><label class=\"confirm-rule modal-check\"><input id=\"decline-confirm\" type=\"checkbox\"><span>Подтверждаю демонстрационный отказ.</span></label><div class=\"demo-disclaimer\">Запись не отправляется организаторам или игровому серверу.</div></div><div class=\"modal-foot\"><button class=\"button button-quiet\" type=\"button\" data-action=\"close-modal\">Назад</button><button class=\"button button-danger\" type=\"button\" data-action=\"confirm-decline\" disabled id=\"confirm-decline\">Отклонить</button></div>");
}

function confirmDecline() {
  const slot = getFeaturedSlot();
  const checkbox = document.getElementById("decline-confirm");
  if (!slot || slot.status !== "invited" || !checkbox || !checkbox.checked) return;
  slot.status = "declined";
  persistState();
  modal.close();
  DebugLogger.log("invitation_declined", { player: "Hero Dominator", seed: slot.rank });
  render();
}

function showPlayerDetail(rank) {
  const slot = state.slots.find((item) => item.rank === Number(rank));
  if (!slot) return;
  const history = slot.history.length ? slot.history.map((item) => "<div class=\"dialog-status\">Предыдущая запись: <strong data-i18n-ignore>" + escapeHTML(item.player.name) + "</strong> · " + escapeHTML(statusNames[item.status]) + " · seed #" + slot.rank + "</div>").join("") : "";
  openModal(modalHeader("Карточка участника", "Слот #" + slot.rank + " · локальные демо-данные") +
    "<div class=\"modal-body\"><div class=\"profile-hero\">" + avatar(slot.activePlayer.name, "profile-avatar") + "<div class=\"profile-info\"><h2 data-i18n-ignore>" + escapeHTML(slot.activePlayer.name) + "</h2><p data-i18n-ignore>" + escapeHTML(displayClan(slot.activePlayer)) + "</p></div></div><div class=\"detail-grid\" style=\"margin-top:12px\"><div class=\"detail-cell\"><small>Seed</small><strong>#" + slot.rank + " · исходный ранг сохраняется</strong></div><div class=\"detail-cell\"><small>Источник слота</small><strong>" + (slot.source === "returning" ? "Возвращающийся победитель" : "Arena Qualifier") + "</strong></div><div class=\"detail-cell\"><small>Фракция</small><strong>" + (slot.activePlayer.faction === "resistance" ? "Сопротивление" : "Конфедерация") + "</strong></div><div class=\"detail-cell\"><small>Статус</small><strong>" + escapeHTML(statusNames[slot.status]) + "</strong></div></div>" + history + "<div class=\"demo-disclaimer\">Это демонстрационная запись на основе исторического имени летнего сезона.</div></div><div class=\"modal-foot\"><button class=\"button button-secondary button-small\" type=\"button\" data-action=\"close-modal\">Закрыть</button></div>");
  DebugLogger.log("player_detail_opened", { rank: slot.rank, player: slot.activePlayer.name });
}

function showSlotDetail(rank) {
  const slot = state.slots.find((item) => item.rank === Number(rank));
  if (!slot) return;
  const previous = slot.history.map((item) => "<div class=\"dialog-status\">Слот # " + slot.rank + " · <span data-i18n-ignore>" + escapeHTML(item.player.name) + "</span> · " + escapeHTML(statusNames[item.status]) + "</div>").join("");
  openModal(modalHeader("Детали приглашения", "Слот #" + slot.rank + " · организаторская демо-панель") +
    "<div class=\"modal-body\"><div class=\"detail-grid\"><div class=\"detail-cell\"><small>Текущий игрок</small><strong data-i18n-ignore>" + escapeHTML(slot.activePlayer.name) + "</strong></div><div class=\"detail-cell\"><small>Статус</small><strong>" + escapeHTML(statusNames[slot.status]) + "</strong></div><div class=\"detail-cell\"><small>Seed</small><strong>#" + slot.rank + " · исходный слот не перенумеровывается</strong></div><div class=\"detail-cell\"><small>Источник</small><strong>" + (slot.source === "returning" ? "Возвращающийся победитель" : "Arena Qualifier") + "</strong></div></div>" + (previous || "<div class=\"dialog-status\">История замен пока пуста.</div>") + "<div class=\"demo-disclaimer\">Только демо: в реальной системе детали и статусы будут синхронизироваться с сервисом приглашений.</div></div><div class=\"modal-foot\"><button class=\"button button-secondary button-small\" type=\"button\" data-action=\"close-modal\">Закрыть</button></div>");
  DebugLogger.log("invitation_detail_opened", { rank: slot.rank });
}

function openReserveDialog(rank) {
  const slot = state.slots.find((item) => item.rank === Number(rank));
  if (!slot || !["declined", "expired"].includes(slot.status)) return;
  const used = new Set(state.slots.map((item) => item.activePlayer.id));
  const available = reserveRecords.filter((record) => !used.has(record.id));
  if (!available.length) {
    openModal(modalHeader("Нет свободного резерва", "Все четыре демонстрационных образца уже назначены.") +
      "<div class=\"modal-body\"><div class=\"dialog-status\">Слоты остаются без изменений. Сбросьте демо-данные, чтобы начать пример заново.</div></div><div class=\"modal-foot\"><button class=\"button button-secondary button-small\" type=\"button\" data-action=\"close-modal\">Закрыть</button></div>");
    DebugLogger.log("reserve_assignment_unavailable", { rank: slot.rank });
    return;
  }
  const options = available.map((record) => "<option class=\"reserve-player-option\" data-reserve-id=\"" + escapeHTML(record.id) + "\" value=\"" + escapeHTML(record.id) + "\">" + escapeHTML(record.name) + " · " + (record.faction === "resistance" ? "Сопротивление" : "Конфедерация") + "</option>").join("");
  openModal(modalHeader("Назначить резерв", "Выберите образец и отдельно подтвердите замену.") +
    "<div class=\"modal-body\"><div class=\"detail-grid\"><div class=\"detail-cell\"><small>Текущий слот</small><strong>#" + slot.rank + " · <span data-i18n-ignore>" + escapeHTML(slot.activePlayer.name) + "</span></strong></div><div class=\"detail-cell\"><small>Причина</small><strong>" + escapeHTML(statusNames[slot.status]) + "</strong></div><div class=\"detail-cell\"><small>Исходный seed</small><strong>#" + slot.rank + " · останется неизменным</strong></div><div class=\"detail-cell\"><small>Сохранится в истории</small><strong><span data-i18n-ignore>" + escapeHTML(slot.activePlayer.name) + "</span> · " + escapeHTML(statusNames[slot.status]) + "</strong></div></div><label class=\"small-note\" for=\"reserve-player-select\">Образец резервного игрока</label><select class=\"modal-select\" id=\"reserve-player-select\">" + options + "</select><label class=\"confirm-rule modal-check\"><input id=\"reserve-confirm\" type=\"checkbox\"><span>Подтверждаю локальную замену в выбранном слоте.</span></label><div class=\"demo-disclaimer\">Резерв занимает активное место, поэтому сетка остаётся на 32 слота. Предыдущая запись остаётся в истории слота.</div></div><div class=\"modal-foot\"><button class=\"button button-quiet\" type=\"button\" data-action=\"close-modal\">Отмена</button><button class=\"button button-primary\" type=\"button\" data-action=\"confirm-reserve\" data-rank=\"" + slot.rank + "\" disabled id=\"confirm-reserve\">Назначить в слот #" + slot.rank + "</button></div>");
  DebugLogger.log("reserve_assignment_opened", { rank: slot.rank, available: available.length });
}

function confirmReserve(rank) {
  const slot = state.slots.find((item) => item.rank === Number(rank));
  const select = document.getElementById("reserve-player-select");
  const checkbox = document.getElementById("reserve-confirm");
  if (!slot || !["declined", "expired"].includes(slot.status) || !select || !checkbox || !checkbox.checked) return;
  const used = new Set(state.slots.map((item) => item.activePlayer.id));
  const reserve = reserveRecords.find((record) => record.id === select.value && !used.has(record.id));
  if (!reserve) return;
  slot.history.push({ player: slot.activePlayer, status: slot.status });
  slot.activePlayer = reserve;
  slot.status = "invited";
  persistState();
  modal.close();
  DebugLogger.log("reserve_assigned", { rank: slot.rank, seedPlayer: slot.seedPlayer, reserve: reserve.name, previousStatus: slot.history[slot.history.length - 1].status, activeSlots: state.slots.length });
  render();
}

function resetDemo() {
  state = createDefaultState();
  persistState();
  activeView = "overview";
  if (modal.open) modal.close();
  DebugLogger.log("demo_reset", { activeSlots: state.slots.length });
  render();
}

function exportCsv() {
  const rows = [["seed", "player", "clan", "faction", "source", "status", "history"]];
  state.slots.forEach((slot) => {
    const prior = slot.history.map((item) => item.player.name + " (" + translateText(statusNames[item.status]) + ")").join(" | ");
    rows.push([slot.rank, slot.activePlayer.name, displayClan(slot.activePlayer), slot.activePlayer.faction, slot.source, translateText(statusNames[slot.status]), prior]);
  });
  const csv = "\uFEFF" + rows.map((row) => row.map((cell) => "\"" + String(cell).replace(/"/g, "\"\"") + "\"").join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "aow-masters-preview-invitations.csv";
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  DebugLogger.log("csv_exported", { rows: state.slots.length });
}

function sendChat(form) {
  if (!state.authenticated || getFeaturedSlot().status !== "confirmed") return;
  const input = form.elements.message;
  const text = String(input.value || "").trim();
  if (!text) return;
  state.chat.push({ text: text.slice(0, 500), time: Date.now() });
  state.chat = state.chat.slice(-30);
  persistState();
  DebugLogger.log("local_chat_message", { length: Math.min(text.length, 500), messageCount: state.chat.length });
  render();
  const chat = document.getElementById("chat-messages");
  if (chat) chat.scrollTop = chat.scrollHeight;
}

document.addEventListener("click", (event) => {
  const viewButton = event.target.closest("[data-view]");
  if (viewButton) {
    event.preventDefault();
    showView(viewButton.dataset.view);
    return;
  }
  const action = event.target.closest("[data-action]");
  if (!action) return;
  const name = action.dataset.action;
  if (name === "open-auth") authModal();
  else if (name === "demo-sign-in") signIn(action.dataset.provider || "unknown");
  else if (name === "close-modal") modal.close();
  else if (name === "confirm-invitation") confirmInvitation();
  else if (name === "open-decline") declineModal();
  else if (name === "confirm-decline") confirmDecline();
  else if (name === "player-detail") showPlayerDetail(action.dataset.rank);
  else if (name === "slot-detail") showSlotDetail(action.dataset.rank);
  else if (name === "open-reserve") openReserveDialog(action.dataset.rank);
  else if (name === "confirm-reserve") confirmReserve(action.dataset.rank);
  else if (name === "toggle-language") setLanguage(language === "en" ? "ru" : "en");
  else if (name === "reset-demo") resetDemo();
  else if (name === "export-csv") exportCsv();
  else if (name === "sign-out") {
    state.authenticated = false;
    persistState();
    DebugLogger.log("demo_sign_out", {});
    render();
  } else if (name === "toggle-menu") {
    document.body.classList.toggle("menu-open");
    action.setAttribute("aria-expanded", document.body.classList.contains("menu-open") ? "true" : "false");
  } else if (name === "close-menu") {
    document.body.classList.remove("menu-open");
    document.querySelector(".menu-trigger")?.setAttribute("aria-expanded", "false");
  } else if (name === "bracket-round") {
    renderBracketRound(Number(action.dataset.round));
  }
});

document.addEventListener("input", (event) => {
  if (event.target.id === "player-search" || event.target.id === "player-faction" || event.target.id === "player-status") participantRows();
  if (event.target.id === "admin-search" || event.target.id === "admin-status") adminRows();
  if (event.target.id === "accept-rules") {
    const button = document.getElementById("confirm-invitation");
    if (button) button.disabled = !event.target.checked;
  }
  if (event.target.id === "decline-confirm") {
    const button = document.getElementById("confirm-decline");
    if (button) button.disabled = !event.target.checked;
  }
  if (event.target.id === "reserve-confirm" || event.target.id === "reserve-player-select") {
    const checkbox = document.getElementById("reserve-confirm");
    const button = document.getElementById("confirm-reserve");
    if (checkbox && button) button.disabled = !checkbox.checked || !event.target.value;
  }
});

document.addEventListener("change", (event) => {
  if (event.target.id === "player-faction" || event.target.id === "player-status") participantRows();
  if (event.target.id === "admin-status") adminRows();
  if (event.target.id === "schedule-select") {
    if (scheduleOptions.some(([key]) => key === event.target.value)) {
      state.schedule = event.target.value;
      persistState();
      DebugLogger.log("schedule_selected", { option: event.target.value });
    }
  }
});

document.addEventListener("submit", (event) => {
  if (event.target.id === "chat-form") {
    event.preventDefault();
    sendChat(event.target);
  }
});

modal.addEventListener("close", () => {
  if (lastModalTrigger && document.contains(lastModalTrigger)) lastModalTrigger.focus();
  lastModalTrigger = null;
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) modal.close();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.body.classList.contains("menu-open")) {
    document.body.classList.remove("menu-open");
    document.querySelector(".menu-trigger")?.setAttribute("aria-expanded", "false");
  }
});

render();
DebugLogger.log("preview_ready", { players: playerRecords.length, activeSlots: state.slots.length, statusCounts: countStatuses() });
