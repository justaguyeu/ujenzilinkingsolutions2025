// netlify/functions/chat.js
// Groq proxy (free, fast, Llama 3) — fetches live Supabase data before answering

const SUPABASE_URL = "https://hmqzaswebmwkjmjrnmsd.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtcXphc3dlYm13a2ptanJubXNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4MjkzNjAsImV4cCI6MjA5NDQwNTM2MH0.2Yh2LMdDgR5ReBdo6xb2WOLEz6kLAcLmQvrqagtRHcU";

const CATEGORIES = {
  "0":  "Real Estate Agents",
  "1":  "Building & Construction Materials Manufacturers",
  "2":  "Civil Engineers",
  "3":  "Construction Companies",
  "4":  "Architects",
  "5":  "Consulting Engineers",
  "6":  "Quantity Surveyors",
  "7":  "Landscape Developers",
  "8":  "Fundis / Skilled Workers",
  "9":  "Hardware Stores & Suppliers",
  "10": "Construction Machinery & Tools for Hire and Sale",
  "11": "Project Managers & Specialist Contractors",
  "12": "Interior Designers, Home Decorators, Fixture Suppliers & Furniture Furnishers",
  "13": "Cleaners",
};

async function fetchRegistrations() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/registrations?select=category_id,name,description,phone,website,location,instagram&order=name.asc`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

function buildCompaniesContext(registrations) {
  if (!registrations.length) {
    return "REGISTERED COMPANIES\nNo companies are currently registered on the platform.";
  }
  const grouped = {};
  for (const r of registrations) {
    const catName = CATEGORIES[String(r.category_id)] || `Category ${r.category_id}`;
    if (!grouped[catName]) grouped[catName] = [];
    grouped[catName].push(r);
  }
  let text = "REGISTERED COMPANIES ON THE PLATFORM\n";
  text += `(${registrations.length} total registered businesses)\n\n`;
  for (const [category, companies] of Object.entries(grouped)) {
    text += `── ${category.toUpperCase()} (${companies.length} registered) ──\n`;
    for (const c of companies) {
      text += `• ${c.name}`;
      if (c.location)    text += ` | 📍 ${c.location}`;
      if (c.phone)       text += ` | 📞 ${c.phone}`;
      if (c.website)     text += ` | 🌐 ${c.website}`;
      if (c.instagram)   text += ` | Instagram: ${c.instagram}`;
      if (c.description) text += `\n  ${c.description}`;
      text += "\n";
    }
    text += "\n";
  }
  return text;
}

const STATIC_CONTEXT = `
COMPANY OVERVIEW
Ujenzi Linking Solutions is a Tanzania-based online platform established in 2024.
"Ujenzi" means "Construction" in Kiswahili. It connects businesses, markets, and
opportunities within the building and construction industry in Tanzania.

SISTER COMPANY
CHOMOZA Business Consultancy (T) Ltd — a results-driven sales and marketing partner
delivering tailored solutions in sales strategy, marketing promotion, training, and
job placement. Together the two platforms combine traditional consultancy expertise
with digital market linkage to enhance growth, market access, and sustainable
business expansion.

CORE VALUE PROPOSITIONS
• We save you Money
• We save you Time
• We help mitigate your Risks
• We elevate your Brand

OUR SERVICES (3 pillars)
1. Product Sales Network
   Developing a robust sales network of reps, manufacturers' representatives, and
   distributors to bring products and services to target customers.

2. Sales Team Development
   Building sales teams of reps and distributors from the ground up using an
   extensive network.

3. Affordable Marketing Promotion Solutions
   Cost-effective marketing and promotion services that help businesses grow sales,
   strengthen customer relationships, and reduce marketing expenses.

PLATFORM CATEGORIES (14 types of professionals/businesses you can find)
0.  Real Estate Agents — buy, sell, or invest in property with verified agents
1.  Building & Construction Materials Manufacturers — quality, durable, affordable materials
2.  Civil Engineers — registered, qualified professionals for safe efficient construction
3.  Construction Companies — residential, commercial, or industrial developments
4.  Architects — design portfolios, functional and modern solutions
5.  Consulting Engineers — technical analysis, expert advice, project support
6.  Quantity Surveyors — budget management, cost control, transparency
7.  Landscape Developers — outdoor design from small gardens to large projects
8.  Fundis / Skilled Workers — trusted artisans for quality workmanship and finishing
9.  Hardware Stores & Suppliers — tools and construction materials
10. Construction Machinery & Tools for Hire and Sale — affordable equipment rental
11. Project Managers & Specialist Contractors — timelines, budgets, quality oversight
12. Interior Designers, Home Decorators, Fixture Suppliers & Furniture Furnishers
13. Cleaners — post-construction, commercial, or residential cleaning

