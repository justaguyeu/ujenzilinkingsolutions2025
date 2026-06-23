/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Brand colours ─────────────────────────────────────────────────────────────
const GOLD       = "#DB9029";
const GOLD_DARK  = "#b87520";
const GOLD_LIGHT = "#f5e0b0";
const WHITE      = "#ffffff";
const BLACK      = "#000000";
const GRAY_TEXT  = "#444444";
const BORDER     = "#e8c97a";

// ── Responsive CSS ────────────────────────────────────────────────────────────
const panelStyles = `
  /* ── FAB: AI chat button ── */
  .u-fab-ai {
    position: fixed;
    z-index: 9999;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${GOLD};
    box-shadow: 0 4px 24px ${GOLD}88;
  }
  @media (min-width: 640px) { .u-fab-ai { bottom: 92px; right: 24px; } }
  @media (max-width: 639px) { .u-fab-ai { bottom: 84px; right: 16px; } }

  /* ── FAB: WhatsApp button ── */
  .u-fab-wa {
    position: fixed;
    z-index: 9999;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #25D366;
    box-shadow: 0 4px 24px #25D36688;
  }
  @media (min-width: 640px) { .u-fab-wa { bottom: 24px; right: 24px; } }
  @media (max-width: 639px) { .u-fab-wa { bottom: 16px; right: 16px; } }

  /* ── AI Chat panel ── */
  .u-chat-panel {
    position: fixed;
    z-index: 9998;
    display: flex;
    flex-direction: column;
    background: ${WHITE};
    border: 1.5px solid ${BORDER};
    box-shadow: 0 8px 40px ${GOLD}44;
    overflow: hidden;
  }
  @media (min-width: 640px) {
    .u-chat-panel {
      right: 16px;
      bottom: 164px;
      width: 400px;
      height: min(560px, calc(100vh - 190px));
      border-radius: 20px;
    }
  }
  @media (max-width: 639px) {
    .u-chat-panel {
      left: 8px;
      right: 8px;
      bottom: 152px;
      width: auto;
      height: min(460px, calc(100dvh - 185px));
      border-radius: 20px;
    }
  }

  /* ── WhatsApp popup ── */
  .u-wa-popup {
    position: fixed;
    z-index: 9998;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  }
  @media (min-width: 640px) {
    .u-wa-popup { right: 16px; bottom: 164px; width: 300px; }
  }
  @media (max-width: 639px) {
    .u-wa-popup { left: 8px; right: 8px; bottom: 152px; width: auto; max-width: 340px; margin: 0 auto; }
  }

  /* ── Input placeholder ── */
  .u-input::placeholder { color: #aaa; }
  .u-input:focus { outline: none; }

  /* ── Bounce animation for typing dots ── */
  @keyframes u-bounce {
    0%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-6px); }
  }
  .u-dot { animation: u-bounce 0.9s infinite; }
  .u-dot:nth-child(2) { animation-delay: 0.15s; }
  .u-dot:nth-child(3) { animation-delay: 0.30s; }

  /* ── Ping animation for FAB glow ── */
  @keyframes u-ping {
    0%   { transform: scale(1); opacity: 0.4; }
    75%, 100% { transform: scale(1.8); opacity: 0; }
  }
  .u-ping { animation: u-ping 1.6s cubic-bezier(0,0,0.2,1) infinite; }
`;

// ── SVG icons (reused) ────────────────────────────────────────────────────────
const WaIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.533 5.845L.057 23.428a.75.75 0 0 0 .915.915l5.683-1.476A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.504-5.23-1.385l-.374-.22-3.376.877.895-3.279-.242-.389A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
  </svg>
);

