/* eslint-disable no-unused-vars */
import Section from "./Section";
import Heading from "./Heading";
import { motion } from "framer-motion";
import { service1, service2, chom1, check, } from "../assets";
import { brainwaveServices, brainwaveServicesIcons, } from "../constants";
import {
  PhotoChatMessage,
  Gradient,
  VideoBar,
  VideoChatMessage,
} from "./design/Services";
import Generating from "./Generating";

const Services = () => {
  return (
    <Section id="how-to-use">
      <div className="container">
        <Heading
        className="text-center"
          title="ENJOY THE TOP SITE SERVICE"
          // text="The Sales and Experiential Marketing Outsource with a highly skilled, innovative and experienced Sales & Marketing team that can quickly access desired Customers who are difficult to attain; a team fine-tuned by the Sales & Marketing master with over 15 years’ experience in several industries such as Building & Construction products i.e. ALAF LTD (Tanzanian) – marketing and selling Roofing sheets, Machines & Technology, FMCG and Service sector in Tanzania."
        
        />
        
        <div className="relative">
          <div className="relative z-1  gap-5 lg:grid-cols-2">
            <div className="p-4 rounded-3xl overflow-hidden ">
              <div className="p-4  rounded-3xl overflow-hidden">
  <div className="relative h-[20rem] md:h-[25rem] bg-n-8 rounded-xl flex items-center justify-center overflow-hidden">
    
    <motion.img
      src={chom1}
      alt="Service visual"
      className="
        w-[320px]
        sm:w-[400px]
        md:w-[500px]
        lg:w-[560px]
        object-contain
      "
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
        <div className="flex justify-center mt-6">
  <a href="tel:+255789345845">
  <button
    className="
      px-8 py-3
      rounded-full
      bg-n-14
      text-black
      font-semibold
      tracking-wide
      hover:scale-105
      transition-transform duration-300
    "
  >
    Learn More
  </button>
</a>

  </div>
      </div>
    </Section>
  );
};

export default Services;