FOUNDER & CEO
Zuberi Lweno — Founder | CEO | Head of Sales
• Advanced Diploma in Marketing, CBE Dodoma (2007)
• Master's Degree in International Business Management, CBE (2017)
• 20+ years of sales experience in Tanzania across building & construction materials,
  machinery and tools, services, and hospitality
• Strong training and business development capabilities
• Passionate about helping businesses improve sales performance and revenue growth

PRICING PLANS
• Basic (Free): AI chatbot, personalised recommendations, explore platform features
• Premium ($9.99/mo): Advanced AI chatbot, analytics dashboard, priority support
• Enterprise (Custom): Custom AI, advanced analytics, dedicated account manager

NAVIGATION / PAGES
• Home: /
• Services: /serviceses (shows all 14 categories + our 3 service pillars)
• The Future: /future
• About Us: /aboutus

CONTACT
WhatsApp: +255755753883 (primary contact — always share this for any enquiries)
Instagram: https://www.instagram.com/ujenzilinkingsolutions/
`;

const BEHAVIOR_RULES = `
CRITICAL LANGUAGE RULE — THIS IS YOUR MOST IMPORTANT INSTRUCTION:
You MUST detect the language of the user's message and reply in THAT EXACT SAME LANGUAGE.
NO EXCEPTIONS. NEVER switch languages unless the user switches first.

Examples:
- User writes in Swahili → You MUST reply entirely in Swahili
- User writes in English → You MUST reply entirely in English
- User writes in French → You MUST reply entirely in French
- User mixes Swahili and English → Reply in Swahili

If the user writes in Swahili, your ENTIRE response must be in Swahili.
Do NOT add any English words or sentences when the user wrote in Swahili.
Do NOT explain yourself in English when the user wrote in Swahili.

If the user writes in English, your ENTIRE response must be in English.
Do NOT add any Swahili words or sentences when the user wrote in English.

OTHER INSTRUCTIONS — FOLLOW STRICTLY:
1. When asked about companies, paint manufacturers, furniture suppliers, interior designers, or any
   category — look ONLY in the REGISTERED COMPANIES section above. Never use your own training
   knowledge or memory to name a company, even if you recognize the business or category. If a
   company is not listed in the REGISTERED COMPANIES section, you must NOT mention it, invent it,
   or describe it — not even as a generic example.
2. If no companies are registered in the requested category, say so clearly in one short sentence
   and suggest registering via WhatsApp +255755753883. Do NOT fill the gap with companies from
   general knowledge.
3. For all enquiries or to register a business, share the WhatsApp number: +255755753883
4. Never mention Instagram as the contact — always use WhatsApp +255755753883.
5. Be friendly, professional, and concise.
6. If someone asks something completely unrelated to construction/Ujenzi, politely redirect.

MANDATORY COMPANY LISTING FORMAT — THIS CONTROLS HOW THE APP RENDERS CLICKABLE BUTTONS:
Whenever you mention one or more companies from the REGISTERED COMPANIES section, you MUST format
EACH company as its own bullet line, copying the pipe-separated style EXACTLY as it appears in
the REGISTERED COMPANIES data — do NOT rewrite it into a sentence or paragraph. The app's frontend
parses this exact pattern to generate clickable Call / WhatsApp / Website / Map buttons. If you
turn it into prose, the user gets no buttons.

Required pattern per company (one line, in this exact order, omitting any field that has no data):
• Company Name | 📍 Location | 📞 Phone | 🌐 Website
You may add ONE short description line directly below the bullet (plain text, no pipes).

Correct example:
• Berger Paints International Limited | 📍 Dar es Salaam | 📞 +255688000777 | 🌐 https://www.bergerpaintsintl.com/
  Leading paint manufacturer offering a wide range of decorative and industrial paints.

Incorrect (never do this — it breaks the buttons):
"One of them is Berger Paints International Limited, you can reach them at +255688000777 or visit
their website at https://www.bergerpaintsintl.com/."

