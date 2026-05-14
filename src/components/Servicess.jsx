/* eslint-disable no-unused-vars */
import Section from "./Section";
import Heading from "./Heading";
import { motion } from "framer-motion";
import { chom1, check } from "../assets";
import { Gradient } from "./design/Services";
import { useNavigate } from "react-router-dom";

const highlights = [
  {
    icon: "",
    title: "Sales Outsourcing",
    text: "A highly skilled team fine-tuned by 15+ years of Sales & Marketing experience across multiple industries in Tanzania.",
  },
  {
    icon: "",
    title: "AI-Powered Lead Gen",
    text: "Intelligence-driven B2B prospecting that identifies high-potential customers before first contact.",
  },
  {
    icon: "",
    title: "Live Dashboard",
    text: "Monitor your sales network of reps and distributors 24/7 with real-time status updates.",
  },
];

const Services = () => {
  const navigate = useNavigate();

  return (
    <Section id="how-to-use">
      <div className="container">

        <Heading
          className="text-center"
          title="ENJOY THE TOP SITE SERVICE"
        />

        {/* ── Animated image ──────────────────────────────────── */}
        <div className="relative mb-10">
          <div className="relative z-1">
            <div className="p-4 rounded-3xl overflow-hidden">
              <div className="p-4 rounded-3xl overflow-hidden">
                <div className="relative h-[20rem] md:h-[25rem] bg-n-8 rounded-xl flex items-center justify-center overflow-hidden">
                  <motion.img
                    src={chom1}
                    alt="CHOMOZA Service visual"
                    className="w-[320px] sm:w-[400px] md:w-[500px] lg:w-[560px] object-contain"
                    animate={{
                      opacity: [0, 1, 1, 0],
                      scale: [1, 1.05, 1.05, 1],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <Gradient />
        </div>

        {/* ── Highlight cards ─────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12 px-2">
          {highlights.map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="p-5 rounded-2xl border border-n-6 bg-n-8 hover:border-color-1 transition-colors duration-300 flex flex-col gap-2"
            >
              <span className="text-3xl">{h.icon}</span>
              <p className="body-1 text-color-1 font-bold">{h.title}</p>
              <p className="body-2 text-n-3">{h.text}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Tagline ─────────────────────────────────────────── */}
        {/* <p className="body-1 text-n-3 text-center max-w-2xl mx-auto mb-10 px-4">
          CHOMOZA Business Consultancy (T) Ltd — empowering businesses across
          Tanzania through strategic consultancy, sales outsourcing, and digital
          transformation.
        </p> */}

        {/* ── CTAs ────────────────────────────────────────────── */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate("/chomoza")}
            className="px-8 py-3 rounded-full bg-n-14 text-black font-semibold tracking-wide hover:scale-105 transition-transform duration-300"
          >
            Learn More
          </button>
          {/* <a
            href="tel:+255789345845"
            className="px-8 py-3 rounded-full border border-n-6 text-n-1 font-semibold tracking-wide hover:border-color-1 hover:text-color-1 transition-colors duration-300"
          >
            📞 Call Us Now
          </a> */}
        </div>

      </div>
    </Section>
  );
};

export default Services;