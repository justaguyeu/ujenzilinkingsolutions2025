/* eslint-disable no-unused-vars */
import { curve, heroBackground, robot } from "../assets";
import Button from "./Button";
import Section from "./Section";
import Heading from "./Heading";
// eslint-disable-next-line no-unused-vars
import { BackgroundCircles, BottomLine, Gradient } from "./design/Hero";
import { heroIcons } from "../constants";
import { ScrollParallax } from "react-just-parallax";
import { useRef } from "react";
import Generating from "./Generating";
import Notification from "./Notification";
import CompanyLogos from "./CompanyLogos";
import Tagline from "./Tagline";
import { roadmap } from "../constants";
import { check2, grid, loading1 } from "../assets";

const Hero = () => {
  const parallaxRef = useRef(null);

  return (
    <Section
      className="pt-[12rem] -mt-[5.25rem]"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >
      <div className="container relative" ref={parallaxRef}>
        <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]">
          <h1 className="h1 mb-6">
            We take you to {` `}
            <span className="inline-block relative">
              New Markets{" "}
              <img
                src={curve}
                className="absolute top-full left-0 w-full xl:-mt-2"
                width={624}
                height={28}
                alt="Curve Decoration"
                loading="lazy"
              />
            </span>
          </h1>
        </div>
        <div className="relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24">
          <div className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient">
            <div className="relative bg-n-8 rounded-[1rem]">
              <div className="h-[1.4rem] bg-n-10 rounded-t-[0.9rem]" />

              <div className="aspect-[33/40] rounded-b-[0.9rem] overflow-hidden md:aspect-[688/490] lg:aspect-[1024/490]">
                <img
                  src={robot}
                  className="w-full scale-[1.7] translate-y-[8%] md:scale-[1] md:-translate-y-[10%] lg:-translate-y-[23%]"
                  width={1024}
                  height={490}
                  alt="Ujenzi Linking Solutions Hero"
                  fetchpriority="high"
                />
              </div>

            </div>
          </div>

          <BackgroundCircles />
        </div>
        <Section className="overflow-hidden" id="pricing" >
          <Heading
            className="md:max-w-md lg:max-w-2xl text-left text-color-1" 
            title="Abous Us"
          />
  
          <div className="space-y-6 sm:space-y-6">
          <p className="body-1 max-w-3xl mx-auto mb-1 text-n-2 lg:mb-3 text-left">
            Ujenzi Linking Solutions is a Tanzania-based online platform established in 2024 to connect businesses, markets, and opportunities within the building and construction industry. The name “Ujenzi,” meaning Construction in Kiswahili, reflects the company’s commitment to supporting businesses of all sizes in the building and construction materials sector by helping them reach new markets, increase sales, and access customized, affordable sales and marketing solutions.
            </p>
          

          
          {/* <p className="body-1 max-w-3xl mx-auto mb-1 text-n-2 lg:mb-3 text-left">Also, we aim to support the Government of Tanzania in addressing the youth employment challenge by providing On-the-job Sales & Marketing Training and Job placement service to equip individuals with necessary sales and marketing skills, enabling them to secure employment and helping business owners find highly skilled salespeople to boost their sales volumes.
          </p>
          <p className="body-1 max-w-3xl mx-auto mb-1 text-n-2 lg:mb-3 text-left">This is also an online platform which promotes products and services to potential customers, increasing awareness and driving sales. 
          </p> */}
          </div>
        </Section>
      </div>




      {/* <BottomLine/> */}
    </Section>
  );
};

export default Hero;
