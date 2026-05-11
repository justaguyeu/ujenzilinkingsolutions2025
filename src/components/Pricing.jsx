/* eslint-disable no-unused-vars */
import Section from "./Section";
import { smallSphere, stars, two } from "../assets";
import Heading from "./Heading";
import PricingList from "./PricingList";
import { LeftLine, RightLine } from "./design/Pricing";
import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome';
import { faPhone, faMapMarkerAlt,faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Pricing = () => {
  return (
    <Section className="overflow-hidden">
      <div className="container relative z-2">
        
        {/* <div className="hidden relative justify-center mb-[6.5rem] lg:flex">
          <img
            src={smallSphere}
            className="relative z-1"
            width={255}
            height={255}
            alt="Sphere"
          />
          <div className="absolute top-1/2 left-1/2 w-[60rem] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <img
              src={stars}
              className="w-full"
              width={950}
              height={400}
              alt="Stars"
            />
          </div>
        </div> */}

        <Heading
          tag="Get started with Ujenzi Linking Solutions"
          title="Choose Us, Choose forever"
          text=""
          className="text-center"
        />
        <img
  src={two}
  className="w-full border-2 border-n-9 rounded-md"
  width={200}
  height={100}
  alt="two"
/>
        

        {/* <div className="relative">
          <PricingList />
          <LeftLine />
          <RightLine />
        </div> */}

        {/* <div className="flex justify-center mt-10">
          <a
            className="text-xs font-code font-bold tracking-wider uppercase border-b"
            href="/pricing"
          >
            MORE ABOUT US
          </a>
          
        </div> */}
        <div className="flex justify-center mt-10 lg:flex">
          
      <div className="flex-col items-center max-w-[50rem] mx-auto mb-3 lg:mb-20 md:text-center">
        <Heading className="text-center" title="Get In Touch"/>
        <a className=" flex-col flex items-center max-w-[50rem] mx-auto mb-12 lg:mb-20 md:text-center" >
          <FontAwesomeIcon icon={faMapMarkerAlt} size="lg" className="mr-2 mb-1"/> 
          <h5  style={{ fontSize: '1rem' }}className="mb-6 text-center">Mikocheni kwa Warioba near<br/>
Laureate International School,<br/>
Dar es Salaam-Tanzania</h5>
          <FontAwesomeIcon icon={faPhone} size="lg" className="mr-2 mb-1" /> 
          <h5 style={{ fontSize: '1rem' }}className="mb-6">(+255) 755 753 883 </h5>
          <h5 style={{ fontSize: '1rem' }}className="mb-6">(+255) 789 345 845</h5>
          <FontAwesomeIcon icon={faEnvelope}  size="lg" className="" /> 
          <h5 style={{ fontSize: '1rem' }}className="mb-6">ujenzilinkingsolutions@gmail.com</h5>
        </a>
      </div>  
    </div>
      </div>
    </Section>
  );
};

export default Pricing;
