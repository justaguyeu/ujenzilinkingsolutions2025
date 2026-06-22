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

// ── Suggested starter questions ───────────────────────────────────────────────
const SUGGESTIONS = [
  "What services do you offer?",
  "How do I register on the platform?",
  "Mnasaidiaje biashara zangu?",
  "Who is the CEO of Ujenzi?",
  "What professionals can I find here?",
];

// ── Small markdown renderer (bold + line breaks) ──────────────────────────────
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
      {/* ── AI Chat floating button (sits above WhatsApp) ───────────────────── */}
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
              fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
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
            {/* Popup header */}
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

            {/* Popup body */}
            <div className="px-4 py-4" style={{ background: "#f0faf4" }}>
              {/* Greeting bubble */}
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

              {/* Message input + send */}
              <div className="flex items-center gap-2">
                <input
                  ref={waInputRef}
                  type="text"
                  value={waMsg}
                  onChange={(e) => setWaMsg(e.target.value)}
                  onKeyDown={handleWaKey}
                  placeholder="Type a message…"
                  className="flex-1 rounded-full px-4 py-2.5 text-sm outline-none"
                  style={{
                    background: WHITE,
                    border: "1.5px solid #cce8d4",
                    color: BLACK,
                  }}
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

      {/* ── WhatsApp floating button (sits at the bottom) ───────────────────── */}
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
            {/* ── Header ─────────────────────────────────────────────────── */}
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

            {/* ── Messages ────────────────────────────────────────────────── */}
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
                    <p className="font-semibold text-sm" style={{ color: BLACK }}>Hello! 👋</p>
                    <p className="text-xs mt-1" style={{ color: GRAY_TEXT }}>
                      Ask me anything about Ujenzi Linking Solutions — in any language.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center mt-1">
                    {SUGGESTIONS.map((s) => (
                      <button key={s} onClick={() => sendMessage(s)}
                        className="text-xs px-3 py-1.5 rounded-full border transition-all hover:opacity-80"
                        style={{ borderColor: GOLD, color: GOLD, background: GOLD_LIGHT }}>
                        {s}
                      </button>
                    ))}
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
                  <div className="max-w-[78%] px-3 py-2 rounded-2xl text-sm leading-relaxed"
                    style={
                      msg.role === "user"
                        ? { background: GOLD, color: WHITE, borderBottomRightRadius: 4 }
                        : { background: GOLD_LIGHT, color: BLACK, borderBottomLeftRadius: 4, border: `1px solid ${BORDER}` }
                    }>
                    <ChatText text={msg.content} />
                  </div>
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

              {/* WhatsApp CTA — shown for ANY error or limit */}
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

            {/* ── Input area ──────────────────────────────────────────────── */}
            <div className="shrink-0 px-3 py-3 flex items-end gap-2"
              style={{ background: WHITE, borderTop: `1.5px solid ${BORDER}` }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type your message… (any language)"
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