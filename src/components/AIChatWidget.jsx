/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Ujenzi brand colours ──────────────────────────────────────────────────────
const BRAND = "#DB9029";
const BRAND_DARK = "#b87520";

// ── Suggested starter questions ───────────────────────────────────────────────
const SUGGESTIONS = [
  "What services do you offer?",
  "How do I register on the platform?",
  "Mnasaidiaje biashara zangu?",      // Swahili
  "Who is the CEO of Ujenzi?",
  "What types of professionals can I find?",
];

// ── Small markdown-ish renderer (bold + line breaks only) ─────────────────────
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
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]); // { role, content }
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when chat opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  async function sendMessage(text) {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Something went wrong");
      }

      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError(err.message || "Failed to get a response. Please try again.");
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
    setError("");
  }

  return (
    <>
      {/* ── Floating trigger button ─────────────────────────────────────────── */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open AI chat assistant"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        style={{ background: BRAND }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              xmlns="http://www.w3.org/2000/svg"
              width="22" height="22" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              xmlns="http://www.w3.org/2000/svg"
              width="24" height="24" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </motion.svg>
          )}
        </AnimatePresence>

        {/* Pulse ring when closed */}
        {!open && (
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-30"
            style={{ background: BRAND }}
          />
        )}
      </motion.button>

      {/* ── Chat panel ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed bottom-24 right-4 z-50 w-[90vw] max-w-sm flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-n-1/10"
            style={{ height: "min(560px, 80vh)", background: "#ffffffff" }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3 shrink-0"
              style={{ background: BRAND }}
            >
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                  viewBox="0 0 24 24" fill="none" stroke="white"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2z" />
                  <path d="M12 14c-6 0-9 3-9 4v1h18v-1c0-1-3-4-9-4z" />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm leading-tight truncate">
                  Ujenzi Assistant
                </p>
                <p className="text-white/70 text-xs">Ask anything about our platform</p>
              </div>

              {/* Clear button */}
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  title="Clear chat"
                  className="text-white/70 hover:text-white transition-colors p-1 rounded"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4h6v2" />
                  </svg>
                </button>
              )}
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth">

              {/* Welcome state */}
              {messages.length === 0 && (
                <div className="flex flex-col items-center text-center pt-4 pb-2 gap-3">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: BRAND + "33" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                      viewBox="0 0 24 24" fill="none" stroke={BRAND}
                      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-black font-semibold text-sm">Hello!</p>
                    <p className="text-n-4 text-xs mt-1">
                      Ask me anything about Ujenzi Linking Solutions — in any language.
                    </p>
                  </div>

                  {/* Suggestion chips */}
                  <div className="flex flex-wrap gap-2 justify-center mt-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="text-xs px-3 py-1.5 rounded-full border transition-all"
                        style={{
                          borderColor: BRAND + "66",
                          color: BRAND,
                          background: BRAND + "11",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = BRAND + "22";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = BRAND + "11";
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message bubbles */}
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 mr-2"
                      style={{ background: BRAND }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                        viewBox="0 0 24 24" fill="none" stroke="white"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </div>
                  )}
                  <div
                    className="max-w-[78%] px-3 py-2 rounded-2xl text-sm leading-relaxed"
                    style={
                      msg.role === "user"
                        ? { background: BRAND, color: "#fff", borderBottomRightRadius: 4 }
                        : { background: "#1a1830", color: "#e4e0f0", borderBottomLeftRadius: 4 }
                    }
                  >
                    <ChatText text={msg.content} />
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start items-end gap-2"
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: BRAND }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                      viewBox="0 0 24 24" fill="none" stroke="white"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <div className="px-3 py-2 rounded-2xl" style={{ background: "#1a1830" }}>
                    <span className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map((d) => (
                        <span
                          key={d}
                          className="w-1.5 h-1.5 rounded-full animate-bounce"
                          style={{ background: BRAND, animationDelay: `${d * 0.15}s` }}
                        />
                      ))}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Error message */}
              {error && (
                <div className="text-center">
                  <p className="text-red-400 text-xs bg-red-400/10 rounded-xl px-3 py-2">
                    {/* ⚠️ {error} */}
                  </p>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input area */}
            <div
              className="shrink-0 px-3 py-3 border-t border-n-1/10 flex items-end gap-2"
              style={{ background: "#ffffffff" }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type your message… (any language)"
                rows={1}
                disabled={loading}
                className="flex-1 resize-none rounded-xl px-3 py-2 text-sm text-white placeholder-n-4 outline-none disabled:opacity-50 leading-snug"
                style={{
                  background: "#000000ff",
                  border: `1px solid ${BRAND}44`,
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
                style={{ background: BRAND }}
                onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = BRAND_DARK; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = BRAND; }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                  viewBox="0 0 24 24" fill="none" stroke="white"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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