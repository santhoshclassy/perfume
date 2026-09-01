// Smell Me - Haute Parfumerie Catalog & Olfactory Database
export const FRAGRANCES = [
  {
    id: "elixir-noir",
    name: "Élixir Noir",
    subtitle: "Eau de Parfum Intense",
    tagline: "The dark magnetism of rare black oud and liquid golden amber.",
    family: "woody",
    familyLabel: "Woody & Amber",
    badge: "Flagship Icon",
    rating: 4.9,
    reviewsCount: 384,
    image: "assets/images/perfume_hero_elixir.jpg",
    accentColor: "#d4af37",
    glowColor: "rgba(212, 175, 55, 0.35)",
    prices: {
      "sample": 12,
      "50ml": 185,
      "100ml": 290
    },
    topNotes: ["Calabrian Bergamot", "Black Pepper", "Smoked Saffron"],
    heartNotes: ["Midnight Damask Rose", "Incense", "Black Truffle"],
    baseNotes: ["Aged Cambodian Oud", "Liquid Amber", "Patchouli", "Warm Vanilla"],
    intensity: 5, // 1-5
    longevity: "12+ Hours",
    sillage: "Enormous",
    mood: ["Sensual", "Mysterious", "Nocturnal", "Empowering"],
    season: ["Autumn", "Winter", "Evening"],
    story: "Conceived under the midnight sky of Grasse, Élixir Noir encapsulates the intoxicating aura of raw midnight blooms infused with rare resinous oud wood and smoked golden saffron.",
    isHero: true,
    inStock: true
  },
  {
    id: "velvet-santal",
    name: "Velvet Santal",
    subtitle: "Extrait de Parfum",
    tagline: "A creamy sanctuary of Mysore sandalwood wrapped in warm cashmere.",
    family: "woody",
    familyLabel: "Woody & Warm",
    badge: "Best Seller",
    rating: 4.8,
    reviewsCount: 298,
    image: "assets/images/perfume_velvet_santal.jpg",
    accentColor: "#d99b4d",
    glowColor: "rgba(217, 155, 77, 0.35)",
    prices: {
      "sample": 12,
      "50ml": 175,
      "100ml": 275
    },
    topNotes: ["Cardamom Pods", "Violet Leaves", "Papyrus"],
    heartNotes: ["Mysore Sandalwood", "Iris Butter", "Cedarwood"],
    baseNotes: ["Warm Cashmere", "Golden Amber", "White Musk", "Dry Leather"],
    intensity: 4,
    longevity: "10-12 Hours",
    sillage: "Intimate & Radiant",
    mood: ["Sophisticated", "Warm", "Cozy", "Quiet Luxury"],
    season: ["All Seasons", "Fall", "Daily Signature"],
    story: "A masterclass in texture, Velvet Santal envelops the wearer in the world's most prized Mysore sandalwood, smoothed to a buttery silk finish with Florentine iris and golden cashmere.",
    isHero: false,
    inStock: true
  },
  {
    id: "rose-imperiale",
    name: "Rose Impériale",
    subtitle: "Parfum Sublime",
    tagline: "Centifolia roses drenched in pink champagne and delicate velvet musk.",
    family: "floral",
    familyLabel: "Floral & Romantic",
    badge: "Limited Edition",
    rating: 4.9,
    reviewsCount: 215,
    image: "assets/images/perfume_rose_imperiale.jpg",
    accentColor: "#e88296",
    glowColor: "rgba(232, 130, 150, 0.35)",
    prices: {
      "sample": 12,
      "50ml": 195,
      "100ml": 310
    },
    topNotes: ["Pink Champagne", "Lychee", "Sparkling Mandarin"],
    heartNotes: ["Grasse Centifolia Rose", "Peony", "Bulgarian Rose Absolute"],
    baseNotes: ["White Amber", "Cashmeran", "Velvet Musk", "Cedar"],
    intensity: 3,
    longevity: "8-10 Hours",
    sillage: "Moderate & Elegant",
    mood: ["Romantic", "Radiant", "Flirty", "Opulent"],
    season: ["Spring", "Summer", "Special Occasion"],
    story: "Harvested at dawn before the morning dew evaporates, five thousand petals of Grasse roses are concentrated into every precious flacon of Rose Impériale.",
    isHero: false,
    inStock: true
  },
  {
    id: "ocean-azur",
    name: "Océan Azur",
    subtitle: "Eau de Parfum Fraîche",
    tagline: "Sunlit Mediterranean sea spray kissed by Italian lemon and coastal cypress.",
    family: "fresh",
    familyLabel: "Fresh & Marine",
    badge: "Trending Now",
    rating: 4.7,
    reviewsCount: 189,
    image: "assets/images/perfume_ocean_azur.jpg",
    accentColor: "#38bdf8",
    glowColor: "rgba(56, 189, 248, 0.35)",
    prices: {
      "sample": 10,
      "50ml": 165,
      "100ml": 255
    },
    topNotes: ["Amalfi Lemon", "Sea Salt Crystals", "Crushed Mint"],
    heartNotes: ["Marine Accord", "Neroli Blossoms", "Coastal Cypress"],
    baseNotes: ["Sun-Bleached Driftwood", "Mineral Ambergris", "Clean Vetiver"],
    intensity: 3,
    longevity: "8-9 Hours",
    sillage: "Crisp & Uplifting",
    mood: ["Invigorating", "Carefree", "Luminous", "Modern"],
    season: ["Summer", "Spring", "Daytime"],
    story: "A deep breath along the cliffside of the Amalfi coast. Mineral sea salt crashes against sun-warmed rocks and wild citrus orchards for pure olfactory liberation.",
    isHero: false,
    inStock: true
  },
  {
    id: "tabac-vanille",
    name: "Tabac & Miel",
    subtitle: "Grand Cru Extrait",
    tagline: "Rich blond tobacco leaves glazed with raw mountain honey and bourbon vanilla.",
    family: "gourmand",
    familyLabel: "Amber & Gourmand",
    badge: "Private Vault",
    rating: 4.9,
    reviewsCount: 164,
    image: "assets/images/perfume_velvet_santal.jpg",
    accentColor: "#f59e0b",
    glowColor: "rgba(245, 158, 11, 0.35)",
    prices: {
      "sample": 14,
      "50ml": 210,
      "100ml": 340
    },
    topNotes: ["Bourbon Cognac", "Coriander", "Cacao Nibs"],
    heartNotes: ["Blond Tobacco Leaf", "Raw Wild Honey", "Tonka Bean"],
    baseNotes: ["Bourbon Vanilla", "Smoked Benzoin", "Guaïac Wood"],
    intensity: 5,
    longevity: "14+ Hours",
    sillage: "Immense",
    mood: ["Indulgent", "Intoxicating", "Hypnotic", "Elite"],
    season: ["Winter", "Autumn", "Nightfall"],
    story: "Inspired by the private salons of 1920s Parisian jazz clubs. The smoky richness of hand-rolled cured tobacco harmonizes with wild comb honey and cured Madagascar vanilla.",
    isHero: false,
    inStock: true
  },
  {
    id: "discovery-vault",
    name: "The Discovery Coffret",
    subtitle: "Curated 5x 5ml Flacons",
    tagline: "Experience the complete Smell Me fragrance universe in one bespoke presentation box.",
    family: "set",
    familyLabel: "Discovery Set",
    badge: "Gifting Choice",
    rating: 5.0,
    reviewsCount: 420,
    image: "assets/images/perfume_hero_elixir.jpg",
    accentColor: "#e2b874",
    glowColor: "rgba(226, 184, 116, 0.4)",
    prices: {
      "sample": 45,
      "50ml": 65,
      "100ml": 65
    },
    topNotes: ["Includes 5 Signature Scents", "Élixir Noir", "Velvet Santal"],
    heartNotes: ["Rose Impériale", "Océan Azur", "Tabac & Miel"],
    baseNotes: ["Includes $65 Voucher toward any full bottle", "Luxury Gift Box"],
    intensity: 4,
    longevity: "Varies",
    sillage: "Versatile",
    mood: ["Curious", "Explorer", "Gift", "Connoisseur"],
    season: ["All Year"],
    story: "The quintessential journey into artisanal perfumery. Includes 5 deluxe spray flacons and a full-value redeemable gift credit towards your chosen full bottle.",
    isHero: false,
    inStock: true
  }
];

