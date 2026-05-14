/* eslint-disable no-unused-vars */
import Section from "./Section";
import Header2 from "./Header2";
import Footer from "./Footer";
import { check, curve, chom1 } from "../assets";

const services = [
  "Sales and marketing strategy development",
  "Business promotion and brand visibility campaigns",
  "Corporate and entrepreneurship training programs",
  "Market research and business advisory services",
  "Job placement and workforce development support",
  "Youth empowerment through practical business and employability skills training",
];

const pillars = [
  {
    title: "The Power of AI",
    body:
      "AI marketing tools transform your process from a numbers game into a strategic operation — finding higher-quality B2B leads and personalising every touchpoint for faster closes.",
  },
  {
    title: "Results Monitoring",
    body:
      "Our live dashboard keeps your team updated 24/7. Track every sales rep and distributor in your network in real time, at a glance.",
  },
  {
    title: "Market Linkage",
    body:
      "Through Ujenzi Linking Solutions, our digital marketplace connects suppliers, contractors, engineers, and service providers to customers across Tanzania's construction sector.",
  },
  {
    title: "Workforce Development",
    body:
      "We equip young professionals and entrepreneurs with market-ready skills through mentorship, training, and employment-linkage initiatives that reduce unemployment while supplying businesses with skilled talent.",
  },
];

const Chomoza = () => {
  return (
    <>
      <Header2 />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <Section
        className="pt-[12rem] -mt-[5.25rem]"
        crosses
        crossesOffset="lg:translate-y-[5.25rem]"
        customPaddings
      >
        <div className="container relative">

          {/* Mobile heading */}
          <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-8 lg:hidden">
            <h1 className="h1 mb-6">
              <span className="inline-block relative">
                CHOMOZA{" "}
                <img
                  src={curve}
                  className="absolute top-full left-0 w-full xl:-mt-2"
                  width={624}
                  height={28}
                  alt=""
                />
              </span>
            </h1>
          </div>

          {/* Desktop: heading left, image right */}
          <div className="flex flex-col lg:flex-row items-center gap-10 mb-16 px-4">
<div className="w-full lg:w-1/2 flex-shrink-0">
              <div className="relative p-0.5 rounded-2xl bg-conic-gradient">
                <img
                  src={chom1}
                  alt="CHOMOZA — The Future"
                  className="rounded-2xl w-full h-[280px] md:h-[380px] lg:h-[440px] object-cover"
                />
              </div>
            </div>
            <div className="w-full lg:w-1/2 hidden lg:flex flex-col justify-center gap-6">
              <h1 className="h1 text-left">
                <span className="inline-block relative">
                  CHOMOZA{" "}
                  <img
                    src={curve}
                    className="absolute top-full left-0 w-full xl:-mt-2"
                    width={624}
                    height={28}
                    alt=""
                  />
                </span>
              </h1>
              <p className="body-1 text-n-3 max-w-md">
                CHOMOZA Business Consultancy (T) Ltd always empowering businesses
                through strategic consultancy, practical market solutions, and
                digital transformation across Tanzania.
              </p>

             
            </div>

            
          </div>

          

          {/* ── WHO WE ARE ──────────────────────────────────────── */}
          <div className="max-w-3xl mx-auto mb-20 space-y-5 px-4">
            <h2 className="h3 text-n-1">Who We Are</h2>

            <p className="body-1 text-n-2">
              CHOMOZA Business Consultancy (T) Ltd serves as the strategic
              business development and commercial support arm within a broader
              ecosystem that also includes{" "}
              <span className="text-color-1 font-semibold">
                Ujenzi Linking Solutions
              </span>{" "}
              — Tanzania's specialist digital marketplace for the construction
              and building industry.
            </p>

            <p className="body-1 text-n-2">
              Our team brings extensive experience in sales outsourcing, sales
              training, and marketing promotion across building &amp;
              construction materials, machinery &amp; technology, FMCGs, service
              businesses, and the hospitality sector.
            </p>

            <p className="body-1 text-n-2">
              Today's top-performing teams take a smarter approach — using
              intelligence-driven prospecting to identify high-potential
              customers before first contact, closing deals faster and more
              efficiently. That is why we are actively adopting{" "}
              <span className="text-color-1 font-semibold">
                AI marketing tools for B2B lead generation
              </span>
              .
            </p>
          </div>

          {/* ── OUR SERVICES ────────────────────────────────────── */}
          <div className="max-w-3xl mx-auto mb-20 px-4">
            <h2 className="h3 text-n-1 mb-8">Our Services</h2>
            <ul className="space-y-4">
              {services.map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <img
                    src={check}
                    width={24}
                    height={24}
                    alt=""
                    className="mt-1 flex-shrink-0"
                  />
                  <p className="body-1 text-n-2">{s}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* ── FOUR PILLARS ────────────────────────────────────── */}
          <div className="max-w-5xl mx-auto mb-20 px-4">
            <h2 className="h3 text-n-1 mb-10 text-center">
              What Sets Us Apart
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {pillars.map((p, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl border border-n-6 bg-n-8 hover:border-color-1 transition-colors duration-300"
                >
                  <p className="body-1 text-color-1 font-bold mb-2">{p.title}</p>
                  <p className="body-1 text-n-2">{p.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── ECOSYSTEM ───────────────────────────────────────── */}
          <div className="max-w-3xl mx-auto mb-20 px-4 space-y-5">
            <h2 className="h3 text-n-1">
              A Complete Business Growth Ecosystem
            </h2>
            <p className="body-1 text-n-2">
              Together, CHOMOZA and Ujenzi Linking Solutions create a modern
              commercial ecosystem that combines business consultancy, sales
              &amp; marketing execution, digital business visibility,
              industry-specific networking, market linkage, and workforce
              development — all under one strategic partnership.
            </p>
            <p className="body-1 text-n-2">
              Businesses move from planning and strategy development to{" "}
              <span className="text-color-1 font-semibold">
                active market participation and measurable commercial growth
              </span>
              , whether they are established enterprises or emerging startups.
            </p>
          </div>

          {/* ── CONTACT STRIP ───────────────────────────────────── */}
          <div className="max-w-3xl mx-auto mb-24 px-4">
            <div className="p-8 rounded-2xl bg-conic-gradient bg-n-8 text-center space-y-4">
              <h3 className="h4 text-n-1">Ready to grow your business?</h3>
              <p className="body-1 text-n-2">
                Call or WhatsApp us today — our consultants are standing by.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <a
                  href="tel:+255789345845"
                  className="px-8 py-3 rounded-full bg-n-14 text-black font-semibold tracking-wide hover:scale-105 transition-transform duration-300"
                >
                  CALL NOW
                </a>
                <a
                  href="https://wa.me/255789345845"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 rounded-full bg-n-14 text-black font-semibold tracking-wide hover:scale-105 transition-transform duration-300"
                >
                  WHATSAPP
                </a>
               
              </div>
            </div>
          </div>

        </div>
      </Section>
      <Footer />
    </>
  );
};

export default Chomoza;