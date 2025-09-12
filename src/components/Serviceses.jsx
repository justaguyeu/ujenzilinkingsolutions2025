/* eslint-disable no-unused-vars */
import { curve, heroBackground, loading } from "../assets";
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

const Serviceses = () => {
  const parallaxRef = useRef(null);

  return (
    <>
    <Header2/>
    <Section
      className="pt-[12rem] -mt-[5.25rem]"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      
    >
      <div className="container relative" ref={parallaxRef}>
        <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]">
          <h1 className="h1 mb-6">
          
            {/* Explore the Possibilities of&nbsp;AI&nbsp;Chatting with {` `} */}
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
          
         
        </div>
        

        <CompanyLogos className="hidden relative z-10 mt-20 lg:block" />
        
        <Heading
          className="md:max-w-md lg:max-w-2xl text-center text-color-1" id="pricing"
          title="Meet With Companies"
          
        />
        
        <p className="body-1 max-w-3xl mx-auto mb-1 text-n-2 lg:mb-3 text-center">
          At Ujenzi Linking Solutions, we help businesses of all sizes discover new markets, boost sales volumes, and access affordable, tailor-made marketing and sales strategies. By connecting suppliers, service providers, and customers, we create a network where collaboration drives growth.

We believe every business deserves the right tools, partners, and opportunities to grow and thrive. Whether you’re a startup seeking exposure, an established company looking for new markets, or a supplier aiming to connect with buyers, Ujenzi Linking Solutions is your trusted partner in making the right connections</p>
           <div className="container md:pb-10">
      
            </div>
            <div className="flex flex-wrap gap-10 mb-10">
                      {benefits.map((item) => (
                        <div
                          className="block relative p-0.5 bg-no-repeat bg-[length:100%_100%] md:max-w-[24rem]"
                          style={{
                            backgroundImage: `url(${item.backgroundUrl})`,
                          }}
                          key={item.id}
                        >
                          <div className="relative z-2 flex flex-col min-h-[22rem] p-[2.4rem]">
                            <h5 className="h5 mb-5">{item.title}</h5>
                            <p className="body-2 mb-6 text-n-3">{item.text}</p>
            
                            <div className="flex items-center mt-auto">
                              <img
                                src={item.iconUrl}
                                width={48}
                                height={48}
                                alt={item.title}
                              />
                              <Link
                                to={`/benefits/${item.id}`} // ✅ fixed
                                className="ml-auto flex items-center font-code text-xs font-bold text-color-1 uppercase tracking-wider hover:underline"
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
                            <div className="absolute inset-0 opacity-0 transition-opacity hover:opacity-10">
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
      
            
      

      {/* <BottomLine/> */}
    </Section>
     <Footer/>
    </>
  );
};

export default Serviceses;