const CloseIcon = ({ size = 20, color = "white" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const ChatBubbleIcon = ({ size = 18, color = "white" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

// ── Company extractor ─────────────────────────────────────────────────────────
function extractCompanies(text) {
  const URL_RE      = /https?:\/\/[^\s,|]+/g;
  const MAPS_RE     = /maps\.(app\.goo\.gl|google\.com)\/[^\s,|]+/i;
  const INSTAGRAM_RE = /instagram\.com\/([^\s/|,]+)/i;

  function isCompanyLine(s) {
    return /^[•*\-]\s+\S/.test(s) || /^\d+[.)]\s+\S/.test(s);
  }

  function parseLine(raw) {
    const cleaned = raw.replace(/^[•*\-]\s+|^\d+[.)]\s+/, "").replace(/\*\*/g, "").trim();
    const c = { name: "", phone: "", website: "", instagram: "", location: "", mapUrl: "", description: "" };

    if (cleaned.includes("|") && (cleaned.includes("📍") || cleaned.includes("📞") || cleaned.includes("🌐"))) {
      const parts = cleaned.split("|").map(s => s.trim());
      c.name = parts[0].replace(/\*\*/g, "").trim();
      for (let j = 1; j < parts.length; j++) {
        const p = parts[j];
        if (p.startsWith("📍")) c.location = p.replace("📍", "").trim();
        else if (p.startsWith("📞")) c.phone = p.replace("📞", "").trim();
        else if (p.startsWith("🌐")) c.website = p.replace("🌐", "").trim();
        else if (/instagram:/i.test(p)) c.instagram = p.replace(/instagram:/i, "").trim();
      }
    } else {
      const urls = [...cleaned.matchAll(new RegExp(URL_RE.source, "g"))].map(m => m[0]);
      let rem = cleaned;
      urls.forEach(u => { rem = rem.replace(u, ""); });
      const tokens = rem.split(/\s*[-|]\s*/).map(s => s.trim()).filter(Boolean);
      c.name = tokens[0] || "";
      for (const url of urls) {
        if (MAPS_RE.test(url)) c.mapUrl = url;
        else if (INSTAGRAM_RE.test(url)) { const m = url.match(INSTAGRAM_RE); c.instagram = m ? m[1].replace(/\/$/, "") : ""; }
        else if (!c.website) c.website = url;
      }
      for (let k = 1; k < tokens.length; k++) {
        const t = tokens[k].trim();
        if (t && /^[+\d][\d\s\-()+.]{5,}$/.test(t) && !c.phone) c.phone = t;
      }
    }
    return c;
  }

  const lines = text.split("\n");
  const companies = [], preamble = [], postamble = [];
  let inCompanies = false;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (isCompanyLine(trimmed)) {
      inCompanies = true;
      const parsed = parseLine(trimmed);
      if (parsed.name) {
        if (i + 1 < lines.length) {
          const next = lines[i + 1].trim();
          if (next && !isCompanyLine(next) && next.length < 250 && !/^(Ikiwa|If |Kwa |For |Please|Tafadhali)/i.test(next)) {
            parsed.description = next; i++;
          }
        }
        companies.push(parsed);
      }
    } else {
      if (!inCompanies) preamble.push(lines[i]);
      else postamble.push(lines[i]);
    }
  }

  if (companies.length === 0) return null;
  return { preamble: preamble.join("\n").trim(), companies, postamble: postamble.join("\n").trim() };
}

// ── Btn style helper ──────────────────────────────────────────────────────────
function btnStyle(bg) {
  return { display: "inline-flex", alignItems: "center", gap: 4, background: bg, color: "white", fontSize: 11, fontWeight: 600, padding: "4px 9px", borderRadius: 20, textDecoration: "none", whiteSpace: "nowrap" };
}

// ── Company card ──────────────────────────────────────────────────────────────
function CompanyCard({ company }) {
  const phoneHref     = company.phone ? `tel:${company.phone.replace(/\s+/g, "")}` : null;
  const waHref        = company.phone ? `https://wa.me/${company.phone.replace(/[^0-9]/g, "")}` : null;
  const websiteHref   = company.website ? (company.website.startsWith("http") ? company.website : `https://${company.website}`) : null;
  const instagramHref = company.instagram ? (company.instagram.startsWith("http") ? company.instagram : `https://instagram.com/${company.instagram.replace("@", "").replace(/\/$/, "")}`) : null;
  const mapHref       = company.mapUrl ? company.mapUrl : company.location ? `https://maps.google.com/?q=${encodeURIComponent(company.location)}` : null;

  return (
    <div style={{ background: WHITE, border: `1.5px solid ${BORDER}`, borderRadius: 14, padding: "10px 12px", marginBottom: 8 }}>
      <p style={{ fontWeight: 700, fontSize: 13, color: BLACK, marginBottom: 4, lineHeight: 1.3 }}>{company.name}</p>
      {company.description && <p style={{ fontSize: 11, color: GRAY_TEXT, marginBottom: 6, lineHeight: 1.4 }}>{company.description}</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {company.phone && <a href={phoneHref} style={btnStyle("#2563eb")}><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.45 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.55a16 16 0 0 0 6.54 6.54l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>Call</a>}
        {company.phone && <a href={waHref} target="_blank" rel="noopener noreferrer" style={btnStyle("#25D366")}><WaIcon size={12}/>WhatsApp</a>}
        {company.instagram && <a href={instagramHref} target="_blank" rel="noopener noreferrer" style={btnStyle("#E1306C")}><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>Instagram</a>}
        {company.website && <a href={websiteHref} target="_blank" rel="noopener noreferrer" style={btnStyle(GOLD_DARK)}><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>Website</a>}
        {mapHref && <a href={mapHref} target="_blank" rel="noopener noreferrer" style={btnStyle("#6b7280")}><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Map</a>}
      </div>
    </div>
  );
}

// ── WA inline button ──────────────────────────────────────────────────────────
function WaButton() {
  return (
    <a href="https://wa.me/255755753883" target="_blank" rel="noopener noreferrer"
      style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#25D366", color: "white", fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, textDecoration: "none", whiteSpace: "nowrap", verticalAlign: "middle", margin: "0 2px" }}>
      <WaIcon size={11}/>Chat on WhatsApp
    </a>
  );
}

function renderLineSegments(line, key) {
  const WA_RE = /\+?255\s?755\s?753\s?883/g;
  const segments = [];
  let last = 0, m;
  WA_RE.lastIndex = 0;
  while ((m = WA_RE.exec(line)) !== null) {
    if (m.index > last) segments.push({ type: "text", val: line.slice(last, m.index) });
    segments.push({ type: "wa" });
    last = m.index + m[0].length;
  }
  if (last < line.length) segments.push({ type: "text", val: line.slice(last) });
  return <span key={key}>{segments.map((seg, si) => seg.type === "wa" ? <WaButton key={si}/> : <span key={si}>{seg.val}</span>)}</span>;
}

function ChatText({ text }) {
  const boldParts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {boldParts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
        return part.split("\n").map((line, j, arr) => (
          <span key={`${i}-${j}`}>{renderLineSegments(line, `s-${i}-${j}`)}{j < arr.length - 1 && <br/>}</span>
        ));
      })}
    </span>
  );
}

