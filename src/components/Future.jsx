/* eslint-disable no-unused-vars */
import Section from "./Section";
import Heading from "./Heading";
import Header2 from "./Header2";
import Footer from "./Footer";
import { check, curve, PM } from "../assets";

const Future = () => {
  return (
    <>
      <Header2 />
      <Section
        className="pt-[12rem] -mt-[5.25rem]"
        crosses
        crossesOffset="lg:translate-y-[5.25rem]"
        customPaddings
      >
        <div className="container relative">

          {/* Heading — mobile only (stacks above image) */}
          <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-8 lg:hidden">
            <h1 className="h1 mb-6">
              <span className="inline-block relative">
                The Future{" "}
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

          {/* Image left + Heading right — wide screens */}
          <div className="flex flex-col lg:flex-row items-center gap-10 mb-12 px-4">

            

            {/* Heading right — desktop only */}
            <div className="w-full lg:w-1/2 hidden lg:flex items-center justify-center">
              <h1 className="h1 text-center lg:text-left">
                <span className="inline-block relative">
                  The Future{" "}
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
            {/* Image */}
            <div className="w-full lg:w-1/2 flex-shrink-0">
              <div className="relative p-0.5 rounded-2xl bg-conic-gradient">
                <img
                  src={PM}
                  alt="The Future"
                  className="rounded-2xl w-full h-[280px] md:h-[380px] lg:h-[420px] object-cover"
                />
              </div>
            </div>

          </div>

          {/* Content */}
          <div className="max-w-3xl mx-auto mb-20 space-y-5 px-4">

            <p className="body-1 text-n-2">
              Finding new customers shouldn't feel like searching for a needle in a haystack.
              Traditional sales relied on volume — endless calls, mass emails, and hoping
              something would stick. But that strategy wastes time, drains resources, and
              burns out sales teams.
            </p>

            <p className="body-1 text-n-2">
              Today's top-performing teams take a smarter approach. They use
              intelligence-driven prospecting to identify high-potential customers before
              making first contact, helping them close deals faster and more efficiently.
            </p>

            <p className="body-1 text-n-2">
              Therefore, we are preparing for the adoption of <span className="text-color-1 font-semibold">AI marketing tools for B2B
              lead generation</span>.
            </p>

            {/* Bullet points */}
            <ul className="space-y-4 pt-2">
              <li className="flex items-start gap-3">
                <img src={check} width={24} height={24} alt="" className="mt-1 flex-shrink-0" />
                <div>
                <p className="body-1 text-color-1 font-bold mb-1">The power of AI </p>
                <p className="body-1 text-n-2">
                  They will transform your process from a numbers game into a strategic
                  operation, helping you find higher-quality leads and personalize your
                  communication.
                </p></div>
              </li>
              <li className="flex items-start gap-3">
                <img src={check} width={24} height={24} alt="" className="mt-1 flex-shrink-0" />
                <div>
                  <p className="body-1 text-color-1 font-bold mb-1">Results Monitoring</p>
                  <p className="body-1 text-n-2">
                    Our live dashboard will keep your team updated 24/7. You can see the
                    status of your sales network of reps and distributors at all times.
                  </p>
                </div>
              </li>
            </ul>

          </div>
        </div>
      </Section>
      <Footer />
    </>
  );
};

export default Future;