(function (root) {
  const pairs = [
    ['Локальное интерактивное превью турнира Art of War Masters.', 'Local interactive preview of the Art of War Masters tournament.'],
    ['Art of War Masters — турнирное превью', 'Art of War Masters — Tournament Preview'],
    ['Art of War Masters — обзор', 'Art of War Masters — overview'],
    ['ПРОТОКОЛ · 32 СЛОТА', 'PROTOCOL · 32 SLOTS'],
    ['ТУРНИР', 'TOURNAMENT'],
    ['Разделы турнира', 'Tournament sections'],
    ['Обзор', 'Overview'],
    ['ОБЗОР', 'OVERVIEW'],
    ['Моё участие', 'My Entry'],
    ['МОЁ УЧАСТИЕ', 'MY ENTRY'],
    ['Участники', 'Players'],
    ['УЧАСТНИКИ', 'PLAYERS'],
    ['Сетка', 'Bracket'],
    ['СЕТКА', 'BRACKET'],
    ['Трансляции', 'Streams'],
    ['ТРАНСЛЯЦИИ', 'STREAMS'],
    ['Кланы', 'Clans'],
    ['КЛАНЫ', 'CLANS'],
    ['ОРГАНИЗАЦИЯ', 'ORGANIZATION'],
    ['Приглашения', 'Invitations'],
    ['ПРИГЛАШЕНИЯ', 'INVITATIONS'],
    ['ДЕМО', 'DEMO'],
    ['Сбросить демо-данные', 'Reset demo data'],
    ['Локальное превью', 'Local preview'],
    ['Открыть меню', 'Open menu'],
    ['СЕЗОН · PREVIEW', 'SEASON · PREVIEW'],
    ['Гость', 'Guest'],
    ['ИНТЕРАКТИВНОЕ ПРЕВЬЮ', 'INTERACTIVE PREVIEW'],
    ['Данные летнего сезона · статусы и действия сохраняются только в этом браузере', 'Summer season data · statuses and actions are saved in this browser only'],
    ['Состав превью', 'Preview roster'],
    ['Ожидает ответа', 'Awaiting response'],
    ['Подтверждён', 'Confirmed'],
    ['Отклонено', 'Declined'],
    ['Истекло', 'Expired'],
    ['Нет статуса', 'No status'],
    ['Открыть кабинет', 'Open player cabinet'],
    ['Открыть сетку', 'Open bracket'],
    ['Посмотреть приглашение', 'View invitation'],
    ['32 игрока. Один чемпион. Победители прошлого сезона и лучшие бойцы Arena Qualifier встретятся в дуэлях один на один.', '32 players. One champion. Last season’s winners and the top Arena Qualifier fighters will meet in one-on-one duels.'],
    ['32 ИГРОКА', '32 PLAYERS'],
    ['30 МЕСТ · ARENA QUALIFIER', '30 PLACES · ARENA QUALIFIER'],
    ['2 ВОЗВРАЩАЮЩИХСЯ ПОБЕДИТЕЛЯ', '2 RETURNING CHAMPIONS'],
    ['ПЕРСОНАЛЬНЫЙ СТАТУС', 'PERSONAL STATUS'],
    ['Пример приглашения · seed сохраняется', 'Invitation example · seed is preserved'],
    ['Продолжить в кабинете', 'Continue to cabinet'],
    ['Действия по приглашению', 'Invitation actions'],
    ['Публичной регистрации нет · состав готовит организатор', 'There is no public registration · the organizer prepares the roster'],
    ['СЛОТОВ В СЕТКЕ', 'BRACKET SLOTS'],
    ['участника', 'players'],
    ['ПОДТВЕРДИЛИ', 'CONFIRMED'],
    ['ПОДТВЕРЖДЕНЫ', 'CONFIRMED'],
    ['готовы играть', 'ready to play'],
    ['ЖДУТ ОТВЕТА', 'AWAITING REPLY'],
    ['приглашения', 'invitations'],
    ['МАТЧЕЙ', 'MATCHES'],
    ['на пути к титулу', 'on the road to the title'],
    ['ФОРМАТ ТУРНИРА', 'TOURNAMENT FORMAT'],
    ['КАРТА МАТЧЕЙ', 'MATCH ROADMAP'],
    ['Раунд 32 · BO1', 'Round of 32 · BO1'],
    ['Раунд 16 · BO1', 'Round of 16 · BO1'],
    ['Четвертьфинал · BO1', 'Quarterfinals · BO1'],
    ['Полуфинал и финал · BO3', 'Semifinals and final · BO3'],
    ['+ матч за 3-е место · BO1', '+ third-place match · BO1'],
    ['32 матча в сетке', '32 matches in the bracket'],
    ['РАЗДЕЛЫ', 'SECTIONS'],
    ['БЫСТРЫЙ ДОСТУП', 'QUICK ACCESS'],
    ['Состав участников', 'Player roster'],
    ['Поиск и фильтры состава', 'Search and roster filters'],
    ['Архив трансляций', 'Stream archive'],
    ['Записи летнего турнира', 'Summer tournament recordings'],
    ['Клановый рейтинг', 'Clan rankings'],
    ['Исторические очки SUMMER', 'Historical SUMMER points'],
    ['УЧАСТНИК', 'PLAYER'],
    ['Личный кабинет приглашённого игрока и ответы по заявке.', 'Invited player cabinet and invitation response.'],
    ['Войти в кабинет', 'Sign in to your cabinet'],
    ['Откройте демонстрационную сессию, чтобы посмотреть приглашение Hero Dominator, подтвердить участие, выбрать пример времени и написать сообщение в локальный чат.', 'Open a demo session to view Hero Dominator’s invitation, confirm participation, choose a sample time, and send a message in the local chat.'],
    ['Войти через Discord или Telegram', 'Continue with Discord or Telegram'],
    ['Демонстрация входа; аккаунт не подключается и данные не отправляются.', 'Demo sign-in; no account is connected and no data is sent.'],
    ['Статус приглашения, матч-превью и локальные настройки демо-сессии.', 'Invitation status, match preview, and local demo session settings.'],
    ['Вам доступно место в турнирном составе', 'A place in the tournament roster is available to you'],
    ['Я ознакомился(лась) с правилами и подтверждаю участие в демонстрационном составе.', 'I have read the rules and confirm my participation in the demo roster.'],
    ['Подтвердить участие', 'Confirm participation'],
    ['Отклонить приглашение', 'Decline invitation'],
    ['Участие подтверждено', 'Participation confirmed'],
    ['Подтверждение сохранено в демо-сессии этого браузера.', 'Your confirmation is saved in this browser’s demo session.'],
    ['Открыть список участников', 'Open player list'],
    ['Посмотреть сетку', 'View bracket'],
    ['Приглашение отклонено', 'Invitation declined'],
    ['Срок ответа на приглашение истёк', 'The invitation response deadline has passed'],
    ['Слот и исходный seed доступны организатору для демонстрации замены резервом.', 'The slot and original seed are available to the organizer to demonstrate a reserve replacement.'],
    ['Вернуть исходные демо-данные', 'Restore original demo data'],
    ['ВАШ СЛЕДУЮЩИЙ МАТЧ · ПРИМЕР', 'YOUR NEXT MATCH · SAMPLE'],
    ['Соперник назначается', 'Opponent to be assigned'],
    ['После подтверждения состава', 'After roster confirmation'],
    ['Турнирная сетка превью', 'Preview tournament bracket'],
    ['Удобное время', 'Preferred time'],
    ['Вариант A · 18:00', 'Option A · 18:00'],
    ['Вариант B · 19:30', 'Option B · 19:30'],
    ['Вариант C · 21:00', 'Option C · 21:00'],
    ['Локальный пример · без даты и записи на сервере', 'Local example · no date or server-side booking'],
    ['Правило будущего расписания', 'Future scheduling rule'],
    ['Правило будущего расписания:', 'Future scheduling rule:'],
    ['В полной системе оба игрока выберут общий доступный слот до дедлайна; организатор разрешит конфликт, если предпочтения не совпадут. Эти элементы управления показывают только локальный пример для одного игрока и не подтверждают время матча.', 'In the full system, both players must agree on an available slot before the deadline. If they cannot agree, tournament staff will resolve the schedule. These controls are a local example for one player only; they do not confirm a match time.'],
    ['В полной системе оба игрока выберут общий доступный слот до дедлайна; организатор разрешит конфликт, если предпочтения не совпадут.', 'In the full system, both players will choose a shared available slot before the deadline; the organizer will resolve any conflict if their preferences do not match.'],
    ['Эти элементы управления показывают только локальный пример для одного игрока и не подтверждают время матча.', 'These controls show a local example for one player only and do not confirm a match time.'],
    ['ЧАТ МАТЧА', 'MATCH CHAT'],
    ['Сообщения остаются в этом браузере и не отправляются другим игрокам.', 'Messages stay in this browser and are not sent to other players.'],
    ['Сообщение в демо-чат…', 'Message in demo chat…'],
    ['Отправить', 'Send'],
    ['ДЕМО-СЕССИЯ', 'DEMO SESSION'],
    ['Вход выполнен', 'Signed in'],
    ['Вы вошли как пример игрока. Реальная авторизация через Discord и Telegram не подключена.', 'You are signed in as a sample player. Real Discord and Telegram authentication is not connected.'],
    ['Завершить демо-вход', 'End demo sign-in'],
    ['Можно сбросить весь локальный прогресс кнопкой в меню или в панели организатора.', 'You can reset all local progress from the menu or organizer panel.'],
    ['СОСТАВ', 'ROSTER'],
    ['30 мест от Arena Qualifier и 2 слота возвращающихся победителей. Публичная регистрация не предусмотрена.', '30 places come from the Arena Qualifier and 2 slots are reserved for returning champions. Public registration is not available.'],
    ['Открыть демо-таблицу', 'Open demo table'],
    ['ПРИГЛАШЕНИЕ', 'INVITATION'],
    ['Резерв · исходный seed', 'Reserve · original seed'],
    ['Возвращающийся победитель', 'Returning champion'],
    ['ВОЗВРАЩАЮЩИЙСЯ ПОБЕДИТЕЛЬ', 'RETURNING CHAMPION'],
    ['Сопротивление', 'Resistance'],
    ['Конфедерация', 'Confederation'],
    ['Карточка', 'Profile'],
    ['Поиск игрока или клана', 'Search players or clans'],
    ['Все фракции', 'All factions'],
    ['Все статусы', 'All statuses'],
    ['Имена и эмблемы взяты из исторических данных летнего турнира. Это демонстрационные записи, а не подтверждённый состав нового события.', 'Names and emblems come from historical summer tournament data. These are demo entries, not a confirmed roster for a new event.'],
    ['32 исторических образа для проверки состава, поиска и статусов приглашений.', '32 historical player entries for reviewing the roster, search, and invitation statuses.'],
    ['РОСТЕР · 32 СЛОТА', 'ROSTER · 32 SLOTS'],
    ['ПРИМЕР СОСТАВА · SUMMER DEMO', 'SAMPLE ROSTER · SUMMER DEMO'],
    ['Фильтр по фракции', 'Filter by faction'],
    ['Фильтр по статусу', 'Filter by status'],
    ['SEED', 'SEED'],
    ['ИГРОК', 'PLAYER'],
    ['КЛАН', 'CLAN'],
    ['ФРАКЦИЯ', 'FACTION'],
    ['СТАТУС', 'STATUS'],
    ['По этим фильтрам игроков не найдено.', 'No players match these filters.'],
    ['ИСТОРИЧЕСКИЙ МАТЧ-АРХИВ', 'HISTORICAL MATCH ARCHIVE'],
    ['ТУРНИРНАЯ СЕТКА', 'TOURNAMENT BRACKET'],
    ['Результаты летнего сезона с записями доступных трансляций.', 'Summer season results with available stream recordings.'],
    ['Исторический пример сетки.', 'Historical bracket example.'],
    ['Эта сетка летнего турнира независима от демонстрационного списка приглашений и его локальных статусов.', 'This summer tournament bracket is separate from the demo invitation list and its local statuses.'],
    ['Раунды турнира', 'Tournament rounds'],
    ['Матч за 3-е место', 'Third-place match'],
    ['Летний архив · формат BO1', 'Summer archive · BO1 format'],
    ['тех. поражение', 'technical loss'],
    ['тех. замена', 'technical substitution'],
    ['архив', 'archive'],
    ['АРХИВ · YOUTUBE', 'ARCHIVE · YOUTUBE'],
    ['Записи матчей первого раунда летнего сезона из предоставленного архива.', 'First-round summer season match recordings from the supplied archive.'],
    ['Ссылки ведут на YouTube и открываются в новой вкладке.', 'Links open YouTube in a new tab.'],
    ['Открыть запись на YouTube ↗', 'Open recording on YouTube ↗'],
    ['КЛАНОВЫЙ ЗАЛ', 'CLAN HALL'],
    ['РЕЙТИНГ КЛАНОВ', 'CLAN RANKINGS'],
    ['Очки и места из исторической таблицы SUMMER, сохранённой для этого превью.', 'Points and placements from the historical SUMMER table saved for this preview.'],
    ['Игрок:', 'Player:'],
    ['очков', 'points'],
    ['ТАБЛИЦА КЛАНОВ', 'CLAN LEADERBOARD'],
    ['ИСТОРИЧЕСКИЕ ОЧКИ · SUMMER', 'HISTORICAL POINTS · SUMMER'],
    ['МЕСТО', 'PLACE'],
    ['ПРЕДСТАВИТЕЛЬ', 'REPRESENTATIVE'],
    ['ОЧКИ', 'POINTS'],
    ['ШКАЛА ОЧКОВ', 'POINTS SCALE'],
    ['ЗА РЕЗУЛЬТАТ ТУРНИРА', 'FOR TOURNAMENT RESULTS'],
    ['Рейтинг и баллы относятся к летнему сезону. Они не определяют места или приглашения в текущем превью.', 'The rankings and points belong to the summer season. They do not determine placements or invitations in this preview.'],
    ['1-е место', '1st place'],
    ['2-е место', '2nd place'],
    ['3-е место', '3rd place'],
    ['4-е место', '4th place'],
    ['Вылет в 1/4', 'Eliminated in the quarterfinals'],
    ['Вылет в 1/8', 'Eliminated in the round of 16'],
    ['Вылет в 1/16', 'Eliminated in the round of 32'],
    ['1-е место ·', '1st place ·'],
    ['2-е место ·', '2nd place ·'],
    ['3-е место ·', '3rd place ·'],
    ['4-е место ·', '4th place ·'],
    ['Вылет в 1/4 ·', 'Eliminated in the quarterfinals ·'],
    ['Вылет в 1/8 ·', 'Eliminated in the round of 16 ·'],
    ['Вылет в 1/16 ·', 'Eliminated in the round of 32 ·'],
    ['из 32', 'of 32'],
    ['ОРГАНИЗАТОР', 'ORGANIZER'],
    ['Локальная таблица слотов, статусов и демонстрация замены резервом.', 'Local table of slots and statuses with a reserve replacement demo.'],
    ['Экспорт CSV ↗', 'Export CSV ↗'],
    ['Панель работает локально.', 'This panel runs locally.'],
    ['Записи — исторические примеры; приглашения, замены и CSV не отправляются во внешние сервисы. Исходный seed каждого слота остаётся прежним.', 'Entries are historical examples; invitations, replacements, and CSV files are not sent to external services. Each slot keeps its original seed.'],
    ['ВСЕ АКТИВНЫЕ СЛОТЫ', 'ALL ACTIVE SLOTS'],
    ['игроков', 'players'],
    ['ОЖИДАЮТ', 'AWAITING'],
    ['ответа', 'RESPONSE'],
    ['ОТКАЗ / СРОК', 'DECLINED / EXPIRED'],
    ['записей', 'ENTRIES'],
    ['РЕЗЕРВНЫЙ СОСТАВ', 'RESERVE ROSTER'],
    ['4 ОБРАЗЦА ДЛЯ ЗАМЕНЫ', '4 REPLACEMENT SAMPLES'],
    ['назначен в слот', 'assigned to a slot'],
    ['свободен для демонстрации', 'available for demo'],
    ['32 ПЕРСОНАЛЬНЫХ СЛОТА', '32 PERSONAL SLOTS'],
    ['ИГРОК / ИСТОРИЯ', 'PLAYER / HISTORY'],
    ['ИСТОЧНИК СЛОТА', 'SLOT SOURCE'],
    ['ДЕЙСТВИЯ · ДЕМО', 'ACTIONS · DEMO'],
    ['Поиск по игроку или клану', 'Search players or clans'],
    ['Фильтр статуса', 'Filter by status'],
    ['Поиск не нашёл подходящих приглашений.', 'No invitations match your search.'],
    ['Подробнее', 'Details'],
    ['Назначить резерв', 'Assign reserve'],
    ['Здесь пока нет сообщений. Они видны только в этой демо-сессии.', 'There are no messages yet. Messages are visible only in this demo session.'],
    ['Демо-вход', 'Demo sign-in'],
    ['Выберите способ входа для просмотра кабинета.', 'Choose a sign-in method to view the cabinet.'],
    ['Продолжить с Discord', 'Continue with Discord'],
    ['Продолжить с Telegram', 'Continue with Telegram'],
    ['Демо-сессия · Hero Dominator', 'Demo session · Hero Dominator'],
    ['Демонстрация входа; аккаунт не подключается. OAuth, токены и внешние запросы отсутствуют.', 'Demo sign-in; no account is connected. There is no OAuth, token storage, or external request.'],
    ['Отклонить приглашение?', 'Decline invitation?'],
    ['Действие обновит только локальный демо-статус.', 'This action updates the local demo status only.'],
    ['Приглашение Hero Dominator будет отмечено как отклонённое. Организатор сможет выбрать этот слот для демонстрации замены; seed #', 'Hero Dominator’s invitation will be marked as declined. The organizer can use this slot to demonstrate a replacement; seed #'],
    ['Подтверждаю демонстрационный отказ.', 'I confirm this demo decline.'],
    ['Запись не отправляется организаторам или игровому серверу.', 'This change is not sent to the organizer or game server.'],
    ['Назад', 'Back'],
    ['Отклонить', 'Decline'],
    ['Карточка участника', 'Player profile'],
    ['локальные демо-данные', 'local demo data'],
    ['Предыдущая запись:', 'Previous entry:'],
    ['исходный ранг сохраняется', 'original rank is preserved'],
    ['Источник слота', 'Slot source'],
    ['Фракция', 'Faction'],
    ['Это демонстрационная запись на основе исторического имени летнего сезона.', 'This demo entry is based on a historical summer season name.'],
    ['Закрыть', 'Close'],
    ['Детали приглашения', 'Invitation details'],
    ['организаторская демо-панель', 'organizer demo panel'],
    ['Текущий игрок', 'Current player'],
    ['исходный слот не перенумеровывается', 'original slot number stays the same'],
    ['Источник', 'Source'],
    ['История замен пока пуста.', 'There is no replacement history yet.'],
    ['Только демо: в реальной системе детали и статусы будут синхронизироваться с сервисом приглашений.', 'Demo only: in the full system, details and statuses will sync with the invitation service.'],
    ['Нет свободного резерва', 'No reserve players available'],
    ['Все четыре демонстрационных образца уже назначены.', 'All four demo samples have already been assigned.'],
    ['Слоты остаются без изменений. Сбросьте демо-данные, чтобы начать пример заново.', 'Slots remain unchanged. Reset the demo data to start over.'],
    ['Назначить резерв', 'Assign reserve'],
    ['Выберите образец и отдельно подтвердите замену.', 'Choose a sample and confirm the replacement separately.'],
    ['Текущий слот', 'Current slot'],
    ['Причина', 'Reason'],
    ['Исходный seed', 'Original seed'],
    ['Сохранится в истории', 'Saved in history'],
    ['Образец резервного игрока', 'Reserve player sample'],
    ['Подтверждаю локальную замену в выбранном слоте.', 'I confirm the local replacement in the selected slot.'],
    ['Резерв занимает активное место, поэтому сетка остаётся на 32 слота. Предыдущая запись остаётся в истории слота.', 'A reserve takes the active place, so the bracket stays at 32 slots. The previous entry remains in the slot history.'],
    ['Отмена', 'Cancel'],
    ['Назначить в слот #', 'Assign to slot #'],
    ['Ранее:', 'Previous:'],
    ['seed', 'seed'],
    ['player', 'player'],
    ['clan', 'clan'],
    ['faction', 'faction'],
    ['source', 'source'],
    ['status', 'status'],
    ['history', 'history'],
    ['Фракция', 'Faction'],
    ['Конфедерация', 'Confederation'],
    ['Сопротивление', 'Resistance'],
    ['Локальное', 'Local'],
    ['Срок ответа', 'Response deadline'],
    ['Раунд 32', 'Round of 32'],
    ['Раунд 16', 'Round of 16'],
    ['Четвертьфинал', 'Quarterfinals'],
    ['Полуфинал', 'Semifinals'],
    ['Финал', 'Final'],
    ['1/16 финала', 'Round of 32'],
    ['1/8 финала', 'Round of 16'],
    ['1/4 финала', 'Quarterfinals'],
    ['Без клана', 'No clan'],
    ['Вариант A', 'Option A'],
    ['Вариант B', 'Option B'],
    ['Вариант C', 'Option C']
  ];

  const dictionary = new Map(pairs);
  const reverseDictionary = new Map(pairs.map(([source, target]) => [target, source]));
  const statusDictionary = new Map([
    ['Ожидает ответа', 'Awaiting response'],
    ['Подтверждён', 'Confirmed'],
    ['Отклонено', 'Declined'],
    ['Истекло', 'Expired']
  ]);
  const reverseStatusDictionary = new Map(Array.from(statusDictionary, ([source, target]) => [target, source]));
  const patterns = [
    [/^(\d+) слота$/, '$1 slots', /^(\d+) slots$/, '$1 слота'],
    [/^(\d+) слотов$/, '$1 slots', /^(\d+) slots$/, '$1 слотов'],
    [/^(\d+) из (\d+)$/, '$1 of $2', /^(\d+) of (\d+)$/, '$1 из $2'],
    [/^(\d+) МАТЧЕЙ$/, '$1 MATCHES', /^(\d+) MATCHES$/, '$1 МАТЧЕЙ'],
    [/^(BO\d) · (\d+) МАТЧЕЙ$/, '$1 · $2 MATCHES', /^(BO\d) · (\d+) MATCHES$/, '$1 · $2 МАТЧЕЙ'],
    [/^(BO\d) · тех\. поражение$/, '$1 · technical loss', /^(BO\d) · technical loss$/, '$1 · тех. поражение'],
    [/^(BO\d) · тех\. замена$/, '$1 · technical substitution', /^(BO\d) · technical substitution$/, '$1 · тех. замена'],
    [/^(\d+) ИСТОРИЧЕСКИХ ЗАПИСЕЙ$/, '$1 HISTORICAL RECORDS', /^(\d+) HISTORICAL RECORDS$/, '$1 ИСТОРИЧЕСКИХ ЗАПИСЕЙ'],
    [/^(\d+) ПЕРСОНАЛЬНЫХ СЛОТА$/, '$1 PERSONAL SLOTS', /^(\d+) PERSONAL SLOTS$/, '$1 ПЕРСОНАЛЬНЫХ СЛОТА'],
    [/^Seed #(\d+) остаётся закреплён за приглашением\.$/, 'Seed #$1 remains assigned to this invitation.', /^Seed #(\d+) remains assigned to this invitation\.$/, 'Seed #$1 остаётся закреплён за приглашением.'],
    [/^Ваш слот · seed #(\d+)$/, 'Your slot · seed #$1', /^Your slot · seed #(\d+)$/, 'Ваш слот · seed #$1'],
    [/^Резерв · исходный seed #(\d+)$/, 'Reserve · original seed #$1', /^Reserve · original seed #(\d+)$/, 'Резерв · исходный seed #$1'],
    [/^Назначить в слот #(\d+)$/, 'Assign to slot #$1', /^Assign to slot #(\d+)$/, 'Назначить в слот #$1'],
    [/^Слот #(\d+) · локальные демо-данные$/, 'Slot #$1 · local demo data', /^Slot #(\d+) · local demo data$/, 'Слот #$1 · локальные демо-данные'],
    [/^Слот #(\d+) · организаторская демо-панель$/, 'Slot #$1 · organizer demo panel', /^Slot #(\d+) · organizer demo panel$/, 'Слот #$1 · организаторская демо-панель'],
    [/^#(\d+) · исходный ранг сохраняется$/, '#$1 · original rank is preserved', /^#(\d+) · original rank is preserved$/, '#$1 · исходный ранг сохраняется'],
    [/^#(\d+) · исходный слот не перенумеровывается$/, '#$1 · original slot number stays the same', /^#(\d+) · original slot number stays the same$/, '#$1 · исходный слот не перенумеровывается'],
    [/^#(\d+) · останется неизменным$/, '#$1 · will stay unchanged', /^#(\d+) · will stay unchanged$/, '#$1 · останется неизменным'],
    [/^#(\d+) · (\d+)$/, '#$1 · $2', /^#(\d+) · (\d+)$/, '#$1 · $2'],
    [/^ · (\d+) МАТЧЕЙ$/, ' · $1 MATCHES', /^ · (\d+) MATCHES$/, ' · $1 МАТЧЕЙ'],
    [/^ЛЕТНИЙ АРХИВ · 1\/16$/, 'SUMMER ARCHIVE · ROUND OF 32', /^SUMMER ARCHIVE · ROUND OF 32$/, 'ЛЕТНИЙ АРХИВ · 1/16'],
    [/^Слот # (\d+) · (.*) · (.*)$/, 'Slot #$1 · $2 · $3', /^Slot #(\d+) · (.*) · (.*)$/, 'Слот # $1 · $2 · $3'],
    [/^Предыдущая запись: (.*) · (.*) · seed #(\d+)$/, 'Previous entry: $1 · $2 · seed #$3', /^Previous entry: (.*) · (.*) · seed #(\d+)$/, 'Предыдущая запись: $1 · $2 · seed #$3'],
    [/^Ранее: (.*) · (.*)$/, 'Previous: $1 · $2', /^Previous: (.*) · (.*)$/, 'Ранее: $1 · $2'],
    [/^Резерв Pilot (\d+) · (Сопротивление|Конфедерация)$/, 'Reserve Pilot $1 · $2', /^Reserve Pilot (\d+) · (Resistance|Confederation)$/, 'Reserve Pilot $1 · $2']
  ];

  function languageCode(value) {
    return String(value || '').toLowerCase() === 'en' ? 'en' : 'ru';
  }

  function replacePattern(value, pattern, template) {
    const match = value.match(pattern);
    return match ? value.replace(pattern, template) : null;
  }

  function translate(value, language) {
    const text = String(value == null ? '' : value);
    const locale = languageCode(language);
    const leading = (text.match(/^\s*/) || [''])[0];
    const trailing = (text.match(/\s*$/) || [''])[0];
    const trimmed = text.slice(leading.length, text.length - trailing.length);
    const statusSeparator = trimmed.lastIndexOf(' · ');
    if (statusSeparator >= 0) {
      const prefix = trimmed.slice(0, statusSeparator);
      const suffix = trimmed.slice(statusSeparator + 3);
      if (locale === 'en' && statusDictionary.has(suffix)) return leading + prefix + ' · ' + statusDictionary.get(suffix) + trailing;
      if (locale === 'ru' && reverseStatusDictionary.has(suffix)) return leading + prefix + ' · ' + reverseStatusDictionary.get(suffix) + trailing;
    }
    if (locale === 'en') {
      if (dictionary.has(trimmed)) return leading + dictionary.get(trimmed) + trailing;
      for (const [sourcePattern, targetTemplate] of patterns) {
        const translated = replacePattern(trimmed, sourcePattern, targetTemplate);
        if (translated !== null) return leading + translated + trailing;
      }
      return text;
    }
    if (reverseDictionary.has(trimmed)) return leading + reverseDictionary.get(trimmed) + trailing;
    for (const [, , sourcePattern, targetTemplate] of patterns) {
      const translated = replacePattern(trimmed, sourcePattern, targetTemplate);
      if (translated !== null) return leading + translated + trailing;
    }
    return text;
  }

  function resolveLanguage(search, storedLanguage) {
    let requested = '';
    try {
      requested = new URLSearchParams(String(search || '').replace(/^.*\?/, '').split('#')[0]).get('lang') || '';
    } catch (error) {
      requested = '';
    }
    if (requested === 'en' || requested === 'ru') return requested;
    return storedLanguage === 'en' || storedLanguage === 'ru' ? storedLanguage : 'ru';
  }

  function ignored(element) {
    return Boolean(element && element.closest && element.closest('script, style, textarea, [data-i18n-ignore]'));
  }

  const originalText = new WeakMap();
  const originalAttributes = new WeakMap();
  const translatableAttributes = ['aria-label', 'placeholder', 'title', 'content'];

  function apply(rootElement, language) {
    const rootNode = rootElement || (typeof document !== 'undefined' ? document : null);
    if (!rootNode || typeof rootNode.querySelectorAll !== 'function') return rootNode;
    const doc = rootNode.nodeType === 9 ? rootNode : rootNode.ownerDocument;
    if (!doc || typeof doc.createTreeWalker !== 'function') return rootNode;
    const showText = doc.defaultView && doc.defaultView.NodeFilter ? doc.defaultView.NodeFilter.SHOW_TEXT : 4;
    const walker = doc.createTreeWalker(rootNode, showText);
    let node = walker.nextNode();
    while (node) {
      if (!ignored(node.parentElement)) {
        if (!originalText.has(node)) originalText.set(node, node.nodeValue);
        node.nodeValue = translate(originalText.get(node), language);
      }
      node = walker.nextNode();
    }
    const elements = [];
    if (rootNode.nodeType === 1) elements.push(rootNode);
    elements.push(...rootNode.querySelectorAll('*'));
    for (const element of elements) {
      if (ignored(element)) continue;
      for (const name of translatableAttributes) {
        if (!element.hasAttribute(name)) continue;
        let sourceAttributes = originalAttributes.get(element);
        if (!sourceAttributes) {
          sourceAttributes = new Map();
          originalAttributes.set(element, sourceAttributes);
        }
        if (!sourceAttributes.has(name)) sourceAttributes.set(name, element.getAttribute(name));
        element.setAttribute(name, translate(sourceAttributes.get(name), language));
      }
    }
    return rootNode;
  }

  const api = { translate, resolveLanguage, apply };
  root.MastersI18n = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(globalThis);
