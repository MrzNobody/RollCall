/**
 * Returns the best-match Unsplash image for a group or event based on its name/title.
 * Matching goes most-specific keyword → category fallback → generic.
 */

const IMG = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=800`;

// ─── Activity-specific keyword → image map ───────────────────────────────────
// Rule: every major activity the user might create gets its OWN distinct image.

const KEYWORD_MAP = [

  // ══ VIDEO GAMES ═══════════════════════════════════════════════════════════

  // Overwatch / Hero shooters
  { keywords: ['overwatch'],                        url: IMG('1542751371-adc8f6c8b81e') }, // esports arena
  { keywords: ['valorant'],                         url: IMG('1600861194942-f883de0dfe96') }, // tactical shooter
  { keywords: ['counter-strike', 'cs2', 'csgo'],   url: IMG('1600861194942-f883de0dfe96') },
  { keywords: ['rainbow six', 'siege', 'r6'],      url: IMG('1600861194942-f883de0dfe96') },
  { keywords: ['apex legends'],                     url: IMG('1593640408182-31c69c8975a5') }, // battle royale
  { keywords: ['warzone', 'call of duty', 'cod'],  url: IMG('1593640408182-31c69c8975a5') },
  { keywords: ['fortnite'],                         url: IMG('1593640408182-31c69c8975a5') },
  { keywords: ['pubg'],                             url: IMG('1593640408182-31c69c8975a5') },
  { keywords: ['league of legends', 'lol'],         url: IMG('1511671782779-c97d3d27a1d4') }, // MOBA
  { keywords: ['dota', 'dota2'],                    url: IMG('1511671782779-c97d3d27a1d4') },
  { keywords: ['teamfight tactics', 'tft'],         url: IMG('1511671782779-c97d3d27a1d4') },
  { keywords: ['world of warcraft', 'wow'],         url: IMG('1616588589676-62b3bd4ff6d2') }, // MMO fantasy
  { keywords: ['final fantasy', 'ffxiv', 'ff14'],  url: IMG('1616588589676-62b3bd4ff6d2') },
  { keywords: ['elden ring'],                       url: IMG('1616588589676-62b3bd4ff6d2') },
  { keywords: ['diablo'],                           url: IMG('1616588589676-62b3bd4ff6d2') },
  { keywords: ['destiny 2'],                        url: IMG('1616588589676-62b3bd4ff6d2') },
  { keywords: ['path of exile'],                    url: IMG('1616588589676-62b3bd4ff6d2') },
  { keywords: ['rocket league'],                    url: IMG('1579952363873-27d3bfad9c88') }, // cars + sport
  { keywords: ['minecraft'],                        url: IMG('1560807987-bfaffef5c6a0') }, // building/blocks
  { keywords: ['roblox'],                           url: IMG('1560807987-bfaffef5c6a0') },
  { keywords: ['gta', 'grand theft'],               url: IMG('1533680215570-e5f8b72ebcc3') }, // city street
  { keywords: ['among us'],                         url: IMG('1596731498067-0d4bcca68a4d') }, // social deduction
  { keywords: ['sea of thieves'],                   url: IMG('1534447985898-7a51f3d54e9c') }, // ocean / pirate
  { keywords: ['dead by daylight', 'dbd'],          url: IMG('1518709414768-a88981a4515d') }, // horror dark
  { keywords: ['palworld'],                         url: IMG('1518709414768-a88981a4515d') },
  { keywords: ['hearthstone'],                      url: IMG('1529574229-e0f86fb36b14') }, // digital cards
  { keywords: ['magic the gathering', 'mtg'],       url: IMG('1529574229-e0f86fb36b14') },
  { keywords: ['street fighter', 'mortal kombat', 'tekken', 'smash'], url: IMG('1542751371-adc8f6c8b81e') },
  { keywords: ['retro', 'arcade'],                  url: IMG('1511512578047-ab3e37860d55') }, // retro arcade
  { keywords: ['lan party', 'lan'],                 url: IMG('1542751371-adc8f6c8b81e') }, // gaming setup
  { keywords: ['esport', 'competitive'],            url: IMG('1542751371-adc8f6c8b81e') },

  // ══ TABLETOP ══════════════════════════════════════════════════════════════

  { keywords: ["d&d", "dungeons", "dragon", "one-shot", "campaign"],
                                                    url: IMG('1481139934-8a0edfab7cbb') }, // dice + miniatures
  { keywords: ['pathfinder'],                       url: IMG('1480714378408-67cf0d13bc1d') }, // RPG books
  { keywords: ['warhammer', 'wargame'],             url: IMG('1612465340-4a73a7d42db7') }, // painted miniatures
  { keywords: ['gloomhaven'],                       url: IMG('1481139934-8a0edfab7cbb') },
  { keywords: ['betrayal', 'haunted'],              url: IMG('1518709414768-a88981a4515d') }, // dark/spooky
  { keywords: ['arkham'],                           url: IMG('1518709414768-a88981a4515d') },
  { keywords: ['catan', 'settlers'],                url: IMG('1594736797933-d0401ba2fe65') }, // hexagonal board
  { keywords: ['terraforming mars'],                url: IMG('1446776811747-b541d5745fd8') }, // red planet
  { keywords: ['wingspan'],                         url: IMG('1444464666168-49d633b86797') }, // birds
  { keywords: ['7 wonders', 'seven wonders'],       url: IMG('1533000971-4aab51e6a170') }, // ancient world
  { keywords: ['ticket to ride'],                   url: IMG('1474487548417-781cb6d1fcef') }, // trains
  { keywords: ['pandemic'],                         url: IMG('1611532736597-de2d4265fba3') }, // strategy board
  { keywords: ['risk'],                             url: IMG('1609743522992-de4d1c61d3af') }, // world map
  { keywords: ['chess'],                            url: IMG('1528819622765-d6bcf132f793') }, // chess board
  { keywords: ['board game', 'tabletop night', 'game night'],
                                                    url: IMG('1606503825-684a31b07c27') }, // board game table

  // ══ SPORTS ════════════════════════════════════════════════════════════════

  { keywords: ['basketball'],                       url: IMG('1546519638-68955be585c4') }, // basketball court
  { keywords: ['pickleball'],                       url: IMG('1686825586386-39b53e96ad52') }, // pickleball paddle
  { keywords: ['tennis'],                           url: IMG('1554068865-c7ca33f8e9a7') }, // tennis court
  { keywords: ['soccer', 'football'],               url: IMG('1553778263-73a83bab9b0c') }, // soccer ball on grass
  { keywords: ['volleyball', 'beach volleyball'],   url: IMG('1592432678-1c7bbce02cd1') }, // beach volleyball
  { keywords: ['swimming', 'swim'],                 url: IMG('1546483875-ad9cc700ade5') }, // lap swimming
  { keywords: ['baseball', 'softball'],             url: IMG('1508344928928-7d7ff841e7e4') }, // baseball diamond
  { keywords: ['flag football'],                    url: IMG('1575361204480-aadea25e6e68') }, // football field
  { keywords: ['ultimate frisbee', 'frisbee'],      url: IMG('1575361204480-aadea25e6e68') },
  { keywords: ['running', 'run club', '5k', '10k', 'marathon'],
                                                    url: IMG('1571008887538-b36bb32f4571') }, // runners on road
  { keywords: ['cycling', 'bike', 'bicycl'],        url: IMG('1534787238851-d57d17ab16e2') }, // cycling road
  { keywords: ['golf'],                             url: IMG('1535131749-d095c4a94b5b') }, // golf course
  { keywords: ['hiking', 'trail', 'hike'],          url: IMG('1551632436-cbf8dd35adfa') }, // hiking trail
  { keywords: ['yoga'],                             url: IMG('1544367739-b1e6b4395baf') }, // yoga class
  { keywords: ['crossfit', 'fitness', 'workout', 'gym'],
                                                    url: IMG('1571019613454-1cb2f99b2d8b') }, // gym/fitness
  { keywords: ['martial art', 'karate', 'jiu jitsu', 'bjj', 'boxing', 'mma'],
                                                    url: IMG('1571019613454-1cb2f99b2d8b') },
  { keywords: ['paddleboard', 'kayak', 'canoe'],    url: IMG('1530053969600-caed2596d242') }, // water sport
  { keywords: ['surf'],                             url: IMG('1507525428034-b723cf961d3e') }, // surfing
  { keywords: ['skating', 'skate'],                 url: IMG('1547347703-c36ad2e7c9d7') }, // skating

  // ══ OUTDOOR & NATURE ══════════════════════════════════════════════════════

  { keywords: ['bird watch', 'birding', 'birder', 'ornithol'],
                                                    url: IMG('1444464666168-49d633b86797') }, // binoculars + birds
  { keywords: ['garden', 'gardening', 'plant'],     url: IMG('1416879595882-3373a0480b5b') }, // garden
  { keywords: ['fishing', 'angling'],               url: IMG('1455218873509-8f07c88cc69d') }, // fishing water
  { keywords: ['nature walk', 'nature'],            url: IMG('1469474968028-56623f02e42e') }, // nature trail
  { keywords: ['astronomy', 'stargazing', 'telescope'],
                                                    url: IMG('1462331940025-496dfbfc7564') }, // night sky
  { keywords: ['beach', 'bonfire', 'cookout'],      url: IMG('1507525428034-b723cf961d3e') }, // beach scene

  // ══ ARTS & CREATIVITY ══════════════════════════════════════════════════════

  { keywords: ['painting', 'watercolor', 'acrylic', 'oil paint'],
                                                    url: IMG('1513364776144-60967b0f800f') }, // artist painting
  { keywords: ['drawing', 'sketch', 'illustration'], url: IMG('1513364776144-60967b0f800f') },
  { keywords: ['photography'],                      url: IMG('1516035069371-29a1b244cc32') }, // camera/lens
  { keywords: ['pottery', 'ceramics', 'clay'],      url: IMG('1565193566173-7a0ee3dbe261') }, // pottery hands
  { keywords: ['music', 'band', 'jam', 'open mic'], url: IMG('1511379938547-c1f69419868d') }, // live music
  { keywords: ['dance', 'dancing'],                 url: IMG('1504609813442-a8924e83f76e') }, // dancing
  { keywords: ['theater', 'theatre', 'improv'],     url: IMG('1503095396549-807c37b0b065') }, // stage
  { keywords: ['film', 'movie', 'cinema'],          url: IMG('1489599849927-2ee91cede3ba') }, // cinema
  { keywords: ['comic', 'manga', 'anime'],          url: IMG('1542751371-adc8f6c8b81e') }, // gaming/anime

  // ══ LEARNING & SOCIAL ══════════════════════════════════════════════════════

  { keywords: ['book', 'reading', 'book club', 'fiction', 'sci-fi'],
                                                    url: IMG('1495446815901-a7297e633e8d') }, // open book
  { keywords: ['coding', 'programming', 'hackathon', 'dev'],
                                                    url: IMG('1461749280684-dccba630e2f6') }, // code on screen
  { keywords: ['language', 'spanish', 'french', 'japanese'],
                                                    url: IMG('1503428593586-e225b39bddfe') }, // conversation
  { keywords: ['cooking', 'chef', 'food', 'culinary'],
                                                    url: IMG('1556910103-1c02745aae4d') }, // cooking
  { keywords: ['coffee', 'café', 'meetup'],         url: IMG('1495474472287-4d71bcdd2085') }, // coffee shop
  { keywords: ['trivia', 'quiz night'],             url: IMG('1529154036614-a60975f5c760') }, // trivia night
  { keywords: ['escape room'],                      url: IMG('1518709414768-a88981a4515d') }, // dark mysterious
  { keywords: ['volunteer', 'community service'],   url: IMG('1559027615-cd4628902d4a') }, // volunteers
];

// ─── Category fallbacks ──────────────────────────────────────────────────────

const CATEGORY_FALLBACK = {
  Tabletop:  IMG('1606503825-684a31b07c27'), // board game pieces on table
  Gaming:    IMG('1542751371-adc8f6c8b81e'), // gaming setup / esports
  Sports:    IMG('1471295253337-3ceaaedca402'), // athletic field
  Other:     IMG('1495474472287-4d71bcdd2085'), // community gathering
};

const GENERIC = IMG('1511671782779-c97d3d27a1d4');

// ─── Core matcher ────────────────────────────────────────────────────────────

const matchImage = (text = '', category = '') => {
  const t = text.toLowerCase();
  for (const { keywords, url } of KEYWORD_MAP) {
    if (keywords.some((kw) => t.includes(kw))) return url;
  }
  return CATEGORY_FALLBACK[category] || GENERIC;
};

// ─── Exports ─────────────────────────────────────────────────────────────────

/** Best image for a group based on its name + category */
export const getGroupImage = (name = '', category = '') =>
  matchImage(name, category);

/** Best image for a scheduled event based on its title */
export const getEventImage = (title = '', category = '') =>
  matchImage(title, category);