export const SCENT_FAMILIES = [
  { id: "all", label: "All Creations", icon: "✨" },
  { id: "woody", label: "Woody & Amber", icon: "🪵" },
  { id: "floral", label: "Floral Sublime", icon: "🌹" },
  { id: "fresh", label: "Fresh & Marine", icon: "🌊" },
  { id: "gourmand", label: "Amber & Gourmand", icon: "🍯" }
];

export const PYRAMID_NOTES = {
  top: [
    { name: "Calabrian Bergamot", origin: "Italy", character: "Sparkling, crisp, citrus zest", perfumes: ["elixir-noir", "ocean-azur"] },
    { name: "Pink Champagne", origin: "France", character: "Effervescent, celebratory, tart", perfumes: ["rose-imperiale"] },
    { name: "Amalfi Lemon", origin: "Italy", character: "Sun-drenched, radiant, zesty", perfumes: ["ocean-azur"] },
    { name: "Smoked Saffron", origin: "Persia", character: "Spicy, metallic-gold, exotic", perfumes: ["elixir-noir"] },
    { name: "Bourbon Cognac", origin: "France", character: "Warm boozy, barrel oak, dried fruits", perfumes: ["tabac-vanille"] }
  ],
  heart: [
    { name: "Midnight Damask Rose", origin: "Grasse, France", character: "Velvety, deep floral, seductive", perfumes: ["elixir-noir", "rose-imperiale"] },
    { name: "Mysore Sandalwood", origin: "India", character: "Creamy, milky, serene wood", perfumes: ["velvet-santal"] },
    { name: "Neroli Blossoms", origin: "Tunisia", character: "Green floral, sweet citrus bloom", perfumes: ["ocean-azur"] },
    { name: "Blond Tobacco Leaf", origin: "Virginia", character: "Warm hay, sweet smoky spice", perfumes: ["tabac-vanille"] },
    { name: "Iris Butter", origin: "Florence, Italy", character: "Powdery, aristocratic, suede-like", perfumes: ["velvet-santal"] }
  ],
  base: [
    { name: "Aged Cambodian Oud", origin: "Cambodia", character: "Dark, animalic, resinous, enduring", perfumes: ["elixir-noir"] },
    { name: "Liquid Amber", origin: "Oman", character: "Golden, balmy, radiant warmth", perfumes: ["elixir-noir", "velvet-santal"] },
    { name: "Bourbon Vanilla", origin: "Madagascar", character: "Sweet pod, rich, creamy comfort", perfumes: ["tabac-vanille", "elixir-noir"] },
    { name: "Mineral Ambergris", origin: "Oceanic", character: "Salty sea breeze, radiant skin aura", perfumes: ["ocean-azur"] },
    { name: "Velvet Musk", origin: "Synthesized Clean", character: "Sensual second skin, silk trail", perfumes: ["rose-imperiale", "velvet-santal"] }
  ]
};

