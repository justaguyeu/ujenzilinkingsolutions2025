// src/pages/LearnWithUs.jsx
//
// Uses the same EmailJS credentials as JoinTeam.jsx
// Create a NEW template in EmailJS for registrations and paste its ID below.
// Template variables: {{full_name}}, {{dob}}, {{gender}}, {{phone}}, {{email}},
//   {{region}}, {{occupation}}, {{programs}}, {{custom_interest}},
//   {{experience_level}}, {{goal}}, {{hear_from}}, {{time}}

import { useState } from "react";
import emailjs from "@emailjs/browser";
import Section from "../components/Section";
import Header2 from "../components/Header2";
import Footer from "../components/Footer";
import { curve } from "../assets";

// ── EmailJS credentials (same service as JoinTeam) ─────────────────────────
const EJS_SERVICE_ID  = "service_8gi19hl";
const EJS_TEMPLATE_ID = "template_k3jje7u"; // ← create a new template for registrations
const EJS_PUBLIC_KEY  = "X6_5jEIWbd4qsYu5Y";
// ───────────────────────────────────────────────────────────────────────────

const PROGRAMS = [
  {
    icon: "",
    title: "Sales Fundamentals",
    desc: "Learn how to prospect, pitch, close deals and build a client pipeline.",
  },
  {
    icon: "",
    title: "Marketing & Branding",
    desc: "Understand market positioning, branding strategies and campaign planning.",
  },
  {
    icon: "",
    title: "Digital Marketing",
    desc: "Social media marketing, content creation, SEO and online advertising.",
  },
  {
    icon: "",
    title: "Business Development",
    desc: "Identify growth opportunities, partnerships and expansion strategies.",
  },
  {
    icon: "",
    title: "Customer Relations (CRM)",
    desc: "Manage client relationships, handle objections and improve retention.",
  },
  {
    icon: "",
    title: "Data & Reporting",
    desc: "Track sales performance, interpret data and prepare business reports.",
  },
];

const REGIONS = [
  "Arusha","Dar es Salaam","Dodoma","Geita","Iringa","Kagera","Katavi",
  "Kigoma","Kilimanjaro","Lindi","Manyara","Mara","Mbeya","Morogoro",
  "Mtwara","Mwanza","Njombe","Pwani","Rukwa","Ruvuma","Shinyanga",
  "Simiyu","Singida","Songwe","Tabora","Tanga","Zanzibar",
];

const EXPERIENCE_LEVELS = [
  "Complete beginner — no background",
  "Some basic knowledge",
  "Intermediate — working in the field",
  "Advanced — looking to sharpen skills",
];

const HEAR_FROM = [
  "Social media",
  "Friend / family referral",
  "Google search",
  "WhatsApp group",
  "Other",
];

const initial = {
  firstName: "", lastName: "", dob: "", gender: "",
  phone: "", email: "", region: "", occupation: "",
  programs: [], customInterest: "", experienceLevel: "", goal: "", hearFrom: "",
};

const REQUIRED = [
  "firstName","lastName","phone","region",
  "experienceLevel","goal",
];

