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
IMPORTANT INSTRUCTIONS — FOLLOW STRICTLY:
1. Always reply in the SAME LANGUAGE the user writes in. Swahili → Swahili, French → French, etc.
2. When asked about companies, furniture suppliers, interior designers, or any category — look in
   the REGISTERED COMPANIES section above and list them with their contact details.
3. If no companies are registered in a category, say so clearly and suggest registering.
4. For all enquiries or to register a business, share the WhatsApp number: +255755753883
5. Never mention Instagram as the contact — always use WhatsApp +255755753883.
6. Be friendly, professional, and concise.
7. Do not make up companies or services not listed in the data above.
8. If someone asks something completely unrelated to construction/Ujenzi, politely redirect.
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
        temperature: 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          ...sanitized,
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