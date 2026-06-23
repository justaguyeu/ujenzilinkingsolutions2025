/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Brand colours (gold + white + black) ─────────────────────────────────────
const GOLD        = "#DB9029";
const GOLD_DARK   = "#b87520";
const GOLD_LIGHT  = "#f5e0b0";
const WHITE       = "#ffffff";
const BLACK       = "#000000";
const GRAY_TEXT   = "#444444";
const BORDER      = "#e8c97a";

// ── Robust company extractor — handles both pipe and dash-separated AI output ─
function extractCompanies(text) {
  const lines = text.split("\n");
  const companies = [];
  const preamble = [];
  const postamble = [];
  let inCompanies = false;

  // Helpers
  const URL_RE = /https?:\/\/[^\s,|]+/gi;
  const PHONE_RE = /(?:\+?[\d\s\-().]{7,20})/g;
  const INSTAGRAM_RE = /instagram\.com\/([^\s/|,]+)/i;
  const MAPS_RE = /maps\.(app\.goo\.gl|google\.com)\/[^\s,|]+/i;

  function parseLine(raw) {
    // Strip leading bullet/number/dot
    const cleaned = raw.replace(/^[•\-*]\s*|^\d+[.)]\s*/, "").replace(/\*\*/g, "").trim();

    const company = { name: "", phone: "", website: "", instagram: "", location: "", mapUrl: "", description: "" };

    // Try pipe-separated first: "Name | 📍 loc | 📞 phone | 🌐 url"
    if (cleaned.includes("|")) {
      const parts = cleaned.split("|").map(s => s.trim());
      company.name = parts[0] || "";
      for (let j = 1; j < parts.length; j++) {
        const p = parts[j];
        if (p.startsWith("📍")) company.location = p.replace("📍", "").trim();
        else if (p.startsWith("📞")) company.phone = p.replace("📞", "").trim();
        else if (p.startsWith("🌐")) company.website = p.replace("🌐", "").trim();
        else if (/instagram:/i.test(p)) company.instagram = p.replace(/instagram:/i, "").trim();
      }
    } else {
      // Dash-separated: "Name - url - phone - url2"
      // Extract all URLs first
      const urls = [...(cleaned.matchAll(URL_RE))].map(m => m[0]);
      // Remove URLs from string to get remaining tokens
      let remainder = cleaned.replace(URL_RE, "|||URL|||");
      const tokens = remainder.split(/\s*-\s*|\|\|\|URL\|\|\|/).map(s => s.trim()).filter(Boolean);

      // First non-empty, non-URL token is the name
      company.name = tokens[0] || "";

      // Classify each URL
      for (const url of urls) {
        if (MAPS_RE.test(url)) {
          company.mapUrl = url;
        } else if (INSTAGRAM_RE.test(url)) {
          const match = url.match(INSTAGRAM_RE);
          company.instagram = match ? match[1] : url;
        } else {
          // Generic website — skip maps.app.goo.gl already caught above
          if (!company.website) company.website = url;
        }
      }

      // Find phone number in remaining tokens (skip name and URLs)
      for (let k = 1; k < tokens.length; k++) {
        const t = tokens[k];
        if (!t || t.startsWith("http")) continue;
        const phoneMatch = t.match(/^[\+\d][\d\s\-().]{5,18}$/);
        if (phoneMatch && !company.phone) {
          company.phone = t.trim();
        }
      }
    }

    return company;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    const isBullet =
      trimmed.startsWith("•") ||
      trimmed.startsWith("-") ||
      /^\d+[.)]\s/.test(trimmed);

    // Also catch plain lines that contain a company-like name followed by dash+url/phone
    const looksLikeCompany =
      isBullet ||
      (!inCompanies && /^[A-Z].*?\s+-\s+(https?:\/\/|\+?\d)/.test(trimmed));

    if (looksLikeCompany && trimmed.length > 3) {
      inCompanies = true;
      const parsed = parseLine(trimmed);
      if (parsed.name) {
        // Check next line for indented description
        if (i + 1 < lines.length) {
          const next = lines[i + 1].trim();
          const isNextCompany =
            next.startsWith("•") ||
            next.startsWith("-") ||
            /^\d+[.)]\s/.test(next) ||
            /^[A-Z].*?\s+-\s+(https?:\/\/|\+?\d)/.test(next);
          if (!isNextCompany && next && next.length < 200) {
            parsed.description = next;
            i++;
          }
        }
        companies.push(parsed);
      }
    } else {
      if (!inCompanies) preamble.push(line);
      else postamble.push(line);
    }
  }

  if (companies.length === 0) return null;
  return {
    preamble: preamble.join("\n").trim(),
    companies,
    postamble: postamble.join("\n").trim(),
  };
}