// ── Success Modal ────────────────────────────────────────────────────────────
const SuccessModal = ({ name, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center px-4"
    style={{ background: "rgba(0,0,0,0.80)", backdropFilter: "blur(8px)" }}
  >
    <div
      className="relative w-full max-w-md rounded-2xl border border-n-6 bg-n-8 p-10 text-center"
      style={{ boxShadow: "0 0 80px rgba(219,144,41,0.18)" }}
    >
      {/* Animated ring + check */}
      <div
        className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full"
        style={{ background: "radial-gradient(circle, #DB902922 0%, transparent 70%)" }}
      >
        <svg viewBox="0 0 52 52" className="h-12 w-12" fill="none">
          <circle
            cx="26" cy="26" r="23"
            stroke="#DB9029" strokeWidth="2.5"
            strokeDasharray="145" strokeDashoffset="145"
            style={{ animation: "ringDraw 0.65s ease-out forwards" }}
          />
          <polyline
            points="14,27 22,35 38,18"
            stroke="#DB9029" strokeWidth="3"
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="38" strokeDashoffset="38"
            style={{ animation: "checkDraw 0.4s 0.6s ease-out forwards" }}
          />
        </svg>
      </div>

      <h2 className="h3 mb-3 text-n-1">You're Registered!</h2>
      <p className="body-2 text-n-3 mb-2">
        Welcome, <span style={{ color: "#DB9029" }} className="font-semibold">{name}</span>! 🎉
      </p>
      <p className="body-2 text-n-3 mb-8">
        Your registration has been received by{" "}
        <span className="text-n-1 font-medium">Ujenzi Linking Solutions</span>.
        Our team will reach out via <span className="text-n-1">WhatsApp or email</span>{" "}
        within <span className="text-n-1">2–3 business days</span> with program details and next steps.
      </p>

      <button
        onClick={onClose}
        className="w-full rounded-full font-semibold px-8 py-3.5
          tracking-wide hover:scale-105 transition-transform duration-300 text-black"
        style={{ background: "#DB9029" }}
      >
        Got it, thank you!
      </button>

      <style>{`
        @keyframes ringDraw  { to { stroke-dashoffset: 0; } }
        @keyframes checkDraw { to { stroke-dashoffset: 0; } }
      `}</style>
    </div>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const LearnWithUs = () => {
  const [form, setForm]           = useState(initial);
  const [errors, setErrors]       = useState({});
  const [sending, setSending]     = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [sendError, setSendError] = useState("");

  const handle = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: false }));
  };

  const toggleProgram = (title) =>
    setForm((p) => ({
      ...p,
      programs: p.programs.includes(title)
        ? p.programs.filter((s) => s !== title)
        : [...p.programs, title],
    }));

  const validate = () => {
    const e = {};
    REQUIRED.forEach((f) => { if (!form[f].trim()) e[f] = true; });
    if (form.programs.length === 0 && !form.customInterest.trim()) e.programs = true;
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
          full_name:        `${form.firstName} ${form.lastName}`,
          dob:              form.dob              || "Not provided",
          gender:           form.gender           || "Not specified",
          phone:            form.phone,
          email:            form.email            || "Not provided",
          region:           form.region,
          occupation:       form.occupation       || "Not provided",
          programs:         form.programs.length > 0 ? form.programs.join(", ") : "None selected",
          custom_interest:  form.customInterest   || "None",
          experience_level: form.experienceLevel,
          goal:             form.goal,
          hear_from:        form.hearFrom         || "Not specified",
          time:             new Date().toLocaleString("en-TZ", { timeZone: "Africa/Dar_es_Salaam" }),
        },
        EJS_PUBLIC_KEY
      );
      setForm(initial);
      setShowModal(true);
    } catch (err) {
      console.error("EmailJS error:", err);
      setSendError(
        "Something went wrong. Please try again or contact us directly on WhatsApp (+255 789 345 845)."
      );
    } finally {
      setSending(false);
    }
  };

  const inputCls = (name) =>
    `w-full bg-n-8 border rounded-xl px-4 py-3 text-sm text-n-1 outline-none
     transition-colors duration-300
     ${errors[name] ? "border-red-500 focus:border-red-400" : "border-n-6 focus:border-[#DB9029]"}`;

  const SectionHeading = ({ icon, children }) => (
    <h3 className="body-1 font-bold mb-4 mt-8 first:mt-0 flex items-center gap-2"
      style={{ color: "#DB9029" }}>
      <span>{icon}</span>{children}
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
      <Header2 />

      {showModal && (
        <SuccessModal
          name={`${form.firstName || "there"}`}
          onClose={() => setShowModal(false)}
        />
      )}

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
                Learn With Us{" "}
                <img
                  src={curve}
                  className="absolute top-full left-0 w-full xl:-mt-2"
                  width={624} height={28} alt=""
                />
              </span>
            </h1>
            <p className="body-1 text-n-3 max-w-2xl mx-auto">
              Register to access programs in sales, marketing, business development
              and digital skills that is designed for Tanzania's growing economy by
              improving your business performance and employability through
              practical skills development.
            </p>
          </div>

          {/* ── FORM CARD ── */}
          <div className="max-w-3xl mx-auto mb-24 px-4">
            <div className="p-8 md:p-10 rounded-2xl border border-n-6 bg-n-8">

              {/* ── Personal ── */}
              <SectionHeading icon="">Personal Information</SectionHeading>
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

              {/* ── Contact ── */}
              <SectionHeading icon="">Contact Details</SectionHeading>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label error={errors.phone}>WhatsApp number *</Label>
                  <input name="phone" value={form.phone} onChange={handle}
                    placeholder="+255 7XX XXX XXX" className={inputCls("phone")} />
                </div>
                <div>
                  <Label>Email address</Label>
                  <input type="email" name="email" value={form.email} onChange={handle}
                    placeholder="you@example.com" className={inputCls("email")} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label error={errors.region}>Region in Tanzania *</Label>
                  <select name="region" value={form.region} onChange={handle}
                    className={inputCls("region")}>
                    <option value="">Select region…</option>
                    {REGIONS.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Current occupation</Label>
                  <input name="occupation" value={form.occupation} onChange={handle}
                    placeholder="e.g. Student, Sales Rep…" className={inputCls("occupation")} />
                </div>
              </div>

              {/* ── Programs ── */}
              <SectionHeading icon="">Programs of Interest *</SectionHeading>
              {errors.programs && (
                <p className="text-xs text-red-400 -mt-2 mb-3">
                  Please select at least one program or describe your own interest below
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {PROGRAMS.map((p) => {
                  const active = form.programs.includes(p.title);
                  return (
                    <div
                      key={p.title}
                      onClick={() => toggleProgram(p.title)}
                      className="cursor-pointer rounded-xl border p-4 transition-all duration-300"
                      style={{
                        borderColor: active ? "#DB9029" : "",
                        background: active ? "#DB902912" : "",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* checkbox circle */}
                        <div
                          className="mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                          style={{
                            borderColor: active ? "#DB9029" : "",
                            background: active ? "#DB902930" : "",
                          }}
                        >
                          {active && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <polyline points="1.5,5 4,7.5 8.5,2" stroke="#DB9029"
                                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className={`text-sm font-semibold transition-colors duration-300 ${active ? "text-n-1" : "text-n-3"}`}>
                            {p.icon} {p.title}
                          </p>
                          <p className="text-xs text-n-4 mt-0.5 leading-relaxed">{p.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── Custom / Other Interest ── */}
              <div className="mb-4">
                <Label>Want to study something else? (optional)</Label>
                <textarea
                  name="customInterest"
                  value={form.customInterest}
                  onChange={handle}
                  rows={3}
                  placeholder="e.g. Supply chain management, public speaking, financial literacy, leadership skills…"
                  className={inputCls("customInterest") + " resize-y min-h-[90px]"}
                />
                <p className="text-xs text-n-4 mt-1.5">
                  Have a topic in mind that isn't listed above? Describe it here and our team will see how we can help.
                </p>
              </div>

              {/* ── Experience ── */}
              <SectionHeading icon="">Your Experience Level</SectionHeading>
              <div className="mb-4">
                <Label error={errors.experienceLevel}>Current level in sales / marketing *</Label>
                <select name="experienceLevel" value={form.experienceLevel} onChange={handle}
                  className={inputCls("experienceLevel")}>
                  <option value="">Select…</option>
                  {EXPERIENCE_LEVELS.map((e) => <option key={e}>{e}</option>)}
                </select>
              </div>

              {/* ── Goal ── */}
              <div className="mb-4">
                <Label error={errors.goal}>What do you hope to achieve? *</Label>
                <textarea name="goal" value={form.goal} onChange={handle}
                  rows={4}
                  placeholder="e.g. I want to start my own business, get a job in sales, improve my digital skills…"
                  className={inputCls("goal") + " resize-y min-h-[100px]"} />
              </div>

              {/* ── How did you hear ── */}
              <SectionHeading icon="">Where Did You Hear About Us?</SectionHeading>
              <div className="mb-8">
                <Label>Source (optional)</Label>
                <select name="hearFrom" value={form.hearFrom} onChange={handle}
                  className={inputCls("hearFrom")}>
                  <option value="">Select…</option>
                  {HEAR_FROM.map((h) => <option key={h}>{h}</option>)}
                </select>
              </div>

              {/* ── Error banner ── */}
              {sendError && (
                <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10
                  px-4 py-3 text-sm text-red-400">
                  {sendError}
                </div>
              )}

              {/* ── Submit ── */}
              <button
                onClick={submit}
                disabled={sending}
                className="w-full flex items-center justify-center gap-2
                  px-8 py-4 rounded-full font-semibold tracking-wide text-black
                  hover:scale-105 transition-transform duration-300
                  disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                style={{ background: "#DB9029" }}
              >
                {sending ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Registering…
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M22 2L11 13" /><path d="M22 2L15 22l-4-9-9-4 20-7z" />
                    </svg>
                    Register Now
                  </>
                )}
              </button>

            </div>
          </div>

        </div>
      </Section>

      <Footer />
    </>
  );
};

export default LearnWithUs;