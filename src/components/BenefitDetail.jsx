/* eslint-disable no-unused-vars */
import { useState, useMemo, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { benefits } from "../constants";
import Header2 from "./Header2";
import Footer from "./Footer";
import Section from "./Section";
import {
  Phone, X, ChevronLeft, MapPin, Globe,
  Image, Plus, Instagram, Loader2,
} from "lucide-react";
import { curve } from "../assets";
import useRegistrations from "../hooks/useRegistrations";
import RegistrationModal from "./RegistrationModal";

// ─── Alphabetical Index Bar ───────────────────────────────────────────────────
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split("");

const AlphaIndex = ({ available, onJump }) => {
  const [activeLetter, setActiveLetter] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const getLetterFromPoint = useCallback((clientY) => {
    const container = containerRef.current;
    if (!container) return null;
    const rect = container.getBoundingClientRect();
    const relY = clientY - rect.top;
    const itemHeight = rect.height / ALPHABET.length;
    const index = Math.floor(relY / itemHeight);
    return ALPHABET[Math.max(0, Math.min(ALPHABET.length - 1, index))];
  }, []);

  const handleInteraction = useCallback((clientY) => {
    const letter = getLetterFromPoint(clientY);
    if (letter) { setActiveLetter(letter); if (available.has(letter)) onJump(letter); }
  }, [getLetterFromPoint, available, onJump]);

  const onMouseDown = (e) => { e.preventDefault(); setIsDragging(true); handleInteraction(e.clientY); };
  const onMouseMove = (e) => { if (isDragging) handleInteraction(e.clientY); };
  const onMouseUp = () => { setIsDragging(false); setActiveLetter(null); };
  const onTouchStart = (e) => { setIsDragging(true); handleInteraction(e.touches[0].clientY); };
  const onTouchMove = (e) => { e.preventDefault(); handleInteraction(e.touches[0].clientY); };
  const onTouchEnd = () => { setIsDragging(false); setActiveLetter(null); };

  return (
    <>
      <AnimatePresence>
        {isDragging && activeLetter && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, x: 20 }} animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ scale: 0.5, opacity: 0, x: 20 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="fixed right-12 z-50 w-14 h-14 rounded-xl bg-color-1 flex items-center
                       justify-center text-n-8 text-2xl font-bold shadow-xl pointer-events-none"
            style={{ top: "50%", transform: "translateY(-50%)" }}
          >
            {activeLetter}
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={containerRef}
        onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        style={{ touchAction: "none", userSelect: "none" }}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-30 flex flex-col
                   bg-n-8/80 backdrop-blur-sm border-l border-n-6 rounded-l-xl py-2 px-1 cursor-pointer">
        {ALPHABET.map((letter) => {
          const active = available.has(letter);
          const isActive = activeLetter === letter;
          return (
            <div key={letter}
              className={`w-5 flex items-center justify-center select-none transition-all duration-100 ${isActive ? "scale-125" : ""}`}
              style={{ height: `${100 / ALPHABET.length}%`, minHeight: "14px" }}>
              <span className={`text-[10px] font-bold leading-none
                ${active ? (isActive ? "text-color-1 text-sm" : "text-n-1") : "text-n-5"}`}>
                {letter}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
};

// ─── Source Badge ─────────────────────────────────────────────────────────────
const RegisteredBadge = () => (
  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider
                   bg-color-1/15 text-color-1 border border-color-1/30 rounded-full px-2 py-0.5">
    ✓ Registered
  </span>
);

// ─── Company Card ─────────────────────────────────────────────────────────────
const CompanyCard = ({ company, isRegistered, onClick }) => (
  <motion.button onClick={onClick}
    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
    className="flex items-center gap-4 w-full bg-n-8 border border-n-6 rounded-xl
               p-4 text-left hover:border-color-1 transition-colors duration-200
               focus:outline-none focus:ring-2 focus:ring-color-1">
    {company.logo ? (
      <img src={company.logo} alt={company.name}
        className="w-14 h-14 rounded-lg object-contain flex-shrink-0 bg-n-7 p-1" />
    ) : (
      <div className="w-14 h-14 rounded-lg bg-n-6 flex items-center justify-center flex-shrink-0">
        <span className="text-xl font-bold text-color-1">{company.name.charAt(0).toUpperCase()}</span>
      </div>
    )}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <p className="font-semibold text-n-1 truncate">{company.name}</p>
        {isRegistered && <RegisteredBadge />}
      </div>
      {company.description && (
        <p className="text-sm text-n-3 line-clamp-2 mt-0.5">{company.description}</p>
      )}
    </div>
    <ChevronLeft className="w-4 h-4 text-n-3 rotate-180 flex-shrink-0" />
  </motion.button>
);

// ─── Company Detail Modal ─────────────────────────────────────────────────────
const CompanyDetail = ({ company, isRegistered, onClose }) => {
  const [zoomedImage, setZoomedImage] = useState(null);
  const gallery = [company.logo2, company.logo3].filter(Boolean);

  const instagramUrl = company.instagram
    ? `https://www.instagram.com/${company.instagram.replace(/^@/, "")}/`
    : null;

  return (
    <>
      <motion.div
        className="fixed inset-0 z-40 flex items-end md:items-center justify-center p-0 md:p-4"
        style={{
          background: "rgba(0,0,0,0.70)",
          // On mobile, reserve space for the fixed header at the top
          // so the sheet never slides behind it
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}>

        <motion.div
          className="relative bg-n-8 w-full md:max-w-lg overflow-y-auto
                     rounded-t-2xl md:rounded-2xl border border-n-6"
          style={{
            // Use dvh so browser chrome is excluded; subtract header height (64px default)
            // Adjust 64px to match your actual Header2 height if different
            maxHeight: "calc(100dvh - 64px)",
          }}
          initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}>

          {/* Drag handle — mobile only */}
          <div className="flex justify-center pt-3 pb-1 md:hidden">
            <div className="w-10 h-1 rounded-full bg-n-5" />
          </div>

          <button onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-n-7 flex items-center
                       justify-center hover:bg-n-6 transition-colors z-10">
            <X className="w-4 h-4 text-n-1" />
          </button>

          <div className="p-5 pt-3 md:pt-5">
            <div className="flex items-center gap-4 mb-5 pr-8">
              {company.logo ? (
                <img src={company.logo} alt={company.name}
                  className="w-16 h-16 rounded-xl object-contain bg-n-7 p-1 flex-shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-n-6 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-color-1">{company.name.charAt(0)}</span>
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-n-1 leading-tight">{company.name}</h2>
                  {isRegistered && <RegisteredBadge />}
                </div>
                {company.location && (
                  <a href={company.location} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-color-1 mt-1 hover:underline">
                    <MapPin className="w-3.5 h-3.5" /> View on map
                  </a>
                )}
              </div>
            </div>

            {company.description && (
              <p className="text-n-3 text-sm leading-relaxed mb-5">{company.description}</p>
            )}

            {gallery.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <Image className="w-4 h-4 text-n-3" />
                  <span className="text-sm font-medium text-n-3 uppercase tracking-wider">Gallery</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {gallery.map((img, i) => (
                    <motion.button key={i} onClick={() => setZoomedImage(img)}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      className="rounded-lg overflow-hidden aspect-video border border-n-6
                                 hover:border-color-1 transition-colors focus:outline-none focus:ring-2 focus:ring-color-1">
                      <img src={img} alt={`${company.name} photo ${i + 1}`} className="w-full h-full object-cover" />
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3">
                {company.phone && (
                  <a href={`tel:${company.phone}`}
                    className="flex items-center justify-center gap-2 flex-1 py-3 px-5
                               bg-color-1 text-n-8 font-semibold rounded-xl
                               hover:opacity-90 active:scale-95 transition-all">
                    <Phone className="w-4 h-4" /> {company.phone}
                  </a>
                )}
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 flex-1 py-3 px-5
                               border border-n-5 text-n-1 font-semibold rounded-xl
                               hover:border-color-1 hover:text-color-1 transition-colors">
                    <Globe className="w-4 h-4" /> Website
                  </a>
                )}
              </div>
              {instagramUrl && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 px-5
                             border border-n-5 text-n-1 font-semibold rounded-xl
                             hover:border-[#E1306C] hover:text-[#E1306C] transition-colors">
                  <Instagram className="w-4 h-4" />
                  @{company.instagram.replace(/^@/, "")}
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setZoomedImage(null)}>
            <motion.img src={zoomedImage}
              className="max-h-[85vh] max-w-full object-contain rounded-xl"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }} transition={{ type: "spring", stiffness: 300 }} />
            <button onClick={() => setZoomedImage(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-n-7 flex items-center justify-center hover:bg-n-6">
              <X className="w-4 h-4 text-n-1" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const BenefitDetail = () => {
  const { id } = useParams();
  const benefit = benefits.find((b) => b.id === id);

  const { getForCategory, loading, addRegistration } = useRegistrations();

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedIsRegistered, setSelectedIsRegistered] = useState(false);
  const [search, setSearch] = useState("");
  const [regModalOpen, setRegModalOpen] = useState(false);
  const sectionRefs = useRef({});

  if (!benefit) {
    return (
      <>
        <Header2 />
        <div className="p-10 text-red-500">Benefit not found</div>
        <Footer />
      </>
    );
  }

  const hardcoded = useMemo(
    () => (benefit.companies || []).map((c) => ({ ...c, _source: "hardcoded" })),
    [benefit]
  );

  const registered = useMemo(
    () => getForCategory(id).map((c) => ({
      ...c,
      logo: c.logo,
      logo2: c.logo2,
      logo3: c.logo3,
      location: c.location,
      instagram: c.instagram,
      _source: "registered",
    })),
    [id, getForCategory]
  );

  const allCompanies = useMemo(() => [...hardcoded, ...registered], [hardcoded, registered]);

  const sortedCompanies = useMemo(
    () => [...allCompanies].sort((a, b) => a.name.localeCompare(b.name)),
    [allCompanies]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return sortedCompanies;
    const q = search.toLowerCase();
    return sortedCompanies.filter(
      (c) => c.name.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  }, [sortedCompanies, search]);

  const grouped = useMemo(() => {
    const map = {};
    for (const company of filtered) {
      const letter = /[A-Z]/i.test(company.name[0]) ? company.name[0].toUpperCase() : "#";
      if (!map[letter]) map[letter] = [];
      map[letter].push(company);
    }
    return map;
  }, [filtered]);

  const availableLetters = new Set(Object.keys(grouped));

  const jumpToLetter = (letter) => {
    const el = sectionRefs.current[letter];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openCompany = (company) => {
    setSelectedCompany(company);
    setSelectedIsRegistered(company._source === "registered");
  };

  return (
    <>
      <Header2 />
      <Section>
        <div className="container relative z-2">
          <div className="mx-auto px-4 md:px-10 pt-6 pb-16 max-w-2xl">

            <div className="mb-8">
              <h1 className="h1 mb-4">
                <span className="inline-block relative">
                  UJENZI LINKING SOLUTIONS{" "}
                  <img src={curve} className="absolute top-full left-0 w-full xl:-mt-2"
                    width={624} height={28} alt="Curve" />
                </span>
              </h1>

              <div className="flex flex-col md:flex-row items-center gap-5 bg-n-8 border border-n-6 p-5 rounded-2xl mt-8">
                {benefit.imageUrl && (
                  <img src={benefit.imageUrl} className="border-2 border-n-9 rounded-full"
                    alt="" role="presentation" width={200} height={28} />
                )}
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-n-1">{benefit.title}</h2>
                  <p className="text-sm text-n-3 mt-1">
                    {loading ? "Loading…" : `${allCompanies.length} registered ${allCompanies.length === 1 ? "business" : "businesses"}`}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setRegModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-3 bg-color-1 text-n-8
                             font-bold rounded-xl hover:opacity-90 transition-opacity text-sm flex-shrink-0">
                  <Plus className="w-4 h-4" /> Register Here
                </motion.button>
              </div>
            </div>

            {!loading && allCompanies.length > 0 && (
              <div className="mb-6 relative">
                <input type="search" placeholder="Search companies…" value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-n-8 border border-n-6 rounded-xl px-4 py-3 pr-10
                             text-n-1 placeholder-n-4 focus:outline-none focus:border-color-1 transition-colors" />
                {search && (
                  <button onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-n-4 hover:text-n-1">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {!loading && allCompanies.length > 0 && (
              <AlphaIndex available={availableLetters} onJump={jumpToLetter} />
            )}

            {loading ? (
              <div className="flex items-center justify-center py-20 gap-3 text-n-4">
                <Loader2 className="w-5 h-5 animate-spin" /> Loading businesses…
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center mt-12 space-y-4">
                <p className="text-n-4 text-lg">
                  {search ? "No companies match your search." : "No businesses registered yet in this category."}
                </p>
                {!search && (
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setRegModalOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-color-1 text-n-8
                               font-bold rounded-xl hover:opacity-90 transition-opacity">
                    <Plus className="w-4 h-4" /> Be the first to register
                  </motion.button>
                )}
              </div>
            ) : (
              <div className="space-y-8 pr-7">
                {Object.entries(grouped)
                  .sort(([a], [b]) => (a === "#" ? 1 : b === "#" ? -1 : a.localeCompare(b)))
                  .map(([letter, comps]) => (
                    <div key={letter} ref={(el) => (sectionRefs.current[letter] = el)}>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-bold text-color-1 w-6 text-center">{letter}</span>
                        <div className="flex-1 h-px bg-n-6" />
                      </div>
                      <div className="space-y-3">
                        {comps.map((company, idx) => (
                          <CompanyCard key={company.id || idx} company={company}
                            isRegistered={company._source === "registered"}
                            onClick={() => openCompany(company)} />
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </Section>

      <AnimatePresence>
        {selectedCompany && (
          <CompanyDetail company={selectedCompany} isRegistered={selectedIsRegistered}
            onClose={() => setSelectedCompany(null)} />
        )}
      </AnimatePresence>

      <RegistrationModal
        isOpen={regModalOpen}
        onClose={() => setRegModalOpen(false)}
        defaultCategoryId={id}
        addRegistration={addRegistration}
      />

      <Footer />
    </>
  );
};

export default BenefitDetail;