/* eslint-disable no-unused-vars */
import Section from "./Section";
import Heading from "./Heading";
import { service1, service2, service3, check, } from "../assets";
import { brainwaveServices, brainwaveServicesIcons, } from "../constants";
import {
  PhotoChatMessage,
  Gradient,
  VideoBar,
  VideoChatMessage,
} from "./design/Services";
import { brainwaveSymbol } from "../assets";

import Generating from "./Generating";

const Servicess = () => {
  return (
    <Section id="how-to-use">
      <div className="container">
        <Heading
  title="Our Quality Experience"
  text="Our team has extensive experience in sales outsourcing, sales training, and marketing promotion services, with strong industry exposure in building & construction materials, machinery & technology, FMCGs, service businesses, and the hospitality sector."
/>


        <div className="relative">
          <div className="relative z-1 flex items-center h-[39rem] mb-5 p-8 border border-n-1/10 rounded-3xl overflow-hidden lg:p-20 xl:h-[46rem]">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none md:w-3/5 xl:w-auto">
              <img
                className="w-full h-full object-cover md:object-right"
                width={800}
                alt="Smartest AI"
                height={730}
                src={service1}
              />
            </div>

            <div className="relative z-1 max-w-[17rem] ml-auto bg-blur ">
              {/* <img
                    src={brainwaveSymbol}
                    className=""
                    alt=""
                    width={600}
                    height={200}
                  /> */}
              <h4 className="h4 mb-4 text-color-1 text-center font-bold">Ujenzi Linking Solutions</h4>
              {/* <p className="body-2 mb-[3rem] text-n-3 text-center">
                 Our quality experience is built on delivering tailor-made business strategies that drive measurable growth, empowering youth through practical training and job placement, and earning the trust of businesses across Tanzania. We pride ourselves on combining innovation, affordability, and impact to create sustainable solutions that benefit both entrepreneurs and skilled professionals.
              </p> */}
              
              <ul className="body-2">
                {brainwaveServices.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start py-4 "
                  >
                    <img width={24} height={24} src={check} />
                    <p className="ml-4 text-n-3 bg-white border border-n-6 rounded-full px-4 py-1 inline-block ">
  {item}
</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* <Generating className="absolute left-4 right-4 bottom-4 border-n-1/10 border lg:left-1/2 lg-right-auto lg:bottom-8 lg:-translate-x-1/2" /> */}
          </div>

          <div className="relative z-1  gap-5 lg:grid-cols-2"> 
            {/* <div className="relative min-h-[39rem] border border-n-1/10 rounded-3xl overflow-hidden">
              <div className="absolute inset-0">
                <img
                  src={service2}
                  className="h-full w-full object-cover"
                  width={630}
                  height={750}
                  alt="robot"
                />
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-b from-n-8/0 to-n-8/90 lg:p-15">
                <h4 className="h4 mb-4">Memory Management</h4>
                <p className="body-2 mb-[3rem] text-n-3">
                Efficient memory management is essential for preventing memory leaks and minimizing memory usage, which can significantly impact app performance.
                </p>
              </div>

              <PhotoChatMessage />
            </div> */}

            <div className="p-4 bg-n-14 rounded-3xl overflow-hidden lg:min-h-[46rem]">
              <div className="py-12 px-4 xl:px-8">
                <h4 className="h4 mb-4 text-n-8">Why Choose Us</h4>
                <p className="body-2 mb-[2rem] text-n-8">
                We understand that Marketing and Sales are the core functions of every business towards profit maximization; Let Ujenzi Linking Solutions help you with saving money and time on HR Management, prospects and customer database, market survey report, product or service adjustment consultations, building product or service awareness, inspire conversations and cultivate brand loyalty.

We also have committed experts who have special connections with Business compliance authorities.
                </p>

                {/* <ul className="flex items-center justify-between">
                  {brainwaveServicesIcons.map((item, index) => (
                    <li
                      key={index}
                      className={`rounded-2xl flex items-center justify-center ${
                        index === 2
                          ? "w-[3rem] h-[3rem] p-0.25 bg-conic-gradient md:w-[4.5rem] md:h-[4.5rem]"
                          : "flex w-10 h-10 bg-n-6 md:w-15 md:h-15"
                      }`}
                    >
                      <div
                        className={
                          index === 2
                            ? "flex items-center justify-center w-full h-full bg-n-7 rounded-[1rem]"
                            : ""
                        }
                      >
                        <img src={item} width={24} height={24} alt={item} />
                      </div>
                    </li>
                  ))}
                </ul> */}
              </div>

              <div className="relative h-[20rem] bg-n-8 rounded-xl overflow-hidden md:h-[25rem]">
                {/* <video
                autoPlay muted loop  
                  src={service3}
                  className="w-full h-full object-cover"
                  width={520}
                  height={400}
                  alt="Scary robot"
                />  */}
                <video className="w-full h-full object-cover"
                autoPlay muted loop  
                width={520} 
                height={400}
                alt="Scary robot"
                >
                <source src={service3} type="video/mp4" 
                
                />
                
              </video>

                {/* <VideoChatMessage />
                <VideoBar /> */}
              </div>
            </div>
          </div>

          <Gradient />
        </div>
      </div>
    </Section>
  );
};

export default Servicess;
