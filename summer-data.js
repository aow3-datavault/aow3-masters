const tournamentData = {
  players: [
    ['Hero Dominator', 'Call Me God', 'confederation'], ['-!..Zakir AFG..!-', '', 'resistance'],
    ['VT_TaptapBoi C', '-V.E.R.T.E.X-', 'confederation'], ['White Pigeon', 'Utility Pigeon', 'resistance'],
    ['-_ S E Z A R _-', 'SCARY FIGHTERS', 'confederation'], ['DAUD_77', 'BENZIN', 'resistance'],
    ['General-Hassan.AS7', '120 FPS', 'confederation'], ['Yamito012 R', '-True Freedom-', 'resistance'],
    ['Koroleva Zadrot', 'Forge of Souls', 'confederation'], ['Amaan6', 'The lion heart', 'resistance'],
    ['VANGUARD TEAM', 'Peace for everyone', 'confederation'], ['GraveDigger!!!', 'Crescent Clan', 'resistance'],
    ['PiscesBrain YT', '_.--! Q.A.D !--._', 'resistance'], ['Monirul', 'R-U-SS-K-I-E', 'resistance'],
    ['Tairitsu', 'Tianya Alliance', 'confederation'], ['kinghall', '', 'resistance'],
    ['!VOlCAN!', '-!-SUNRISE-!-', 'confederation'], ['colver_1672142468', 'Russian princes', 'resistance'],
    ['Guten tag', '-BATKEN-', 'confederation'], ['Mosina', 'KTO_ESLI_NE_MI', 'confederation'],
    ['_D.A.R.K_HUNTER', 'RUSSIAN STEEL.', 'confederation'], ['VOIN--01', 'PARNI IZ STALI', 'resistance'],
    ['ALTAIR_SON_OF_DARK', '_THE_KONFA_', 'confederation'], ["!'DOOM-BRINGER'!", '-B.E.A.S.T-', 'resistance'],
    ['condantoico', 'sakasi997', 'confederation'], ['Vincenzo_1999', 'FREEDOM.113', 'resistance'],
    ['DEVIL_MAY_CRY', '_RaKi-Na-KoNfE_', 'confederation'], ['Hexblood !!!! ha', '-VERDIKT-.', 'resistance'],
    ['DuskWell-Shark', '-EAGLES-', 'confederation'], ['-_- pathmaker', 'W.O.R.L.D.C.O.R.P.', 'resistance'],
    ['for a good world', 'HELLAS ELITE', 'confederation'], ['ACCPHU.RELAXWITHME', 'CAOTHU-!-CAOCAOTHU', 'resistance']
  ].map(([name, clan, faction]) => ({ name, clan, faction })),
  rounds: [
    { title: '1/16 финала', format: 'BO1', matches: [
      [0, 1, 'https://www.youtube.com/live/P23OuOC2X9o?si=PHeTKjVix1u8znl4', "ART OF WAR MASTERS '26 SUMMER | -!..zAKIR AFG..!- vs Hero Dominator | LIVE", { scores: [1, 0], eliminated: [false, true] }], [2, 3, 'https://www.youtube.com/live/Aw7cqsHh4jQ?si=ekK8VR0wev6x1NLO', 'White Pigeon vs VT_TaptapBoi C AOW3 MASTERS TOURNAMENT', { scores: [0, 1], eliminated: [true, false] }],
      [4, 5, 'https://www.youtube.com/watch?v=ZmVzfRHFdes', '-_ S E Z A R _- VS DAUD_77 AOW3 MASTERS TOURNAMENT', { scores: [1, 0], eliminated: [false, true] }], [6, 7, 'https://www.youtube.com/live/Vwn4QwIPGhQ?si=t-aVEcr7A6rI_is6', 'AOW Masters: General-Hassan.AS7 VS Yamito012 R', { scores: [0, 1], eliminated: [true, false] }],
      [8, 9, 'https://www.youtube.com/live/74TbT8-9lfk?si=o4yOW38ffbEM3A8f', 'Koroleva Zadrot VS Amaan6 AOW3 MASTERS TOURNAMENT', { scores: [1, 0], eliminated: [false, true] }], [10, 11, 'https://www.youtube.com/live/Lx3E8iyQlRw?si=4s4Xi1hfi7qIcIu5', 'GeaveDigger!!! Vs VANGUARD TEAM AOW3 MASTERS TOURNAMENT', { scores: [0, 1], eliminated: [true, false] }],
      [12, 13, 'https://www.youtube.com/live/H77cRTTNz14?si=P0QaHe_eILJpE70R', 'Monirul Vs PiscesBrain YT AOW3 MASTERS TOURNAMENT', { scores: [1, 0], eliminated: [false, true] }], [14, 15, 'https://www.youtube.com/live/isMbM1-cIu0?si=AQLMTkwNYUVOKq7F', 'kinghall VS Tairitsu AOW3 MASTERS TOURNAMENT', { scores: [1, 0], eliminated: [false, true], status: 'technicalLoss' }],
      [16, 17, 'https://www.youtube.com/live/5EaiA5dYR4g?si=lROz9gJnWgwwG2Sb', '!VOlCAN! VS colver_1672142468 AOW3 MASTERS TOURNAMENT', { scores: [0, 1], eliminated: [true, false] }], [18, 19, 'https://www.youtube.com/live/gOk8OfqL8DA?si=npERgeN2iA3CYAQu', 'Mosina VS Guten tag AOW3 MASTERS TOURNAMENT', { scores: [0, 1], eliminated: [true, false] }],
      [20, 21, 'https://www.youtube.com/live/ui0RwxQ7ymA?si=Vv3ASKTZTQtCkcWO', '_D.A.R.K_HUNTER VS VOIN--01 AOW3 MASTERS TOURNAMENT', { scores: [1, 0], eliminated: [false, true] }], [22, 23, 'https://www.youtube.com/live/JA-cf4V2Z8w?si=puyJUc9Jvqc3Tjnd', "!'DOOM-BRINGER'! vs ALTAIR_SON_OF_DARK AOW3 MASTERS TOURNAMENT", { scores: [0, 1], eliminated: [true, false] }],
      [24, 25, 'https://youtu.be/vY8wXG8bgy4', 'Vincenzo_1999 VS condantoico AOW3 MASTERS TOURNAMENT', { scores: [1, 0], eliminated: [false, true] }], [26, 27, 'https://www.youtube.com/live/uenpsGpp-C8?si=tDxGAhSbgHzCS6LI', 'DEVIL_MAY_CRY VS Hexblood !!!! AOW3 MASTERS TOURNAMENT', { scores: [1, 0], eliminated: [false, true] }],
      [28, 29, 'https://www.youtube.com/live/9UTym9at8CU?si=ERuiwkztnjf4dMXu', '-_- pathmaker Vs DuskWell-Shark AOW3 MASTERS TOURNAMENT', { scores: [0, 1], eliminated: [true, false] }], [30, 31, 'https://www.youtube.com/live/x0Jg_VBzZHY?si=_eoXAcZAhDp2zabi', "ART OF WAR MASTERS '26 SUMMER | For A Good World vs ACCPHU.RELAXWITHME | LIVE", { scores: [0, 1], eliminated: [true, false] }]
    ] },
    { title: '1/8 финала', format: 'BO1', matches: [[0, 3, null, null, { scores: [0, 1], eliminated: [true, false] }], [4, 7, null, null, { scores: [0, 1], eliminated: [true, false] }], [8, 11, null, null, { scores: [1, 0], eliminated: [false, true] }], [12, 14, null, null, { scores: [1, 0], eliminated: [false, true] }], [17, 19, null, null, { scores: [0, 1], eliminated: [true, false] }], [20, 23, null, null, { scores: [0, 1], eliminated: [true, false] }], [31, 26, null, null, { scores: [0, 1], eliminated: [true, false] }], [29, 24, null, null, { scores: [1, 0], eliminated: [false, true] }]] },
    { title: '1/4 финала', format: 'BO1', matches: [[3, 7, null, null, { scores: [1, 0], eliminated: [false, true] }], [8, 12, null, null, { scores: [1, 0], eliminated: [false, true] }], [19, 23, null, null, { scores: [1, 0], eliminated: [false, true] }], [26, 29, null, null, { scores: [0, 1], eliminated: [true, false] }]] },
    { title: 'Полуфинал', format: 'BO3', matches: [[3, 8, null, null, { scores: [0, 2], eliminated: [true, false] }], [23, 29, null, null, { scores: [2, 0], eliminated: [false, true], status: 'technicalSubstitution', replacedPlayer: 19 }]] },
    { title: 'Финал', format: 'BO3', matches: [[8, 23, null, null, { scores: [2, 0], eliminated: [false, true] }]] }
  ],
  thirdPlace: { title: 'Матч за 3-е место', format: 'BO1', match: [29, 3, null, null, { scores: [0, 1], eliminated: [true, false] }] },
  ranking: [
    ['Call Me God', 'Hero Dominator', 2], ['-VERDIKT-.', 'Hexblood !!!! ha', 1],
    ['-V.E.R.T.E.X-', 'VT_TaptapBoi C', 1], ['The lion heart', 'Amaan6', 1],
    ['SCARY FIGHTERS', '-_ S E Z A R _-', 2], ['_.--! Q.A.D !--._', 'PiscesBrain YT', 4],
    ['120 FPS', 'General-Hassan.AS7', 1], ['R-U-SS-K-I-E', 'Monirul', 1],
    ['Forge of Souls', 'Koroleva Zadrot', 16], ['Utility Pigeon', 'White Pigeon', 9],
    ['Peace for everyone', 'VANGUARD TEAM', 1], ['-B.E.A.S.T-', "!'DOOM-BRINGER'!", 12],
    ['KTO_ESLI_NE_MI', 'Mosina', 4], ['Russian princes', 'colver_1672142468', 2],
    ['Tianya Alliance', 'Tairitsu', 2],
    ['-!-SUNRISE-!-', '!VOlCAN!', 1], ['BENZIN', 'DAUD_77', 1],
    ['-BATKEN-', 'Guten tag', 1], ['FREEDOM.113', 'Vincenzo_1999', 1],
    ['RUSSIAN STEEL.', '_D.A.R.K_HUNTER', 2], ['CAOTHU-!-CAOCAOTHU', 'ACCPHU.RELAXWITHME', 2],
    ['_THE_KONFA_', 'ALTAIR_SON_OF_DARK', 1], ['W.O.R.L.D.C.O.R.P.', '-_- pathmaker', 7],
    ['sakasi997', 'condantoico', 2], ['-True Freedom-', 'Yamito012 R', 4],
    ['_RaKi-Na-KoNfE_', 'DEVIL_MAY_CRY', 4],
    ['-EAGLES-', 'DuskWell-Shark', 1], ['PARNI IZ STALI', 'VOIN--01', 1],
    ['HELLAS ELITE', 'for a good world', 1], ['Crescent Clan', 'GraveDigger!!!', 2]
  ].map(([clan, player, points = 0]) => ({ clan, points, players: [player] })),
  points: [
    ['1-е место', 16], ['2-е место', 12], ['3-е место', 9], ['4-е место', 7],
    ['Вылет в 1/4', 4], ['Вылет в 1/8', 2], ['Вылет в 1/16', 1]
  ]
};
