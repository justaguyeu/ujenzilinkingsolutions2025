import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Phone, Globe, MapPin, Building2, FileText,
  Image as ImageIcon, CheckCircle2, AlertCircle,
  ChevronDown, Instagram, Upload,
} from "lucide-react";
import { benefits } from "../constants";
import useRegistrations, { resizeAndEncode } from "../hooks/useRegistrations";

// ─── Image Drop Zone ──────────────────────────────────────────────────────────
const ImageDropZone = ({ label, value, onChange, error }) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleFile = useCallback(async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setProcessing(true);
    try {
      const b64 = await resizeAndEncode(file);
      onChange(b64, null);
    } catch (err) {
      onChange(null, err.message);
    } finally {
      setProcessing(false);
    }
  }, [onChange]);

  return (
    <div>
      <label className="block text-xs font-semibold text-n-3 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200
          ${dragging ? "border-color-1 bg-color-1/5" : "border-n-5 hover:border-n-3"}
          ${value ? "p-1" : "p-6"}`}
      >
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => handleFile(e.target.files[0])} />
        {processing ? (
          <div className="flex items-center justify-center gap-2 py-4 text-n-3 text-sm">
            <div className="w-4 h-4 border-2 border-color-1 border-t-transparent rounded-full animate-spin" />
            Processing...
          </div>
        ) : value ? (
          <div className="relative group">
            <img src={value} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
            <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100
                            transition-opacity flex items-center justify-center gap-2 text-white text-sm font-medium">
              <Upload className="w-4 h-4" /> Change
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-n-4">
            <ImageIcon className="w-7 h-7" />
            <span className="text-sm">Drop image or tap to browse</span>
            <span className="text-xs">JPEG, PNG, WebP</span>
          </div>
        )}
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
};

// ─── Field wrapper ────────────────────────────────────────────────────────────
const Field = ({ label, icon: Icon, error, optional, children }) => (
  <div>
    <label className="flex items-center gap-1.5 text-xs font-semibold text-n-3 uppercase tracking-wider mb-1.5">
      {label}
      {optional && <span className="normal-case font-normal text-n-5">(optional)</span>}
    </label>
    <div className={`relative flex items-center rounded-xl border transition-colors duration-200
      ${error ? "border-red-500" : "border-n-5 focus-within:border-color-1"}`}>
      {Icon && <span className="absolute left-3 text-n-4 pointer-events-none"><Icon className="w-4 h-4" /></span>}
      <div className={`w-full ${Icon ? "pl-9" : ""}`}>{children}</div>
    </div>
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

const inputCls = "w-full bg-transparent px-4 py-3 text-n-1 placeholder-n-5 text-sm focus:outline-none rounded-xl";

// ─── Success Screen ───────────────────────────────────────────────────────────
const SuccessScreen = ({ name, onClose }) => {
  const handleDone = () => {
    onClose();
    window.location.reload(); // ← guarantees fresh data
  };

  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center py-8 px-4 gap-5"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
      >
        <CheckCircle2 className="w-16 h-16 text-green-400" />
      </motion.div>
      <div>
        <h3 className="text-xl font-bold text-n-1 mb-2">You're registered!</h3>
        <p className="text-n-3 text-sm">
          <span className="text-color-1 font-semibold">{name}</span> is now live in the directory
          and visible to everyone.
        </p>
      </div>
      <button
        onClick={handleDone}
        className="w-full py-3 bg-color-1 text-n-8 font-bold rounded-xl hover:opacity-90 transition-opacity"
      >
        Done
      </button>
    </motion.div>
  );
};

// ─── Main Modal ───────────────────────────────────────────────────────────────
const INITIAL = {
  name: "", description: "", phone: "",
  website: "", location: "", instagram: "",
  categoryId: "", logo: null, gallery1: null, gallery2: null,
};

const RegistrationModal = ({ isOpen, onClose, defaultCategoryId = "", addRegistration: addRegistrationProp }) => {
//   const { addRegistration } = useRegistrations();
  const [form, setForm] = useState({ ...INITIAL, categoryId: defaultCategoryId });
  const [errors, setErrors] = useState({});
  const [imgErrors, setImgErrors] = useState({});
  const [step, setStep] = useState("form");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const { addRegistration: addRegistrationHook } = useRegistrations();
  const addRegistration = addRegistrationProp || addRegistrationHook;

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const clearErr = (key) => setErrors((p) => ({ ...p, [key]: null }));

  const validate = () => {
    const e = {};
    if (!form.categoryId) e.categoryId = "Please select a category.";
    if (!form.name.trim()) e.name = "Business name is required.";
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    if (form.website && !/^https?:\/\//i.test(form.website))
      e.website = "Must start with http:// or https://";
    if (form.location && !/^https?:\/\//i.test(form.location))
      e.location = "Must be a valid URL starting with http://";
    if (form.instagram && form.instagram.includes("/"))
      e.instagram = "Enter username only, no slashes or full URLs.";
    return e;
  };

  const handleSubmit = async () => {
  const e = validate();
  if (Object.keys(e).length) { setErrors(e); return; }
  setSubmitting(true);
  setServerError(null);

  const { error } = await addRegistration({
    categoryId: form.categoryId,
    name: form.name.trim(),
    description: form.description.trim(),
    phone: form.phone.trim(),
    website: form.website.trim(),
    location: form.location.trim(),
    instagram: form.instagram.trim().replace(/^@/, ""),
    logo: form.logo || null,
    logo2: form.gallery1 || null,
    logo3: form.gallery2 || null,
  });

  setSubmitting(false);

  if (error) {
    setServerError("Registration failed: " + error.message);
    return;
  }

  setStep("success");
};

  const handleClose = () => {
    setForm({ ...INITIAL, categoryId: defaultCategoryId });
    setErrors({});
    setImgErrors({});
    setStep("form");
    setServerError(null);
    onClose();
  };

  const setImg = (key) => (val, err) => {
    if (err) setImgErrors((p) => ({ ...p, [key]: err }));
    else { setImgErrors((p) => ({ ...p, [key]: null })); set(key, val); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/75 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="relative bg-n-8 w-full md:max-w-xl max-h-[94vh] overflow-y-auto
                       rounded-t-2xl md:rounded-2xl border border-n-6"
            initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 md:hidden">
              <div className="w-10 h-1 rounded-full bg-n-5" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-n-6">
              <div>
                <h2 className="text-lg font-bold text-n-1">Register Your Business</h2>
                <p className="text-xs text-n-4 mt-0.5">Visible to everyone, instantly</p>
              </div>
              <button onClick={handleClose}
                className="w-8 h-8 rounded-full bg-n-7 flex items-center justify-center hover:bg-n-6 transition-colors">
                <X className="w-4 h-4 text-n-1" />
              </button>
            </div>

            <div className="p-5">
              <AnimatePresence mode="wait">
                {step === "success" ? (
                  <SuccessScreen name={form.name} onClose={handleClose} />
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="space-y-5">

                    {/* Category */}
                    <Field label="Service Category *" icon={Building2} error={errors.categoryId}>
                      <div className="relative">
                        <select value={form.categoryId}
                          onChange={(e) => { set("categoryId", e.target.value); clearErr("categoryId"); }}
                          className={`${inputCls} appearance-none pr-8`}>
                          <option value="">Select a category…</option>
                          {benefits.map((b) => (
                            <option key={b.id} value={b.id}>{b.title}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-n-4 pointer-events-none" />
                      </div>
                    </Field>

                    {/* Business Name */}
                    <Field label="Business Name *" icon={Building2} error={errors.name}>
                      <input className={inputCls} placeholder="e.g. Acme Construction Ltd"
                        value={form.name}
                        onChange={(e) => { set("name", e.target.value); clearErr("name"); }} />
                    </Field>

                    {/* Description */}
                    <Field label="Description" icon={FileText} optional>
                      <textarea className={`${inputCls} resize-none`} rows={3}
                        placeholder="Brief description of your services…"
                        value={form.description}
                        onChange={(e) => set("description", e.target.value)} />
                    </Field>

                    {/* Phone */}
                    <Field label="Phone Number *" icon={Phone} error={errors.phone}>
                      <input className={inputCls} placeholder="+255 700 000 000" type="tel"
                        value={form.phone}
                        onChange={(e) => { set("phone", e.target.value); clearErr("phone"); }} />
                    </Field>

                    {/* Website */}
                    <Field label="Website" icon={Globe} optional error={errors.website}>
                      <input className={inputCls} placeholder="https://yourwebsite.com" type="url"
                        value={form.website}
                        onChange={(e) => { set("website", e.target.value); clearErr("website"); }} />
                    </Field>

                    {/* Google Maps */}
                    <Field label="Google Maps Link" icon={MapPin} optional error={errors.location}>
                      <input className={inputCls} placeholder="https://maps.google.com/…" type="url"
                        value={form.location}
                        onChange={(e) => { set("location", e.target.value); clearErr("location"); }} />
                    </Field>

                    {/* Instagram */}
                    <Field label="Instagram Username" icon={Instagram} optional error={errors.instagram}>
                      <div className="flex items-center">
                        <span className="pl-9 pr-1 text-n-4 text-sm select-none">@</span>
                        <input className="w-full bg-transparent pr-4 py-3 text-n-1 placeholder-n-5 text-sm focus:outline-none"
                          placeholder="yourbusiness"
                          value={form.instagram}
                          onChange={(e) => { set("instagram", e.target.value.replace(/^@/, "")); clearErr("instagram"); }} />
                      </div>
                    </Field>

                    {/* Images */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <ImageDropZone label="Logo" value={form.logo}
                        onChange={setImg("logo")} error={imgErrors.logo} />
                      <ImageDropZone label="Gallery Photo 1" value={form.gallery1}
                        onChange={setImg("gallery1")} error={imgErrors.gallery1} />
                      <ImageDropZone label="Gallery Photo 2" value={form.gallery2}
                        onChange={setImg("gallery2")} error={imgErrors.gallery2} />
                    </div>

                    {/* Server error */}
                    {serverError && (
                      <p className="text-red-400 text-sm flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" /> {serverError}
                      </p>
                    )}

                    {/* Submit */}
                    <button onClick={handleSubmit} disabled={submitting}
                      className="w-full py-3.5 bg-color-1 text-n-8 font-bold rounded-xl
                                 hover:opacity-90 active:scale-95 transition-all duration-150
                                 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      {submitting ? (
                        <><div className="w-4 h-4 border-2 border-n-8 border-t-transparent rounded-full animate-spin" />Registering…</>
                      ) : "Register My Business"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegistrationModal;