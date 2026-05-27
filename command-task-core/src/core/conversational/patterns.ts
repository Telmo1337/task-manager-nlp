export type ConversationalKey =
  | "identity"
  | "name"
  | "creator"
  | "capabilities"
  | "help"
  | "explain"
  | "greeting"
  | "goodbye"
  | "thanks"
  | "howAreYou"
  | "compliment"
  | "apology"
  | "frustration"
  | "joke"
  | "motivation"
  | "boredom"
  | "productivity"
  | "acknowledge"
  | "nevermind"
  | "love"
  | "whatTime"
  | "coinFlip"
  | "rollDice"
  | "song"
  | "meaningOfLife";

export interface ConversationalPattern {
  key: ConversationalKey;
  test: (lower: string) => boolean;
}

export const patterns: ConversationalPattern[] = [
  {
    key: "identity",
    test: (l) =>
      /\b(who|what)\s+(are|r)\s+(you|u)\b/.test(l) ||
      /\bwhat('?s| is)\s+this\b/.test(l),
  },
  {
    key: "name",
    test: (l) =>
      /\b(what('?s| is)\s+(your|ur)\s+name|do you have a name)\b/.test(l),
  },
  {
    key: "creator",
    test: (l) =>
      /\b(who\s+(made|created|built|designed)\s+(you|this)|who('?s| is)\s+(your|ur)\s+(creator|maker|developer))\b/.test(l),
  },
  {
    key: "capabilities",
    test: (l) =>
      /\b(what|how)\s+(can|do)\s+(you|u)\s+(do|help)\b/.test(l) ||
      /\bwhat\s+(do|can)\s+(you|u)\b/.test(l) ||
      /\b(your|ur)\s+(capabilities|features|functions)\b/.test(l),
  },
  {
    key: "help",
    test: (l) =>
      /^help\b/.test(l) ||
      /\bhow\s+to\s+use\b/.test(l) ||
      /\bhelp\s+me\b/.test(l),
  },
  {
    key: "explain",
    test: (l) =>
      /^(explain|commands?|examples?|show\s+commands?|what\s+can\s+i\s+(say|type|do)|options)\b/.test(l),
  },
  {
    key: "greeting",
    test: (l) =>
      /^(hi|hello|hey|good\s+(morning|afternoon|evening)|howdy|yo|sup|what'?s\s+up)\b/.test(l),
  },
  {
    key: "goodbye",
    test: (l) =>
      /^(bye|goodbye|see\s+(you|ya)|later|good\s*night|cya|gtg)\b/.test(l),
  },
  {
    key: "thanks",
    test: (l) =>
      /^(thanks|thank\s+you|thx|ty|appreciate\s+it)\b/.test(l),
  },
  {
    key: "howAreYou",
    test: (l) =>
      /\bhow\s+(are|r)\s+(you|u)\b/.test(l) ||
      /\bhow('?s| is)\s+it\s+going\b/.test(l),
  },
  {
    key: "compliment",
    test: (l) =>
      /\b(you('?re| are)\s+(great|awesome|amazing|the\s+best|helpful|cool)|good\s+(job|work)|nice|well\s+done|love\s+(you|this))\b/.test(l),
  },
  {
    key: "apology",
    test: (l) =>
      /^(sorry|my\s+bad|oops|whoops|apologies)\b/.test(l),
  },
  {
    key: "frustration",
    test: (l) =>
      /\b(this\s+(sucks|is\s+bad)|you('?re| are)\s+(bad|useless|stupid|dumb)|i\s+hate\s+(you|this)|ugh|argh)\b/.test(l),
  },
  {
    key: "joke",
    test: (l) =>
      /\b(tell\s+(me\s+)?a\s+joke|make\s+me\s+laugh|say\s+something\s+funny|joke)\b/.test(l),
  },
  {
    key: "motivation",
    test: (l) =>
      /\b(motivate\s+me|i('?m| am)\s+(stressed|overwhelmed|tired|lazy)|need\s+motivation|inspire\s+me)\b/.test(l),
  },
  {
    key: "boredom",
    test: (l) =>
      /\b(i('?m| am)\s+bored|nothing\s+to\s+do|bored)\b/.test(l),
  },
  {
    key: "productivity",
    test: (l) =>
      /\b(productivity\s+tips?|how\s+to\s+be\s+(productive|organized)|tips?|advice)\b/.test(l),
  },
  {
    key: "acknowledge",
    test: (l) =>
      /^(ok|okay|alright|got\s+it|understood|sure|k|kk)\.?$/i.test(l),
  },
  {
    key: "nevermind",
    test: (l) =>
      /^(never\s*mind|nvm|forget\s+it|cancel|nope|nothing)\b/.test(l),
  },
  {
    key: "love",
    test: (l) =>
      /\bi\s+(love|like)\s+(you|this|using\s+this)\b/.test(l),
  },
  {
    key: "whatTime",
    test: (l) =>
      /\b(what\s+(day|time)\s+is\s+it|what('?s| is)\s+(the\s+)?(date|time|day))\b/.test(l),
  },
  {
    key: "coinFlip",
    test: (l) =>
      /\b(flip\s+a?\s*coin|heads\s+or\s+tails)\b/.test(l),
  },
  {
    key: "rollDice",
    test: (l) =>
      /\b(roll\s+(a\s+)?dice?|roll\s+d6)\b/.test(l),
  },
  {
    key: "song",
    test: (l) =>
      /\b(sing|song|music)\b/.test(l),
  },
  {
    key: "meaningOfLife",
    test: (l) =>
      /\b(meaning\s+of\s+life|42)\b/.test(l),
  },
];
