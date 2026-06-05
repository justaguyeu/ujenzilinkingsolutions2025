/* eslint-disable no-unused-vars */
import { curve, home2 } from "../assets";
import Section from "./Section";
import Heading from "./Heading";
import Header2 from "./Header2";
import Footer from "./Footer";
import { BackgroundCircles } from "./design/Hero";
import { useRef } from "react";
import { roadmap } from "../constants";
import { grid } from "../assets";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: "easeOut" },
  }),
};

const AboutUs = () => {
  const parallaxRef = useRef(null);

  return (
    <>
      <Header2 />
      <Section
        className="pt-[12rem] -mt-[5.25rem]"
        crosses
        crossesOffset="lg:translate-y-[5.25rem]"
        customPaddings
      >
        <div className="container relative" ref={parallaxRef}>

          {/* ── Hero heading ─────────────────────────────────── */}
          <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-12 md:mb-16">
            <motion.h1
              className="h1 mb-6"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              About{" "}
              <span className="inline-block relative">
                UJENZI LINKING SOLUTIONS
                <img
                  src={curve}
                  className="absolute top-full left-0 w-full xl:-mt-2"
                  width={624}
                  height={28}
                  alt="" role="presentation"
                />
              </span>
            </motion.h1>

            {/* Hero image frame */}
            <motion.div
              className="relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
            >
              <div className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient">
                <div className="relative bg-n-8 rounded-[1rem]">
                  <div className="h-[1.4rem] bg-n-10 rounded-t-[0.9rem]" />
                  <div className="aspect-[33/40] rounded-b-[0.9rem] overflow-hidden md:aspect-[688/490] lg:aspect-[1024/490]">
                    <img
                      src={home2}
                      className="w-full scale-[1.7] translate-y-[8%] md:scale-[1] md:-translate-y-[10%] lg:-translate-y-[23%]"
                      width={1024}
                      height={490}
                      alt="Ujenzi Linking Solutions"
                    />
                  </div>
                </div>
              </div>
              <BackgroundCircles />
            </motion.div>
          </div>

          {/* ── About text ───────────────────────────────────── */}
          <Heading
            className="md:max-w-md lg:max-w-2xl text-left text-color-1"
            id="about"
            title="The Company"
          />

          <motion.div
            className="space-y-5 max-w-3xl mx-auto mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
          >
            <p className="body-1 text-n-2 text-left">
              
              
              <span className="text-color-1 font-semibold">Ujenzi Linking Solutions</span>{" "}
              and its sister company 
               CHOMOZA Business Consultancy (T) Ltd{" "}form an integrated business growth and market expansion ecosystem serving Tanzania’s commercial sector.
              
            </p>

            <p className="body-1 text-n-2 text-left">
              From a marketing perspective, <span className="text-color-1">CHOMOZA Business Consultancy</span> positions itself as a 
              results-driven sales and marketing partner, delivering tailored solutions 
              in sales strategy, marketing promotion, training, and job placement to improve 
              business performance while also building youth employability through practical 
              skills development. Building on this foundation, Ujenzi Linking Solutions extends 
              the value chain by creating a focused digital marketplace for the building and 
              construction industry, connecting suppliers, contractors, and service providers 
              to new markets, increasing visibility, and driving sales opportunities{" "}
              
            </p>

            <p className="body-1 text-n-2 text-left">
               Together, the two platforms combine traditional consultancy expertise with digital market linkage to enhance growth, market access, and sustainable business expansion.
            </p>
          </motion.div>

          {/* ── CEO / Founder card ───────────────────────────── */}
          <Heading
            className="md:max-w-md lg:max-w-2xl text-center text-color-1"
            title="Meet the Founder"
          />

          <div className="max-w-4xl mx-auto mb-20 px-4">
            {roadmap.map((item, index) => (
              <motion.div
                key={item.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={index * 0.5}
                className={`p-0.5 rounded-[2.5rem] mb-8 ${
                  item.colorful ? "bg-conic-gradient" : "bg-n-6"
                }`}
              >
                <div className="relative bg-n-8 rounded-[2.4375rem] overflow-hidden">
                  {/* Grid texture */}
                  {/* <div className="absolute top-0 left-0 w-full pointer-events-none opacity-60">
                    <img src={grid} className="w-full" width={550} height={550} alt="" role="presentation" />
                  </div> */}

                  {/* Card content */}
                  <div className="relative z-1 p-6 md:p-10">

                    {/* Top meta row */}
                    <div className="flex flex-wrap items-center gap-3 mb-8">
                      {item.date && (
                        <span className="px-3 py-1 rounded-full border border-n-6 text-xs text-n-3 font-mono">
                          {item.date}
                        </span>
                      )}
                      {/* <span className="flex items-center md:items-center gap-2 px-4 py-1.5 bg-n-1 rounded-full justify-center text-n-8 text-xs font-bold uppercase tracking-wider">
                        {item.status || "Founder & CEO | Head of Sales "}
                      </span> */}
                    </div>

                    {/* Two-column: image left, text right */}
                    <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-center">

                      {/* Photo */}
                      {item.imageUrl && (
                        <div className="flex-shrink-0 flex flex-col items-center gap-4">
                          <div className="relative">
                            {/* Decorative ring */}
                            <div className="absolute -inset-1.5 rounded-2xl bg-conic-gradient opacity-70" />
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="relative w-48 h-56 md:w-52 md:h-64 object-cover object-top rounded-2xl"
                            />
                          </div>
                          
                          {/* Name below photo on mobile */}
                          <h4 className="h4 text-color-1 text-center md:hidden">{item.title}</h4>
                          <span className="flex items-center justify-center px-4 py-1 rounded-full text-color-1 font-bold uppercase tracking-wider text-center whitespace-nowrap text-[10px] md:text-xs">
  {item.status || "FOUNDER | CEO | HEAD OF SALES"}
</span>
                        </div>
                      )}

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        {/* Name — hidden on mobile (shown below photo) */}
                        <h4 className="h4 text-color-1 mb-5 hidden md:block">{item.title}</h4>

                        <p className="body-2 text-n-3 leading-relaxed mb-4 text-left md:text-left">{item.text}</p>
                        {item.text2 && (
                          <p className="body-2 text-n-3 leading-relaxed text-left md:text-left">{item.text2}</p>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </Section>
      <Footer />
    </>
  );
};

export default AboutUs;