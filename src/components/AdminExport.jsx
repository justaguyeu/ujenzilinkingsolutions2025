/**
 * AdminExport.jsx
 * Route: /admin/registrations
 * Password-protected. Admin can view and delete any registration.
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2, ChevronDown, ChevronRight, X,
  Instagram, Phone, Globe, MapPin, Loader2, CheckCircle2,
} from "lucide-react";
import { benefits } from "../constants";
import useRegistrations from "../hooks/useRegistrations";
import Header2 from "./Header2";
import Footer from "./Footer";
import Section from "./Section";

const ADMIN_SECRET = "Ujenzi@2026";

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ message, onDone }) => (
  <AnimatePresence>
    {message && (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        onAnimationComplete={() => setTimeout(onDone, 2000)}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3
                   bg-n-7 border border-green-500/40 text-green-400 font-semibold text-sm
                   px-5 py-3 rounded-2xl shadow-xl"
      >
        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
        {message}
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── Category Group ───────────────────────────────────────────────────────────
const CategoryGroup = ({ categoryId, registrations, onDelete }) => {
  const benefit = benefits.find((b) => b.id === categoryId);
  const [open, setOpen] = useState(true);

  if (registrations.length === 0) return null;

  return (
    <div className="border border-n-6 rounded-xl overflow-hidden">
      <button onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-n-7 hover:bg-n-6 transition-colors">
        <div className="flex items-center gap-3">
          {open
            ? <ChevronDown className="w-4 h-4 text-n-3" />
            : <ChevronRight className="w-4 h-4 text-n-3" />}
          <span className="font-semibold text-n-1">
            {benefit ? benefit.title : `Category ${categoryId}`}
          </span>
          <span className="text-xs bg-color-1/20 text-color-1 rounded-full px-2 py-0.5 font-bold">
            {registrations.length}
          </span>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="divide-y divide-n-6">
              <AnimatePresence>
                {registrations.map((reg) => (
                  <motion.div
                    key={reg.id}
                    initial={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                    transition={{ duration: 0.25 }}
                    className="flex items-start gap-4 p-4"
                  >
                    {reg.logo ? (
                      <img src={reg.logo} alt={reg.name}
                        className="w-12 h-12 rounded-lg object-contain bg-n-7 p-1 flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-n-6 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-color-1">{reg.name.charAt(0)}</span>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-n-1">{reg.name}</p>
                      {reg.description && (
                        <p className="text-xs text-n-4 mt-0.5 line-clamp-2">{reg.description}</p>
                      )}
                      <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-n-4">
                        {reg.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {reg.phone}
                          </span>
                        )}
                        {reg.website && (
                          <a href={reg.website} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-color-1 transition-colors">
                            <Globe className="w-3 h-3" /> Website
                          </a>
                        )}
                        {reg.instagram && (
                          <a href={`https://www.instagram.com/${reg.instagram}/`}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-[#E1306C] transition-colors">
                            <Instagram className="w-3 h-3" /> @{reg.instagram}
                          </a>
                        )}
                        {reg.location && (
                          <a href={reg.location} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-color-1 transition-colors">
                            <MapPin className="w-3 h-3" /> Map
                          </a>
                        )}
                        {reg.created_at && (
                          <span>🕐 {new Date(reg.created_at).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>

                    <button onClick={() => onDelete(reg)}
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/10 text-red-400
                                 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                      title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const AdminExport = () => {
  const { registrations, loading, deleteRegistration } = useRegistrations();
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [toast, setToast] = useState(null);

  // Optimistic local removal — removed IDs are hidden immediately
  const [removedIds, setRemovedIds] = useState(new Set());

  const visibleRegistrations = useMemo(
    () => registrations.filter((r) => !removedIds.has(r.id)),
    [registrations, removedIds]
  );

  const grouped = useMemo(() => {
    const map = {};
    for (const reg of visibleRegistrations) {
      if (!map[reg.category_id]) map[reg.category_id] = [];
      map[reg.category_id].push(reg);
    }
    return map;
  }, [visibleRegistrations]);

  const handleAuth = () => {
    if (secret === ADMIN_SECRET) { setAuthed(true); setAuthError(false); }
    else setAuthError(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);

    // Optimistically hide the item immediately
    setRemovedIds((prev) => new Set([...prev, deleteTarget.id]));
    setDeleteTarget(null);

    const { error } = await deleteRegistration(deleteTarget.id);
    setDeleting(false);

    if (error) {
      // Restore if delete failed
      setRemovedIds((prev) => {
        const next = new Set(prev);
        next.delete(deleteTarget.id);
        return next;
      });
      setDeleteError("Delete failed: " + error.message);
      setDeleteTarget(deleteTarget);
      return;
    }

    setToast(`"${deleteTarget.name}" deleted successfully.`);
  };

  // ── Login screen ──────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <>
        <Header2 />
        <Section>
          <div className="container relative z-2 flex items-center justify-center min-h-[60vh]">
            <div className="bg-n-8 border border-n-6 rounded-2xl p-8 max-w-sm w-full space-y-4">
              <h2 className="text-xl font-bold text-n-1 text-center">Admin Access</h2>
              <p className="text-n-4 text-sm text-center">Enter the admin secret to continue.</p>
              <input type="password" placeholder="Admin secret" value={secret}
                onChange={(e) => { setSecret(e.target.value); setAuthError(false); }}
                onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                className={`w-full bg-transparent border rounded-xl px-4 py-3 text-n-1
                           placeholder-n-5 focus:outline-none text-sm transition-colors
                           ${authError ? "border-red-500" : "border-n-5 focus:border-color-1"}`} />
              {authError && (
                <p className="text-red-400 text-xs text-center">Incorrect secret. Try again.</p>
              )}
              <button onClick={handleAuth}
                className="w-full py-3 bg-color-1 text-n-8 font-bold rounded-xl hover:opacity-90 transition-opacity">
                Login
              </button>
            </div>
          </div>
        </Section>
        <Footer />
      </>
    );
  }

  // ── Admin dashboard ───────────────────────────────────────────────────────
  return (
    <>
      <Header2 />
      <Section>
        <div className="container relative z-2">
          <div className="mx-auto px-4 md:px-10 pt-6 pb-16 max-w-3xl">

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold text-n-1">Registrations Admin</h1>
                <p className="text-n-4 text-sm mt-1">
                  {loading ? "Loading…" : `${visibleRegistrations.length} total registration${visibleRegistrations.length !== 1 ? "s" : ""} · live from Supabase`}
                </p>
              </div>
            </div>

            <div className="mb-6 p-4 bg-n-8 border border-n-6 rounded-xl text-xs text-n-4 space-y-1">
              <p className="font-semibold text-n-3 mb-1">ℹ️ About this data</p>
              <p>Click the <span className="text-red-400 font-semibold">red trash icon</span> to permanently delete any registration. This cannot be undone.</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20 gap-3 text-n-4">
                <Loader2 className="w-5 h-5 animate-spin" /> Loading registrations…
              </div>
            ) : Object.keys(grouped).length === 0 ? (
              <p className="text-center text-n-4 text-lg mt-12">No registrations yet.</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(grouped).map(([catId, regs]) => (
                  <CategoryGroup key={catId} categoryId={catId} registrations={regs}
                    onDelete={setDeleteTarget} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => !deleting && setDeleteTarget(null)}>
            <motion.div className="bg-n-8 border border-n-6 rounded-2xl p-6 max-w-sm w-full space-y-4"
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-n-1">Delete Registration</h3>
              <p className="text-n-3 text-sm">
                Permanently delete{" "}
                <span className="text-n-1 font-semibold">{deleteTarget?.name}</span>?
                This cannot be undone.
              </p>
              {deleteError && <p className="text-red-400 text-xs">{deleteError}</p>}
              <div className="flex gap-3">
                <button onClick={() => setDeleteTarget(null)} disabled={deleting}
                  className="flex-1 py-3 border border-n-5 text-n-1 font-semibold rounded-xl
                             hover:border-n-3 transition-colors disabled:opacity-50">
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={deleting}
                  className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl
                             hover:bg-red-600 active:scale-95 transition-all
                             flex items-center justify-center gap-2 disabled:opacity-50">
                  {deleting
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting…</>
                    : <><Trash2 className="w-4 h-4" /> Delete</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <Toast message={toast} onDone={() => setToast(null)} />

      <Footer />
    </>
  );
};

export default AdminExport;