Any free-text intro ("Here are the paint manufacturers we have:") or outro ("Want more options?
Contact us on WhatsApp +255755753883.") should be written as normal prose OUTSIDE the bullet lines,
before or after the list — never mixed into a bullet line itself.
`;

function debugReply(msg) {
  return new Response(JSON.stringify({ reply: `🔧 DEBUG: ${msg}` }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

function whatsappFallback() {
  return new Response(JSON.stringify({ limitReached: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// ── Language detection ────────────────────────────────────────────────────
// Only longer, unambiguous Swahili words are used here. Short words like
// "na", "ya", "wa", "ni", "au", "je" were removed because they collide with
// common English fragments/typos and caused false positives (English
// messages being misclassified as Swahili). We also require at least 2
// distinct hits before concluding the message is Swahili.
const SWAHILI_WORDS = [
  "habari", "karibu", "asante", "tafadhali", "sijui", "ndiyo", "hapana",
  "ninaweza", "mnasaidiaje", "biashara", "wataalamu", "naomba", "nisaidie",
  "niambie", "gani", "yako", "wako", "yangu", "hii", "hiyo", "kwa", "lakini",
  "zaidi", "kidogo", "sawa", "nzuri", "shida", "tatizo", "msaada", "huduma",
  "bei", "pesa", "kazi", "nyumba", "jengo", "ujenzi", "mimi", "wewe", "sisi",
  "ninataka", "nataka", "naweza", "gharama", "vizuri", "mzuri", "leo", "kesho",
];
const SWAHILI_PATTERN = new RegExp(`\\b(${SWAHILI_WORDS.join("|")})\\b`, "gi");

function detectIsSwahili(text) {
  const hits = text.match(SWAHILI_PATTERN) || [];
  // Use the count of distinct matching words, not total occurrences,
  // so a single repeated word doesn't falsely trigger Swahili mode.
  const distinctHits = new Set(hits.map((h) => h.toLowerCase())).size;
  return distinctHits >= 2;
}

export default async (req) => {
  const DEBUG = process.env.DEBUG === "true";

  if (req.method !== "POST") {
    return DEBUG ? debugReply("Method not allowed (not a POST request)") : whatsappFallback();
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return DEBUG
      ? debugReply("GROQ_API_KEY is not set in Netlify environment variables. Go to console.groq.com → API Keys → Create API Key, then add it to Netlify Site Settings → Environment Variables.")
      : whatsappFallback();
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return DEBUG ? debugReply("Failed to parse request body as JSON") : whatsappFallback();
  }

  const { messages } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return DEBUG ? debugReply("No messages array found in request body") : whatsappFallback();
  }

  const sanitized = messages
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string"
    )
    .slice(-20);

  if (sanitized.length === 0) {
    return DEBUG ? debugReply("All messages were filtered out — check message format") : whatsappFallback();
  }

  const registrations = await fetchRegistrations();
  const companiesContext = buildCompaniesContext(registrations);
  const systemPrompt = `${STATIC_CONTEXT}\n\n${companiesContext}\n\n${BEHAVIOR_RULES}`;

  // Detect language from the last user message and build an instruction
  // that gets attached DIRECTLY to that message (rather than as a separate
  // trailing system message), so the model can't deprioritize it.
  const lastUserIndex = sanitized.map((m) => m.role).lastIndexOf("user");
  const lastUserMsg = lastUserIndex >= 0 ? sanitized[lastUserIndex].content : "";
  const isSwahili = detectIsSwahili(lastUserMsg);

  const langInstruction = isSwahili
    ? "\n\n[SYSTEM: The message above is in Swahili. Reply ENTIRELY in Swahili — do not include any English words or sentences.]"
    : "\n\n[SYSTEM: Reply in the SAME language as the message above. If it is in English, reply ENTIRELY in English — do not switch to Swahili or any other language.]";

  const sanitizedWithReminder = sanitized.map((m, i) =>
    i === lastUserIndex ? { ...m, content: m.content + langInstruction } : m
  );

  let response;
  try {
    response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 1024,
        temperature: 0.4,
        messages: [
          { role: "system", content: systemPrompt },
          ...sanitizedWithReminder,
        ],
      }),
    });
  } catch (err) {
    return DEBUG
      ? debugReply(`Network error calling Groq API: ${err.message}`)
      : whatsappFallback();
  }

  let data;
  try {
    data = await response.json();
  } catch {
    return DEBUG
      ? debugReply(`Groq returned non-JSON response. HTTP status: ${response.status}`)
      : whatsappFallback();
  }

  if (!response.ok) {
    const errMsg = data?.error?.message || "Unknown error";
    const errCode = data?.error?.code || response.status;
    return DEBUG
      ? debugReply(`Groq API error ${errCode}: ${errMsg}`)
      : whatsappFallback();
  }

  const reply = data.choices?.[0]?.message?.content ?? "";

  if (!reply) {
    return DEBUG
      ? debugReply(`Groq returned empty reply. Full response: ${JSON.stringify(data).slice(0, 300)}`)
      : whatsappFallback();
  }

  return new Response(JSON.stringify({ reply }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
};

export const config = {
  path: "/api/chat",
};