export const LAYERING_COMBOS = [
  {
    base: "elixir-noir",
    accent: "rose-imperiale",
    title: "The Midnight Sovereign",
    harmonyScore: 98,
    accordType: "Smoky Rose & Dark Amber",
    description: "The dark woody mystery of Élixir Noir is crowned with radiant champagne rose petals. An arresting, royal presence.",
    tags: ["Signature Evening", "Magnetic", "Ultra-Seductive"]
  },
  {
    base: "velvet-santal",
    accent: "ocean-azur",
    title: "Coastal Cashmere",
    harmonyScore: 94,
    accordType: "Solar Citrus & Creamy Woods",
    description: "The crisp sea spray and Amalfi lemon glide over creamy Mysore sandalwood, creating an effortless Mediterranean elegance.",
    tags: ["Day to Night", "Effortless", "Luminous"]
  },
  {
    base: "elixir-noir",
    accent: "tabac-vanille",
    title: "Golden Noir",
    harmonyScore: 96,
    accordType: "Oud, Tobacco & Bourbon Honey",
    description: "Unapologetically opulent. Raw Cambodian oud laced with honeyed blond tobacco and dark Madagascar vanilla beans.",
    tags: ["Winter Night", "Extrait Strength", "Hypnotic"]
  },
  {
    base: "velvet-santal",
    accent: "rose-imperiale",
    title: "Rose & Santal Silk",
    harmonyScore: 92,
    accordType: "Powdery Rose & Cashmere",
    description: "Grasse rose petals softened by buttery iris and warm sandalwood. A gentle, whispering luxury.",
    tags: ["Romantic", "Second Skin", "Intimate"]
  },
  {
    base: "ocean-azur",
    accent: "tabac-vanille",
    title: "Smoked Driftwood",
    harmonyScore: 89,
    accordType: "Marine Vanilla & Sweet Smoke",
    description: "An intriguing clash of cool mineral sea salt against warm gourmand amber and spiced cognac.",
    tags: ["Avant-Garde", "Bold", "Unconventional"]
  }
];

