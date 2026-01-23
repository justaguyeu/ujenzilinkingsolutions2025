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
            Transforming Challenges into Opportunities, with{` `}
            {/* Explore the Possibilities of&nbsp;AI&nbsp;Chatting with {` `} */}
            <span className="inline-block relative">
              UJENZI LINKING SOLUTIONS{" "}
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

          {/* <Button href="/pricing" white>
            JOIN OUR TEAM
          </Button> */}
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

                {/* <Generating className="absolute left-4 right-4 bottom-5 md:left-1/2 md:right-auto md:bottom-8 md:w-[31rem] md:-translate-x-1/2" /> */}

                {/* <ScrollParallax isAbsolutelyPositioned>
                  <ul className="hidden absolute -left-[5.5rem] bottom-[7.5rem] px-1 py-1 bg-n-9/40 backdrop-blur border border-n-1/10 rounded-2xl xl:flex">
                    {heroIcons.map((icon, index) => (
                      <li className="p-5" key={index}>
                        <img src={icon} width={24} height={25} alt={icon} />
                      </li>
                    ))}
                  </ul>
                </ScrollParallax> */}

                {/* <ScrollParallax isAbsolutelyPositioned>
                  <Notification
                    className="hidden absolute -right-[5.5rem] bottom-[11rem] w-[18rem] xl:flex"
                    title="Developers"
                  />
                </ScrollParallax> */}
              </div>

            </div>

            {/* <Gradient/> */}
          </div>
          {/* <div className="absolute -top-[54%] left-1/2 w-[234%] -translate-x-1/2 md:-top-[46%] md:w-[138%] lg:-top-[104%]">
          <img
              src={heroBackground}
              className="w-full"
              width={1440}
              height={1800}
              alt="hero"
            />
          </div> */}

          <BackgroundCircles />
        </div>

        {/* <CompanyLogos className="hidden relative z-10 mt-2 lg:block" /> */}
        <Section className="overflow-hidden" id="pricing" >
          <Heading
            className="md:max-w-md lg:max-w-2xl text-center text-color-1" 
            title="Abous Us"
          />
          <p className="body-1 max-w-3xl mx-auto mb-1 text-n-2 lg:mb-3 text-center">
            Welcome to Ujenzi Linking Solutions where businesses, markets,
            and opportunities connect. Founded in Tanzania in 2024, Ujenzi
            (Kiswahili for Construction) is committed to helping businesses
            of all sizes discover new markets, increase sales volumes, and
            access affordable, tailor-made sales and marketing solutions.
            We believe every business deserves the right tools and strategies
            to grow and thrive.</p>
          <div className="container md:pb-10">
            <div className="relative grid gap-6 md:grid-cols-2 md:gap-4 md:pb-[7rem]">
              {roadmap.map((item) => {
                const status = item.status === "done" ? "CEO" : "MANAGER";

                return (
                  <div
                    className={`md:flex even:md:translate-y-[7rem] p-0.25 rounded-[2.5rem] ${item.colorful ? "bg-conic-gradient" : "bg-n-6"
                      }`}
                    key={item.id}
                  >
                    <div className="relative p-8 bg-n-8 rounded-[2.4375rem] overflow-hidden xl:p-15">
                      {/* <div className="absolute top-0 left-0 max-w-full">
                        <img
                          className="w-full"
                          src={grid}
                          width={550}
                          height={550}
                          alt="Grid"
                        />
                      </div> */}
                      <div className="relative z-1">
                        {/* <div className="flex items-center justify-between max-w-[27rem] mb-8 md:mb-20">
                          <Tagline>{item.date}</Tagline>
      
                          <div className="flex items-center px-4 py-1 bg-n-1 rounded text-n-8">
                            <img
                              className="mr-2.5"
                              src={item.status === "done" ? check2 : loading1}
                              width={16}
                              height={16}
                              alt={status}
                            />
                            <div className="tagline">{status}</div>
                          </div>
                        </div> */}

                        {/* <div className="mb-10 -my-10 -mx-15">
                          <img
                            className="w-full"
                            src={item.imageUrl}
                            width={628}
                            height={426}
                            alt={item.title}
                          />
                        </div> */}
                        <h4 className="h4 mb-4 text-color-1">{item.title}</h4>
                        <p className="body-2 text-n-4">{item.text}</p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* <Gradient /> */}
            </div></div>

          <p className="body-1 max-w-3xl mx-auto mb-1 text-n-2 lg:mb-3 text-center mt-6">Beyond business growth, we are passionate about tackling youth unemployment
            in Tanzania. Through practical Sales & Marketing Training, on-the-job
            experience, and job placement services, we equip young people with the
            skills they need to secure employment while helping companies find skilled
            and motivated sales professionals to boost performance.
          </p>
          <p className="body-1 max-w-3xl mx-auto mb-1 text-n-2 lg:mb-3 text-center">Additionally, we aim to support the Government of Tanzania in addressing the youth employment challenge by providing On-the-job Sales & Marketing Training and Job placement service to equip individuals with necessary sales and marketing skills, enabling them to secure employment and helping business owners find highly skilled salespeople to boost their sales volumes.
          </p>
        </Section>
      </div>




      {/* <BottomLine/> */}
    </Section>
  );
};

export default Hero;
