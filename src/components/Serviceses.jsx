/* eslint-disable no-unused-vars */
import { curve, heroBackground, loading, service } from "../assets";
import Button from "./Button";
import Section from "./Section";
import Heading from "./Heading";
import Header2 from "./Header2";
import Footer from "./Footer";
import Arrow from "../assets/svg/Arrow";
import { GradientLight } from "./design/Benefits";
import ClipPath from "../assets/svg/ClipPath";
import { Link } from "react-router-dom";
import { benefits } from "../constants";
import { BackgroundCircles, BottomLine, Gradient } from "./design/Hero";
import { heroIcons } from "../constants";
import { ScrollParallax } from "react-just-parallax";
import { useRef, useState } from "react";
import Generating from "./Generating";
import Notification from "./Notification";
import CompanyLogos from "./CompanyLogos";
import Tagline from "./Tagline";
import { roadmap } from "../constants";
import { check2, grid, loading1 } from "../assets";
import { Plus } from "lucide-react";
import RegistrationModal from "./RegistrationModal";

const Serviceses = () => {
  const parallaxRef = useRef(null);
  const [regModalOpen, setRegModalOpen] = useState(false);

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

          {/* ── Hero ── */}
          <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]">
            <h1 className="h1 mb-6">
              <span className="inline-block relative mb-6">
                UJENZI LINKING SOLUTIONS{" "}
                <img
                  src={curve}
                  className="absolute top-full left-0 w-full xl:-mt-2"
                  width={624}
                  height={28}
                  alt="Curve"
                />
              </span>
              Services{` `}
            </h1>
            <div className="relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24">
              <div className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient">
                <div className="relative bg-n-8 rounded-[1rem]">
                  <div className="h-[1.4rem] bg-n-10 rounded-t-[0.9rem]" />
                  <div className="aspect-[33/40] rounded-b-[0.9rem] overflow-hidden md:aspect-[688/490] lg:aspect-[1024/490]">
                    <img
                      src={service}
                      className="w-full scale-[1.7] translate-y-[8%] md:scale-[1] md:-translate-y-[10%] lg:-translate-y-[23%]"
                      width={1024}
                      height={490}
                      alt="AI"
                    />
                  </div>
                </div>
              </div>
              <div className="absolute -top-[54%] left-1/2 w-[234%] -translate-x-1/2 md:-top-[46%] md:w-[138%] lg:-top-[104%]" />
              <BackgroundCircles />
            </div>
          </div>

          {/* ── Register CTA Banner ── */}
          {/* <div className="flex flex-col sm:flex-row items-center justify-between gap-4
                          bg-n-8 border border-n-6 rounded-2xl px-6 py-5 mb-10 max-w-3xl mx-auto">
            <div>
              <h3 className="text-n-1 font-bold text-lg">Own a business?</h3>
              <p className="text-n-4 text-sm mt-0.5">
                Get listed in our directory and reach more customers instantly.
              </p>
            </div>
            <button
              onClick={() => setRegModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-color-1 text-n-8
                         font-bold rounded-xl hover:opacity-90 active:scale-95
                         transition-all duration-150 text-sm flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              Register Your Business
            </button>
          </div> */}

          {/* ── Our Services Text ── */}
          <div className="max-w-3xl mx-auto mb-10 space-y-6">
            <h1 className="h1 mb-6 md:max-w-md lg:max-w-2xl text-left">
              Our Services{` `}
            </h1>
            <div>
              <h3 className="h5 text-color-1 mb-2">1. Product Sales Network</h3>
              <p className="body-1 text-n-2">
                With experience in bringing products to market, we can develop a robust sales network
                of sales reps, manufacturers' representatives, and distributors to bring your products,
                services, and capabilities to your target customers.
              </p>
            </div>
            <div>
              <h3 className="h5 text-color-1 mb-2">2. Sales Team Development</h3>
              <p className="body-1 text-n-2">
                We can use our extensive network to build a sales team of sales reps and distributors
                from the ground up, ensuring you have the right team in place.
              </p>
            </div>
            <div>
              <h3 className="h5 text-color-1 mb-2">3. Affordable Marketing Promotion Solutions</h3>
              <p className="body-1 text-n-2">
                We provide cost-effective customer experience and marketing promotion services that help
                businesses grow sales, strengthen customer relationships, and reduce marketing expenses.
              </p>
            </div>
          </div>

          {/* ── Category Cards ── */}
          <div className="flex flex-wrap gap-10 mb-10">
            {benefits.map((item) => (
              <div
                className="block relative p-0.5 bg-no-repeat bg-[length:100%_100%] md:max-w-[24rem]"
                style={{ backgroundImage: `url(${item.backgroundUrl})` }}
                key={item.id}
              >
                <div className="relative z-2 flex flex-col min-h-[22rem] p-[2.4rem]">
                  <h5 className="h5 mb-5">{item.title}</h5>
                  <p className="body-2 mb-6 text-n-3">{item.text}</p>

                  <div className="flex items-center mt-auto gap-3">
                    {/* Register in this category */}
                    <button
                      onClick={() => setRegModalOpen(true)}
                      className="flex items-center gap-1 font-code text-xs font-bold text-n-4
                                 uppercase tracking-wider hover:text-color-1 transition-colors"
                    >
                      <Plus className="w-3 h-3" /> Register
                    </button>

                    <Link
                      to={`/benefits/${item.id}`}
                      className="ml-auto flex items-center font-code text-xs font-bold
                                 text-color-1 uppercase tracking-wider hover:underline"
                    >
                      View All
                      <Arrow />
                    </Link>
                  </div>
                </div>

                {item.light && <GradientLight />}

                <div
                  className="absolute inset-0.5 bg-n-8"
                  style={{ clipPath: "url(#benefits)" }}
                >
                  <div className="absolute inset-0 bg-black opacity-20 transition-opacity duration-300 group-hover:opacity-60">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        width={380}
                        height={362}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>

                <ClipPath />
              </div>
            ))}
          </div>

        </div>
      </Section>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={regModalOpen}
        onClose={() => setRegModalOpen(false)}
      />

      <Footer />
    </>
  );
};

export default Serviceses;