export const REVIEWS = [
  {
    id: 1,
    name: "Elena Rostova",
    title: "An instant head-turner",
    fragrance: "Élixir Noir",
    rating: 5,
    verified: true,
    city: "Paris, France",
    date: "2 days ago",
    comment: "I have worn niche perfumes for 15 years, and 'Smell Me - Élixir Noir' is in a tier of its own. I was stopped 4 times on my way to dinner asking what I was wearing. The sillage is divine.",
    sillageRating: "Enormous",
    longevityRating: "14+ hours"
  },
  {
    id: 2,
    name: "Julian Vance",
    title: "The sandalwood of my dreams",
    fragrance: "Velvet Santal",
    rating: 5,
    verified: true,
    city: "New York, USA",
    date: "1 week ago",
    comment: "Velvet Santal has that ultra-smooth, high-society quiet luxury scent. It does not screech; it floats around you like the softest cashmere sweater.",
    sillageRating: "Radiant Aura",
    longevityRating: "12 hours"
  },
  {
    id: 3,
    name: "Aria Montclaire",
    title: "Liquid romance in a bottle",
    fragrance: "Rose Impériale",
    rating: 5,
    verified: true,
    city: "Milan, Italy",
    date: "3 weeks ago",
    comment: "Not your grandmother's rose! The pink champagne top note makes it youthful, effervescent, and wildly sexy. The bottle is a work of art on my vanity.",
    sillageRating: "Moderate & Elegant",
    longevityRating: "9 hours"
  }
];

export const QUIZ_QUESTIONS = [
  {
    id: "occasion",
    title: "Where will your scent make its biggest statement?",
    subtitle: "Select the atmosphere you wish to command",
    options: [
      { id: "evening", label: "Intimate Dinners & Midnight Soirées", icon: "🌙", familyWeight: { woody: 3, gourmand: 2, floral: 1 } },
      { id: "daily", label: "Boardroom & High-Stakes Daily Elegance", icon: "✨", familyWeight: { woody: 2, fresh: 2, floral: 1 } },
      { id: "summer", label: "Coastal Escapes & Sunlit Terraces", icon: "🌊", familyWeight: { fresh: 4, floral: 1 } },
      { id: "romantic", label: "Romantic Rendezvous & Champagne Nights", icon: "🥂", familyWeight: { floral: 3, gourmand: 2, woody: 1 } }
    ]
  },
  {
    id: "mood",
    title: "What emotional energy do you want to radiate?",
    subtitle: "Your scent is your unspoken aura",
    options: [
      { id: "magnetic", label: "Dark, Enigmatic & Irresistibly Magnetic", icon: "🔮", familyWeight: { woody: 3, gourmand: 2 } },
      { id: "effortless", label: "Serene, Sophisticated & Quiet Luxury", icon: "🕊️", familyWeight: { woody: 3, fresh: 1 } },
      { id: "luminous", label: "Joyful, Romantic & Sparkling", icon: "🌸", familyWeight: { floral: 3, fresh: 2 } },
      { id: "invigorating", label: "Crisp, Dynamic & Liberated", icon: "⚡", familyWeight: { fresh: 4 } }
    ]
  },
  {
    id: "scent_notes",
    title: "Which olfactory family draws you in naturally?",
    subtitle: "Trust your primary sensory instinct",
    options: [
      { id: "oud_woods", label: "Smoky Oud, Saffron & Warm Resins", icon: "🪵", familyWeight: { woody: 4 } },
      { id: "rose_petals", label: "Dewy Rose, Peony & Pink Champagne", icon: "🌹", familyWeight: { floral: 4 } },
      { id: "citrus_sea", label: "Marine Salt, Bergamot & Coastal Breeze", icon: "🍋", familyWeight: { fresh: 4 } },
      { id: "honey_tobacco", label: "Sweet Honey, Bourbon Vanilla & Tobacco", icon: "🍯", familyWeight: { gourmand: 4 } }
    ]
  },
  {
    id: "projection",
    title: "What is your preferred projection (Sillage)?",
    subtitle: "How far should your fragrance travel?",
    options: [
      { id: "room_filling", label: "Commanding - Heads turn when I enter", icon: "👑", matchPerfume: "elixir-noir" },
      { id: "radiant", label: "Radiant Bubble - People lean in closer", icon: "✨", matchPerfume: "velvet-santal" },
      { id: "soft_trail", label: "Gentle Seduction - A delicate whisper", icon: "🪶", matchPerfume: "rose-imperiale" },
      { id: "fresh_burst", label: "Invigorating Spray - An uplifting burst", icon: "🌊", matchPerfume: "ocean-azur" }
    ]
  }
];
