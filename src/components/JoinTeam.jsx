

import { useState } from "react";
import emailjs from "@emailjs/browser"; // npm install @emailjs/browser
import Section from "../components/Section";
import Header2 from "../components/Header2";
import Footer from "../components/Footer";
import { curve, check } from "../assets";

// ── Replace these three values with your own from emailjs.com ──────────────
const EJS_SERVICE_ID  = "service_8gi19hl";
const EJS_TEMPLATE_ID = "template_k3jje7u";
const EJS_PUBLIC_KEY  = "X6_5jEIWbd4qsYu5Y";
// ───────────────────────────────────────────────────────────────────────────

const REGIONS = [
  "Arusha","Dar es Salaam","Dodoma","Geita","Iringa","Kagera","Katavi",
  "Kigoma","Kilimanjaro","Lindi","Manyara","Mara","Mbeya","Morogoro",
  "Mtwara","Mwanza","Njombe","Pwani","Rukwa","Ruvuma","Shinyanga",
  "Simiyu","Singida","Songwe","Tabora","Tanga","Zanzibar",
];

const SKILLS = [
  "Communication & negotiation",
  "Digital marketing / social media",
  "Customer relationship management",
  "Data entry & reporting",
  "Driving / field mobility",
];

const ROLES = [
  "Sales Agent",
  "Marketing Representative",
  "Business Development Officer",
  "Field Agent",
  "Client Relations",
  "Open to any role",
];

const EDUCATION = [
  "Primary school",
  "Secondary school (O-Level)",
  "Secondary school (A-Level)",
  "Certificate",
  "Diploma",
  "Bachelor's degree",
  "Master's degree",
  "PhD",
];

const EXPERIENCE = [
  "No experience (willing to learn)",
  "Less than 1 year",
  "1–2 years",
  "3–5 years",
  "5+ years",
];

const AVAILABILITY = [
  "Immediately",
  "Within 2 weeks",
  "Within 1 month",
  "More than 1 month",
];

const initial = {
  firstName: "", lastName: "", dob: "", gender: "",
  phone: "", email: "", region: "", occupation: "",
  education: "", experience: "", role: "", skills: [],
  motivation: "", availability: "",
};

const REQUIRED = [
  "firstName","lastName","phone","region","occupation",
  "education","experience","role","motivation","availability",
];