function CompanyCard({ company }) {
  const hasPhone = !!company.phone;
  const hasWebsite = !!company.website;
  const hasInstagram = !!company.instagram;
  const hasMap = !!(company.mapUrl || company.location);

  const phoneHref = company.phone
    ? `tel:${company.phone.replace(/\s+/g, "")}`
    : null;
  const waHref = company.phone
    ? `https://wa.me/${company.phone.replace(/[^0-9]/g, "")}`
    : null;
  const websiteHref = company.website?.startsWith("http")
    ? company.website
    : company.website ? `https://${company.website}` : null;
  const instagramHref = company.instagram?.startsWith("http")
    ? company.instagram
    : company.instagram
      ? `https://instagram.com/${company.instagram.replace("@", "").replace(/\/$/, "")}`
      : null;
  const mapHref = company.mapUrl
    ? company.mapUrl
    : company.location
      ? `https://maps.google.com/?q=${encodeURIComponent(company.location)}`
      : null;

  return (
    <div
      style={{
        background: WHITE,
        border: `1.5px solid ${BORDER}`,
        borderRadius: 14,
        padding: "10px 12px",
        marginBottom: 8,
      }}
    >
      {/* Company name */}
      <p style={{ fontWeight: 700, fontSize: 13, color: BLACK, marginBottom: 4, lineHeight: 1.3 }}>
        {company.name}
      </p>

      {/* Description */}
      {company.description && (
        <p style={{ fontSize: 11, color: GRAY_TEXT, marginBottom: 6, lineHeight: 1.4 }}>
          {company.description}
        </p>
      )}

      {/* Contact buttons */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {hasPhone && (
          <a href={phoneHref} style={btnStyle("#2563eb")}>
            {/* Phone icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
              fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.45 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.55a16 16 0 0 0 6.54 6.54l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            Call
          </a>
        )}

        {hasPhone && (
          <a href={waHref} target="_blank" rel="noopener noreferrer" style={btnStyle("#25D366")}>
            {/* WhatsApp icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.533 5.845L.057 23.428a.75.75 0 0 0 .915.915l5.683-1.476A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.504-5.23-1.385l-.374-.22-3.376.877.895-3.279-.242-.389A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            WhatsApp
          </a>
        )}

        {hasInstagram && (
          <a href={instagramHref} target="_blank" rel="noopener noreferrer" style={btnStyle("#E1306C")}>
            {/* Instagram icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
              fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
            Instagram
          </a>
        )}

        {hasWebsite && (
          <a href={websiteHref} target="_blank" rel="noopener noreferrer" style={btnStyle(GOLD_DARK)}>
            {/* Globe icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
              fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            Website
          </a>
        )}

        {hasMap && (
          <a href={mapHref} target="_blank" rel="noopener noreferrer" style={btnStyle("#6b7280")}>
            {/* Map pin icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
              fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            Map
          </a>
        )}
      </div>
    </div>
  );
}

function btnStyle(bg) {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    background: bg,
    color: "white",
    fontSize: 11,
    fontWeight: 600,
    padding: "4px 9px",
    borderRadius: 20,
    textDecoration: "none",
    whiteSpace: "nowrap",
  };
}

function ChatText({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          part.split("\n").map((line, j, arr) => (
            <span key={`${i}-${j}`}>
              {line}
              {j < arr.length - 1 && <br />}
            </span>
          ))
        )
      )}
    </span>
  );
}

// Renders an assistant message — plain text or company cards
function AssistantMessage({ content }) {
  const parsed = extractCompanies(content);

  if (!parsed) {
    return (
      <div className="max-w-[78%] px-3 py-2 rounded-2xl text-sm leading-relaxed"
        style={{ background: GOLD_LIGHT, color: BLACK, borderBottomLeftRadius: 4, border: `1px solid ${BORDER}` }}>
        <ChatText text={content} />
      </div>
    );
  }

  return (
    <div className="max-w-[85%]">
      {/* Preamble text */}
      {parsed.preamble && (
        <div className="px-3 py-2 rounded-2xl text-sm leading-relaxed mb-2"
          style={{ background: GOLD_LIGHT, color: BLACK, border: `1px solid ${BORDER}`, borderBottomLeftRadius: 4 }}>
          <ChatText text={parsed.preamble} />
        </div>
      )}

      {/* Company cards */}
      <div>
        {parsed.companies.map((company, i) => (
          <CompanyCard key={i} company={company} />
        ))}
      </div>

      {/* Postamble text */}
      {parsed.postamble && (
        <div className="px-3 py-2 rounded-2xl text-sm leading-relaxed mt-2"
          style={{ background: GOLD_LIGHT, color: BLACK, border: `1px solid ${BORDER}`, borderBottomLeftRadius: 4 }}>
          <ChatText text={parsed.postamble} />
        </div>
      )}
    </div>
  );
}

export default function AIChatWidget() {
  const [open, setOpen]                 = useState(false);
  const [messages, setMessages]         = useState([]);
  const [input, setInput]               = useState("");
  const [loading, setLoading]           = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [waOpen, setWaOpen]             = useState(false);
  const [waMsg, setWaMsg]               = useState("");
  const waInputRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    if (waOpen) setTimeout(() => waInputRef.current?.focus(), 100);
  }, [waOpen]);

  function openWhatsApp() {
    const msg = waMsg.trim();
    const url = msg
      ? `https://wa.me/255755753883?text=${encodeURIComponent(msg)}`
      : "https://wa.me/255755753883";
    window.open(url, "_blank");
    setWaMsg("");
    setWaOpen(false);
  }

  function handleWaKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      openWhatsApp();
    }
  }

  async function sendMessage(text) {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setLimitReached(false);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      let data;
      try {
        const raw = await res.text();
        data = JSON.parse(raw);
      } catch {
        setLimitReached(true);
        setLoading(false);
        return;
      }

      if (data.limitReached || !res.ok || data.error) {
        setLimitReached(true);
        setLoading(false);
        return;
      }

      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch {
      setLimitReached(true);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function clearChat() {
    setMessages([]);
    setLimitReached(false);
  }

  return (
    <>
      {/* ── AI Chat floating button ─────────────────────────────────────────── */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open AI chat assistant"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        style={{ background: GOLD, boxShadow: `0 4px 24px ${GOLD}66` }}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center text-white"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.svg key="close"
              initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}
              xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
              fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </motion.svg>
          ) : (
            <motion.svg key="chat"
              initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}
              xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
              fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </motion.svg>
          )}
        </AnimatePresence>
        {!open && (
          <span className="absolute inset-0 rounded-full animate-ping opacity-30"
            style={{ background: GOLD }} />
        )}
      </motion.button>

      {/* ── WhatsApp popup bubble ───────────────────────────────────────────── */}
      <AnimatePresence>
        {waOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-4 z-50 w-72 rounded-2xl overflow-hidden"
            style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}
          >
            <div className="flex items-center justify-between px-4 py-3"
              style={{ background: "#25D366" }}>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.25)" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.533 5.845L.057 23.428a.75.75 0 0 0 .915.915l5.683-1.476A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.504-5.23-1.385l-.374-.22-3.376.877.895-3.279-.242-.389A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm leading-tight">Ujenzi Support</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.85)" }}>Typically replies instantly</p>
                </div>
              </div>
              <button onClick={() => setWaOpen(false)}
                className="text-white opacity-70 hover:opacity-100 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="px-4 py-4" style={{ background: "#f0faf4" }}>
              <div className="flex items-start gap-2 mb-4">
                <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center mt-0.5"
                  style={{ background: "#25D366" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.533 5.845L.057 23.428a.75.75 0 0 0 .915.915l5.683-1.476A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.504-5.23-1.385l-.374-.22-3.376.877.895-3.279-.242-.389A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  </svg>
                </div>
                <div className="rounded-2xl rounded-tl-none px-3 py-2 text-sm"
                  style={{ background: WHITE, color: BLACK, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                  <p className="font-semibold mb-0.5" style={{ color: "#25D366" }}>Ujenzi Linking Solutions</p>
                  <p>Hello! 👋 Welcome to Ujenzi.</p>
                  <p className="mt-1">Type your message and we'll reply on WhatsApp.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  ref={waInputRef}
                  type="text"
                  value={waMsg}
                  onChange={(e) => setWaMsg(e.target.value)}
                  onKeyDown={handleWaKey}
                  placeholder="Type a message…"
                  className="flex-1 rounded-full px-4 py-2.5 text-sm outline-none"
                  style={{ background: WHITE, border: "1.5px solid #cce8d4", color: BLACK }}
                />
                <button
                  onClick={openWhatsApp}
                  disabled={!waMsg.trim()}
                  aria-label="Send on WhatsApp"
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-opacity disabled:opacity-40"
                  style={{ background: "#25D366" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── WhatsApp floating button ────────────────────────────────────────── */}
      <motion.button
        onClick={() => setWaOpen((v) => !v)}
        aria-label="Chat on WhatsApp"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center"
        style={{ background: "#25D366", boxShadow: "0 4px 24px #25D36655" }}
      >
        <span className="absolute inset-0 rounded-full animate-ping opacity-25"
          style={{ background: "#25D366" }} />
        <AnimatePresence mode="wait" initial={false}>
          {waOpen ? (
            <motion.svg key="waclose"
              initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}
              xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
              fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </motion.svg>
          ) : (
            <motion.svg key="waicon"
              initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}
              xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.533 5.845L.057 23.428a.75.75 0 0 0 .915.915l5.683-1.476A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.504-5.23-1.385l-.374-.22-3.376.877.895-3.279-.242-.389A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Chat panel ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed bottom-44 right-4 z-50 w-[90vw] max-w-sm flex flex-col rounded-2xl overflow-hidden"
            style={{
              height: "min(560px, 80vh)",
              background: WHITE,
              border: `1.5px solid ${BORDER}`,
              boxShadow: `0 8px 40px ${GOLD}33`,
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 shrink-0" style={{ background: GOLD }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "rgba(255,255,255,0.25)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                  fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-tight text-white truncate">Ujenzi Assistant</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.8)" }}>Ask anything about our platform</p>
              </div>
              {messages.length > 0 && (
                <button onClick={clearChat} title="Clear chat"
                  className="p-1 rounded transition-opacity hover:opacity-70" style={{ color: WHITE }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
                  </svg>
                </button>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth" style={{ background: WHITE }}>

              {/* Welcome state */}
              {messages.length === 0 && (
                <div className="flex flex-col items-center text-center pt-4 pb-2 gap-3">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: GOLD_LIGHT }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
                      fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: BLACK }}>Hello!</p>
                    <p className="text-xs mt-1" style={{ color: GRAY_TEXT }}>
                      Ask me anything about Ujenzi Linking Solutions — in any language.
                    </p>
                  </div>
                </div>
              )}

              {/* Message bubbles */}
              {messages.map((msg, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 mr-2"
                      style={{ background: GOLD }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                        fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </div>
                  )}

                  {msg.role === "user" ? (
                    <div className="max-w-[78%] px-3 py-2 rounded-2xl text-sm leading-relaxed"
                      style={{ background: GOLD, color: WHITE, borderBottomRightRadius: 4 }}>
                      <ChatText text={msg.content} />
                    </div>
                  ) : (
                    <AssistantMessage content={msg.content} />
                  )}
                </motion.div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex justify-start items-end gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: GOLD }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                      fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <div className="px-3 py-2 rounded-2xl" style={{ background: GOLD_LIGHT, border: `1px solid ${BORDER}` }}>
                    <span className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map((d) => (
                        <span key={d} className="w-1.5 h-1.5 rounded-full animate-bounce"
                          style={{ background: GOLD, animationDelay: `${d * 0.15}s` }} />
                      ))}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* WhatsApp CTA on error */}
              {limitReached && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed"
                    style={{ background: GOLD_LIGHT, border: `1px solid ${BORDER}`, borderBottomLeftRadius: 4 }}>
                    <p className="mb-3 text-sm" style={{ color: BLACK }}>
                      I'm unable to respond right now. Please contact us directly on WhatsApp — we're happy to help! 😊
                    </p>
                    <a href="https://wa.me/255755753883" target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-white text-xs transition-opacity hover:opacity-90"
                      style={{ background: "#25D366" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.533 5.845L.057 23.428a.75.75 0 0 0 .915.915l5.683-1.476A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.504-5.23-1.385l-.374-.22-3.376.877.895-3.279-.242-.389A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                      </svg>
                      Chat on WhatsApp
                    </a>
                  </div>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input area */}
            <div className="shrink-0 px-3 py-3 flex items-end gap-2"
              style={{ background: WHITE, borderTop: `1.5px solid ${BORDER}` }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type a product or service you are looking for."
                rows={1}
                disabled={loading}
                className="flex-1 resize-none rounded-xl px-3 py-2 text-sm outline-none disabled:opacity-50 leading-snug"
                style={{
                  background: GOLD_LIGHT,
                  border: `1.5px solid ${BORDER}`,
                  color: BLACK,
                  maxHeight: 100,
                  overflowY: "auto",
                }}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
                }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: GOLD }}
                onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = GOLD_DARK; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = GOLD; }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}