function AssistantMessage({ content }) {
  const parsed = extractCompanies(content);
  const bubbleStyle = { padding: "8px 12px", borderRadius: "16px", borderBottomLeftRadius: 4, fontSize: 13, lineHeight: 1.5, background: GOLD_LIGHT, color: BLACK, border: `1px solid ${BORDER}` };

  if (!parsed) return <div style={{ maxWidth: "78%", ...bubbleStyle }}><ChatText text={content}/></div>;

  return (
    <div style={{ maxWidth: "85%" }}>
      {parsed.preamble && <div style={{ ...bubbleStyle, marginBottom: 8 }}><ChatText text={parsed.preamble}/></div>}
      <div>{parsed.companies.map((c, i) => <CompanyCard key={i} company={c}/>)}</div>
      {parsed.postamble && <div style={{ ...bubbleStyle, marginTop: 8 }}><ChatText text={parsed.postamble}/></div>}
    </div>
  );
}

// ── Main widget ───────────────────────────────────────────────────────────────
export default function AIChatWidget() {
  const [open, setOpen]                 = useState(false);
  const [messages, setMessages]         = useState([]);
  const [input, setInput]               = useState("");
  const [loading, setLoading]           = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [waOpen, setWaOpen]             = useState(false);
  const [waMsg, setWaMsg]               = useState("");
  const waInputRef = useRef(null);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  useEffect(() => { if (open)   setTimeout(() => inputRef.current?.focus(),   100); }, [open]);
  useEffect(() => { if (waOpen) setTimeout(() => waInputRef.current?.focus(), 100); }, [waOpen]);

  // ── Toggle logic: opening one closes the other ────────────────────────────
  function toggleAI() {
    setOpen(v => {
      if (!v) setWaOpen(false); // close WA when opening AI
      return !v;
    });
  }

  function toggleWA() {
    setWaOpen(v => {
      if (!v) setOpen(false); // close AI when opening WA
      return !v;
    });
  }

  function openWhatsApp() {
    const msg = waMsg.trim();
    window.open(msg ? `https://wa.me/255755753883?text=${encodeURIComponent(msg)}` : "https://wa.me/255755753883", "_blank");
    setWaMsg("");
    setWaOpen(false);
  }

  function handleWaKey(e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); openWhatsApp(); } }

  async function sendMessage(text) {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setLimitReached(false);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: newMessages }) });
      let data;
      try { data = JSON.parse(await res.text()); } catch { setLimitReached(true); setLoading(false); return; }
      if (data.limitReached || !res.ok || data.error) { setLimitReached(true); setLoading(false); return; }
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch { setLimitReached(true); } finally { setLoading(false); }
  }

  function handleKey(e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }
  function clearChat() { setMessages([]); setLimitReached(false); }

  return (
    <>
      <style>{panelStyles}</style>

      {/* ── AI Chat FAB ───────────────────────────────────────────────────── */}
      <motion.button
        onClick={toggleAI}
        aria-label="Open AI chat assistant"
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
        className="u-fab-ai"
      >
        {!open && <span className="u-ping" style={{ position: "absolute", inset: 0, borderRadius: "50%", background: GOLD }}/>}
        <AnimatePresence mode="wait" initial={false}>
          {open
            ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><CloseIcon size={22}/></motion.span>
            : <motion.svg key="search" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></motion.svg>
          }
        </AnimatePresence>
      </motion.button>

      {/* ── WhatsApp FAB ───────────────────────────────────────────────────── */}
      <motion.button
        onClick={toggleWA}
        aria-label="Chat on WhatsApp"
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
        className="u-fab-wa"
      >
        {!waOpen && <span className="u-ping" style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#25D366" }}/>}
        <AnimatePresence mode="wait" initial={false}>
          {waOpen
            ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><CloseIcon size={22}/></motion.span>
            : <motion.span key="wa" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><WaIcon size={28}/></motion.span>
          }
        </AnimatePresence>
      </motion.button>

      {/* ── WhatsApp popup ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {waOpen && (
          <motion.div
            className="u-wa-popup"
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#25D366" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <WaIcon size={18}/>
                </div>
                <div>
                  <p style={{ color: WHITE, fontWeight: 600, fontSize: 14, lineHeight: 1.2 }}>Ujenzi Support</p>
                  <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 11 }}>Typically replies instantly</p>
                </div>
              </div>
              <button onClick={() => setWaOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: WHITE, opacity: 0.8, padding: 4 }}>
                <CloseIcon size={18}/>
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: 16, background: "#f0faf4" }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "flex-start" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
                  <WaIcon size={14}/>
                </div>
                {/* ── Bubble: flex:1 + minWidth:0 ensures text wraps, never overflows ── */}
                <div style={{ flex: 1, minWidth: 0, background: WHITE, borderRadius: "0 12px 12px 12px", padding: "10px 12px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", fontSize: 13, wordBreak: "break-word" }}>
                  <p style={{ fontWeight: 600, color: "#25D366", marginBottom: 4 }}>Ujenzi Linking Solutions</p>
                  <p style={{ color: BLACK, marginBottom: 4 }}>Hello! 👋 Welcome to Ujenzi.</p>
                  <p style={{ color: BLACK, lineHeight: 1.5 }}>Type your message and we'll reply on WhatsApp.</p>
                </div>
              </div>

              {/* Input row */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  ref={waInputRef}
                  type="text"
                  value={waMsg}
                  onChange={(e) => setWaMsg(e.target.value)}
                  onKeyDown={handleWaKey}
                  placeholder="Type a message…"
                  className="u-input"
                  style={{ flex: 1, minWidth: 0, borderRadius: 24, padding: "10px 16px", fontSize: 13, background: WHITE, border: "1.5px solid #cce8d4", color: BLACK, height: 42, boxSizing: "border-box" }}
                />
                <button onClick={openWhatsApp} disabled={!waMsg.trim()}
                  style={{ width: 42, height: 42, borderRadius: "50%", flexShrink: 0, background: "#25D366", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: waMsg.trim() ? 1 : 0.4, transition: "opacity 0.15s" }}>
                  <SendIcon/>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── AI Chat panel ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="u-chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", background: GOLD, flexShrink: 0 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ChatBubbleIcon size={18}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: 14, color: WHITE, lineHeight: 1.2 }}>Ujenzi Assistant</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>Ask anything about our platform</p>
              </div>
              {messages.length > 0 && (
                <button onClick={clearChat} title="Clear chat"
                  style={{ background: "none", border: "none", cursor: "pointer", color: WHITE, padding: 4, opacity: 0.8 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
                  </svg>
                </button>
              )}
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 12, background: WHITE }}>

              {/* Welcome */}
              {messages.length === 0 && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", paddingTop: 20, gap: 12 }}>
                  <div style={{ width: 60, height: 60, borderRadius: "50%", background: GOLD_LIGHT, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ChatBubbleIcon size={28} color={GOLD}/>
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 15, color: BLACK }}>Hello! 👋</p>
                    <p style={{ fontSize: 13, marginTop: 6, color: GRAY_TEXT, lineHeight: 1.5 }}>Ask me anything about Ujenzi Linking Solutions — in any language.</p>
                  </div>
                </div>
              )}

              {/* Message bubbles */}
              {messages.map((msg, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}
                  style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-start" }}>
                  {msg.role === "assistant" && (
                    <div style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, marginRight: 8, marginTop: 2, background: GOLD, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <ChatBubbleIcon size={13}/>
                    </div>
                  )}
                  {msg.role === "user"
                    ? <div style={{ maxWidth: "78%", padding: "9px 13px", borderRadius: "16px", borderBottomRightRadius: 4, fontSize: 13, lineHeight: 1.5, background: GOLD, color: WHITE }}><ChatText text={msg.content}/></div>
                    : <AssistantMessage content={msg.content}/>
                  }
                </motion.div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, background: GOLD, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ChatBubbleIcon size={13}/>
                  </div>
                  <div style={{ padding: "10px 14px", borderRadius: 16, background: GOLD_LIGHT, border: `1px solid ${BORDER}` }}>
                    <span style={{ display: "flex", gap: 4, alignItems: "center", height: 16 }}>
                      {[0, 1, 2].map(d => <span key={d} className="u-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: GOLD, display: "inline-block", animationDelay: `${d * 0.15}s` }}/>)}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Limit reached / error */}
              {limitReached && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex" }}>
                  <div style={{ maxWidth: "85%", borderRadius: 16, borderBottomLeftRadius: 4, padding: 16, fontSize: 13, lineHeight: 1.5, background: GOLD_LIGHT, border: `1px solid ${BORDER}` }}>
                    <p style={{ marginBottom: 12, color: BLACK }}>I'm unable to respond right now. Please contact us directly on WhatsApp — we're happy to help! 😊</p>
                    <a href="https://wa.me/255755753883" target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 12, fontWeight: 600, color: WHITE, fontSize: 13, background: "#25D366", textDecoration: "none" }}>
                      <WaIcon size={16}/>Chat on WhatsApp
                    </a>
                  </div>
                </motion.div>
              )}

              <div ref={bottomRef}/>
            </div>

            {/* Input area */}
            <div style={{ flexShrink: 0, padding: "10px 12px", display: "flex", alignItems: "center", gap: 8, background: WHITE, borderTop: `1.5px solid ${BORDER}` }}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Search a product or service…"
                disabled={loading}
                className="u-input"
                style={{
                  flex: 1,
                  minWidth: 0,
                  height: 44,
                  borderRadius: 12,
                  padding: "0 14px",
                  fontSize: 14,
                  background: GOLD_LIGHT,
                  border: `1.5px solid ${BORDER}`,
                  color: BLACK,
                  opacity: loading ? 0.5 : 1,
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                aria-label="Send message"
                style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: GOLD, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: (!input.trim() || loading) ? 0.4 : 1, transition: "opacity 0.15s" }}
              >
                <SendIcon/>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}