// ── Success Modal ────────────────────────────────────────────────────────────
const SuccessModal = ({ onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center px-4"
    style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
  >
    <div
      className="relative w-full max-w-md rounded-2xl border border-n-6 bg-n-8 p-10 text-center"
      style={{ boxShadow: "0 0 60px rgba(172,140,255,0.15)" }}
    >
      {/* Animated circle + tick */}
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
        style={{ background: "linear-gradient(135deg,#ac8cff22,#6cefb322)" }}>
        <svg viewBox="0 0 52 52" className="h-10 w-10" fill="none">
          <circle cx="26" cy="26" r="24" stroke="#ac8cff" strokeWidth="2.5"
            strokeDasharray="150" strokeDashoffset="0"
            style={{ animation: "dash 0.6s ease-out forwards" }} />
          <polyline points="14,27 22,35 38,18" stroke="#6cefb3" strokeWidth="3"
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="40" strokeDashoffset="40"
            style={{ animation: "draw 0.4s 0.5s ease-out forwards" }} />
        </svg>
      </div>

      <h2 className="h3 mb-3 text-n-1">Application Submitted!</h2>
      <p className="body-2 text-n-3 mb-2">
        Thank you for applying to join <span className="text-color-1 font-semibold">Ujenzi Linking Solutions</span>.
      </p>
      <p className="body-2 text-n-3 mb-8">
        We've received your application and will review it shortly.
        Expect a response on your <span className="text-n-1">WhatsApp or email</span> within 3–5 business days.
      </p>

      <button
        onClick={onClose}
        className="w-full rounded-full bg-n-14 px-8 py-3.5 font-semibold
          text-black tracking-wide hover:scale-105 transition-transform duration-300"
      >
        Got it, thanks!
      </button>

      {/* Inline keyframes */}
      <style>{`
        @keyframes dash  { to { stroke-dashoffset: 0; } }
        @keyframes draw  { to { stroke-dashoffset: 0; } }
      `}</style>
    </div>
  </div>
);

// ── Main Component ───────────────────────────────────────────────────────────
const JoinTeam = () => {
  const [form, setForm]         = useState(initial);
  const [errors, setErrors]     = useState({});
  const [sending, setSending]   = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [sendError, setSendError] = useState("");

  const handle = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: false }));
  };

  const toggleSkill = (skill) =>
    setForm((p) => ({
      ...p,
      skills: p.skills.includes(skill)
        ? p.skills.filter((s) => s !== skill)
        : [...p.skills, skill],
    }));

  const validate = () => {
    const e = {};
    REQUIRED.forEach((f) => { if (!form[f].trim()) e[f] = true; });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    setSendError("");
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSending(true);
    try {
      await emailjs.send(
        EJS_SERVICE_ID,
        EJS_TEMPLATE_ID,
        {
          full_name:    `${form.firstName} ${form.lastName}`,
          dob:          form.dob          || "Not provided",
          gender:       form.gender       || "Not specified",
          phone:        form.phone,
          email:        form.email        || "Not provided",
          region:       form.region,
          occupation:   form.occupation,
          education:    form.education,
          experience:   form.experience,
          role:         form.role,
          skills:       form.skills.join(", ") || "Not specified",
          motivation:   form.motivation,
          availability: form.availability,
        },
        EJS_PUBLIC_KEY
      );
      setForm(initial);
      setShowModal(true);
    } catch (err) {
      console.error("EmailJS error:", err);
      setSendError(
        "Oops — something went wrong sending your application. " +
        "Please try again or contact us directly on WhatsApp."
      );
    } finally {
      setSending(false);
    }
  };

  const inputCls = (name) =>
    `w-full bg-n-8 border rounded-xl px-4 py-3 text-sm text-n-1 outline-none
     focus:border-color-1 transition-colors duration-300
     ${errors[name] ? "border-red-500" : "border-n-6"}`;

  const SectionHeading = ({ children }) => (
    <h3 className="body-1 text-color-1 font-bold mb-4 mt-8 first:mt-0">
      {children}
    </h3>
  );

  const Label = ({ children, error }) => (
    <label className="block text-xs text-n-3 mb-1.5">
      {children}
      {error && <span className="ml-2 text-red-400">— required</span>}
    </label>
  );

  return (
    <>
      <Header2/>

      {showModal && <SuccessModal onClose={() => setShowModal(false)} />}

      <Section
        className="pt-[12rem] -mt-[5.25rem]"
        crosses
        crossesOffset="lg:translate-y-[5.25rem]"
        customPaddings
      >
        <div className="container relative">

          {/* ── PAGE TITLE ── */}
          <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-12 lg:mb-16">
            <h1 className="h1 mb-6">
              <span className="inline-block relative">
                Join Our Team{" "}
                <img
                  src={curve}
                  className="absolute top-full left-0 w-full xl:-mt-2"
                  width={624}
                  height={28}
                  alt=""
                />
              </span>
            </h1>
            <p className="body-1 text-n-3 max-w-xl mx-auto">
              Become part of a growing force connecting businesses and
              opportunities across Tanzania.
            </p>
          </div>

          {/* ── FORM CARD ── */}
          <div className="max-w-3xl mx-auto mb-24 px-4">
            <div className="p-8 md:p-10 rounded-2xl border border-n-6 bg-n-8">

              {/* Personal */}
              <SectionHeading>Personal Information</SectionHeading>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label error={errors.firstName}>First name *</Label>
                  <input name="firstName" value={form.firstName} onChange={handle}
                    placeholder="e.g. Amina" className={inputCls("firstName")} />
                </div>
                <div>
                  <Label error={errors.lastName}>Last name *</Label>
                  <input name="lastName" value={form.lastName} onChange={handle}
                    placeholder="e.g. Mwangi" className={inputCls("lastName")} />
                </div>
                <div>
                  <Label>Date of birth</Label>
                  <input type="date" name="dob" value={form.dob} onChange={handle}
                    className={inputCls("dob")} />
                </div>
                <div>
                  <Label>Gender</Label>
                  <select name="gender" value={form.gender} onChange={handle}
                    className={inputCls("gender")}>
                    <option value="">Select…</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* Contact */}
              <SectionHeading>Contact Details</SectionHeading>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label error={errors.phone}>WhatsApp phone number *</Label>
                  <input name="phone" value={form.phone} onChange={handle}
                    placeholder="+255 7XX XXX XXX" className={inputCls("phone")} />
                </div>
                <div>
                  <Label>Email address</Label>
                  <input type="email" name="email" value={form.email} onChange={handle}
                    placeholder="you@example.com" className={inputCls("email")} />
                </div>
              </div>
              <div className="mb-4">
                <Label error={errors.region}>Region in Tanzania *</Label>
                <select name="region" value={form.region} onChange={handle}
                  className={inputCls("region")}>
                  <option value="">Select region…</option>
                  {REGIONS.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>

              {/* Professional */}
              <SectionHeading>Professional Background</SectionHeading>
              <div className="mb-4">
                <Label error={errors.occupation}>Current / most recent occupation *</Label>
                <input name="occupation" value={form.occupation} onChange={handle}
                  placeholder="e.g. Sales Representative, Student…"
                  className={inputCls("occupation")} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label error={errors.education}>Highest education level *</Label>
                  <select name="education" value={form.education} onChange={handle}
                    className={inputCls("education")}>
                    <option value="">Select…</option>
                    {EDUCATION.map((e) => <option key={e}>{e}</option>)}
                  </select>
                </div>
                <div>
                  <Label error={errors.experience}>Sales / marketing experience *</Label>
                  <select name="experience" value={form.experience} onChange={handle}
                    className={inputCls("experience")}>
                    <option value="">Select…</option>
                    {EXPERIENCE.map((e) => <option key={e}>{e}</option>)}
                  </select>
                </div>
              </div>

              {/* Role */}
              <SectionHeading>Role Preference</SectionHeading>
              <div className="mb-4">
                <Label error={errors.role}>Role you are applying for *</Label>
                <select name="role" value={form.role} onChange={handle}
                  className={inputCls("role")}>
                  <option value="">Select…</option>
                  {ROLES.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <Label>Skills you bring to the team</Label>
                <ul className="space-y-3 mt-2">
                  {SKILLS.map((skill) => (
                    <li key={skill}
                      onClick={() => toggleSkill(skill)}
                      className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-300
                        ${form.skills.includes(skill)
                          ? "border-color-1 bg-color-1/20"
                          : "border-n-6 group-hover:border-n-4"}`}>
                        {form.skills.includes(skill) && (
                          <img src={check} width={14} height={14} alt="" />
                        )}
                      </div>
                      <p className={`body-1 transition-colors duration-300
                        ${form.skills.includes(skill) ? "text-n-1" : "text-n-3"}`}>
                        {skill}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Motivation */}
              <div className="mb-4">
                <Label error={errors.motivation}>
                  Why do you want to join Ujenzi Linking Solutions? *
                </Label>
                <textarea name="motivation" value={form.motivation} onChange={handle}
                  rows={4}
                  placeholder="Tell us briefly about your motivation and what you bring to the team…"
                  className={inputCls("motivation") + " resize-y min-h-[100px]"} />
              </div>

              {/* Availability */}
              <SectionHeading>Availability</SectionHeading>
              <div className="mb-8">
                <Label error={errors.availability}>When can you start? *</Label>
                <select name="availability" value={form.availability} onChange={handle}
                  className={inputCls("availability")}>
                  <option value="">Select…</option>
                  {AVAILABILITY.map((a) => <option key={a}>{a}</option>)}
                </select>
              </div>

              {/* Error banner */}
              {sendError && (
                <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10
                  px-4 py-3 text-sm text-red-400">
                  {sendError}
                </div>
              )}

              {/* Submit */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={submit}
                  disabled={sending}
                  className="flex-1 flex items-center justify-center gap-2
                    px-8 py-3.5 rounded-full bg-n-14 text-black font-semibold
                    tracking-wide hover:scale-105 transition-transform duration-300
                    disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                >
                  {sending ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                        strokeLinejoin="round">
                        <path d="M4 4l16 8-16 8V4z" />
                      </svg>
                      Submit Application
                    </>
                  )}
                </button>
              </div>

              {/* <p className="text-center text-xs text-n-4 mt-4">
                Your application will be sent to{" "}
                <span className="text-n-3">ujenzilinkingsolutions@gmail.com</span>
              </p> */}
            </div>
          </div>

        </div>
      </Section>

      <Footer />
    </>
  );
};

export default JoinTeam;