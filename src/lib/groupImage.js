/**
 * Returns the best-match Unsplash image URL for a group based on its name and category.
 * Keyword matching goes most-specific → category fallback → generic.
 */

const IMG = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=800`;

// ─── Specific game / activity images ────────────────────────────────────────

const KEYWORD_MAP = [
  // ── Tabletop RPG ──────────────────────────────────────────────────────────
  { keywords: ["d&d", "dungeons", "one-shot"],         url: IMG("1510166369-95ff6ca49b9a") }, // D&D dice
  { keywords: ["pathfinder"],                           url: IMG("1580674684081-7617fbf3d745") }, // RPG miniatures
  { keywords: ["warhammer"],                            url: IMG("1612465340-4a73a7d42db7") }, // painted soldiers
  { keywords: ["gloomhaven", "mercenaries"],            url: IMG("1481139934-8a0edfab7cbb") }, // dungeon crawl
  { keywords: ["betrayal", "house on the hill"],        url: IMG("1518709414768-a88981a4515d") }, // dark haunted
  { keywords: ["arkham", "horror"],                     url: IMG("1585437775612-2688e7a9ba2e") }, // eldritch dark

  // ── Card games ─────────────────────────────────────────────────────────────
  { keywords: ["magic", "mtg", "gathering"],            url: IMG("1529574229-e0f86fb36b14") }, // MTG/trading cards
  { keywords: ["hearthstone"],                          url: IMG("1606503825-684a31b07c27") }, // digital cards
  { keywords: ["arkham horror"],                        url: IMG("1585437775612-2688e7a9ba2e") },

  // ── Euro / strategy board games ────────────────────────────────────────────
  { keywords: ["catan", "settlers"],                    url: IMG("1594736797933-d0401ba2fe65") }, // Catan hexes
  { keywords: ["terraforming", "mars"],                 url: IMG("1446776811747-b541d5745fd8") }, // Mars/space
  { keywords: ["wingspan", "birding board"],            url: IMG("1444464666168-49d633b86797") }, // birds
  { keywords: ["7 wonders", "seven wonders"],           url: IMG("1533000971-4aab51e6a170") }, // ancient wonders
  { keywords: ["ticket to ride"],                       url: IMG("1474487548417-781cb6d1fcef") }, // trains/rail
  { keywords: ["pandemic", "co-op"],                    url: IMG("1611532736597-de2d4265fba3") }, // board strategy
  { keywords: ["risk", "conquest"],                     url: IMG("1609743522992-de4d1c61d3af") }, // world map strategy

  // ── Video games — FPS / Tactical ───────────────────────────────────────────
  { keywords: ["valorant"],                             url: IMG("1542751371-adc8f6c8b81e") }, // gaming RGB
  { keywords: ["counter-strike", "cs2"],                url: IMG("1542751371-adc8f6c8b81e") },
  { keywords: ["rainbow six", "siege"],                 url: IMG("1542751371-adc8f6c8b81e") },
  { keywords: ["overwatch"],                            url: IMG("1542751371-adc8f6c8b81e") },

  // ── Video games — Battle Royale ─────────────────────────────────────────────
  { keywords: ["apex legends"],                         url: IMG("1593640408182-31c69c8975a5") },
  { keywords: ["warzone"],                              url: IMG("1593640408182-31c69c8975a5") },
  { keywords: ["fortnite"],                             url: IMG("1593640408182-31c69c8975a5") },
  { keywords: ["pubg"],                                 url: IMG("1593640408182-31c69c8975a5") },

  // ── Video games — MOBA / Strategy ──────────────────────────────────────────
  { keywords: ["league of legends"],                    url: IMG("1511671782779-c97d3d27a1d4") },
  { keywords: ["dota 2", "dota2"],                      url: IMG("1511671782779-c97d3d27a1d4") },
  { keywords: ["teamfight tactics", "tft"],             url: IMG("1511671782779-c97d3d27a1d4") },

  // ── Video games — MMO / RPG ─────────────────────────────────────────────────
  { keywords: ["world of warcraft", "wow"],             url: IMG("1518709414768-a88981a4515d") },
  { keywords: ["final fantasy", "ffxiv"],               url: IMG("1518709414768-a88981a4515d") },
  { keywords: ["path of exile"],                        url: IMG("1518709414768-a88981a4515d") },
  { keywords: ["elden ring"],                           url: IMG("1518709414768-a88981a4515d") },
  { keywords: ["diablo"],                               url: IMG("1518709414768-a88981a4515d") },
  { keywords: ["destiny 2"],                            url: IMG("1518709414768-a88981a4515d") },

  // ── Video games — Other ─────────────────────────────────────────────────────
  { keywords: ["rocket league"],                        url: IMG("1579952363873-27d3bfad9c88") }, // car/sports
  { keywords: ["gta", "grand theft"],                   url: IMG("1593640408182-31c69c8975a5") },
  { keywords: ["minecraft"],                            url: IMG("1560807987-bfaffef5c6a0") }, // building blocks
  { keywords: ["roblox"],                               url: IMG("1560807987-bfaffef5c6a0") },
  { keywords: ["among us"],                             url: IMG("1596731498067-0d4bcca68a4d") }, // social game
  { keywords: ["sea of thieves"],                       url: IMG("1534447985898-7a51f3d54e9c") }, // ocean
  { keywords: ["dead by daylight"],                     url: IMG("1585437775612-2688e7a9ba2e") }, // horror
  { keywords: ["palworld"],                             url: IMG("1518709414768-a88981a4515d") },

  // ── Sports ────────────────────────────────────────────────────────────────
  { keywords: ["soccer", "football"],                   url: IMG("1553778263-73a83bab9b0c") }, // soccer ball
  { keywords: ["basketball"],                           url: IMG("1546519638-68955be585c4") }, // basketball hoop
  { keywords: ["tennis"],                               url: IMG("1554068865-c7ca33f8e9a7") }, // tennis court
  { keywords: ["pickleball"],                           url: IMG("1571019613454-1cb2f99b2d8b") }, // paddle sport
  { keywords: ["volleyball", "beach volleyball"],       url: IMG("1592432678-1c7bbce02cd1") }, // beach volleyball
  { keywords: ["running", "run club"],                  url: IMG("1571008887538-b36bb32f4571") }, // running
  { keywords: ["cycling", "cycling crew"],              url: IMG("1534787238851-d57d17ab16e2") }, // cycling
  { keywords: ["golf"],                                 url: IMG("1535131749-d095c4a94b5b") }, // golf
  { keywords: ["hiking", "trails"],                     url: IMG("1551632436-cbf8dd35adfa") }, // hiking

  // ── Other / Hobby ─────────────────────────────────────────────────────────
  { keywords: ["book", "reads", "fiction", "sci-fi reader"], url: IMG("1495446815901-a7297e633e8d") }, // books
  { keywords: ["photography"],                           url: IMG("1516035069371-29a1b244cc32") }, // camera
  { keywords: ["watercolor", "painting"],                url: IMG("1513364776144-60967b0f800f") }, // art studio
  { keywords: ["bird", "birding", "birder"],             url: IMG("1444464666168-49d633b86797") }, // binoculars
  { keywords: ["garden", "gardening", "plants"],         url: IMG("1416879595882-3373a0480b5b") }, // garden
];

// ─── Category fallbacks ──────────────────────────────────────────────────────

const CATEGORY_FALLBACK = {
  Tabletop:  IMG("1606503825-684a31b07c27"), // board game pieces on table
  Gaming:    IMG("1542751371-adc8f6c8b81e"), // gaming RGB keyboard
  Sports:    IMG("1471295253337-3ceaaedca402"), // athletic/sports
  Other:     IMG("1483058712412-4245e9b90334"), // community gathering
};

const GENERIC = IMG("1511671782779-c97d3d27a1d4");

// ─── Main export ─────────────────────────────────────────────────────────────

export const getGroupImage = (name = "", category = "") => {
  const n = name.toLowerCase();
  for (const { keywords, url } of KEYWORD_MAP) {
    if (keywords.some((kw) => n.includes(kw))) return url;
  }
  return CATEGORY_FALLBACK[category] || GENERIC;
};
