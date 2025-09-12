/* eslint-disable no-unused-vars */
// import ButtonGradient from "./assets/svg/ButtonGradient";
// import Benefits from "./components/Benefits";
// import Collaboration from "./components/Collaboration";
// import Footer from "./components/Footer";
// import Header from "./components/Header";
// import Hero from "./components/Hero";
// import Pricing from "./components/Pricing";
// import Roadmap from "./components/Roadmap";
// import Services from "./components/Services";

// const App = () => {
//   return (
//     <>
//       <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
//         <Header />
//         <Hero />
//         <Benefits />
//         <Collaboration />
//         <Services />
//         <Pricing />
//         <Roadmap />
//         <Footer />
//       </div>

//       <ButtonGradient />
//     </>
//   );
// };

// export default App;

import { Routes, Route } from "react-router-dom";

import ButtonGradient from "./assets/svg/ButtonGradient";
import Benefits from "./components/Benefits";
import AboutUs from "./components/AboutUs";
import Serviceses from "./components/Serviceses";
import Collaboration from "./components/Collaboration";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Pricing from "./components/Pricing";
import Services from "./components/Services";
import BenefitDetail from "./components/BenefitDetail"; // new details page

function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Benefits />
      <Collaboration />
      <Services />
      <Pricing />
      <Footer />
    </>
  );
}

const App = () => {
  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/benefits/:id" element={<BenefitDetail />} />
          <Route path="/aboutus" element={<AboutUs/>} />
          <Route path="/serviceses" element={<Serviceses/>} />

        </Routes>
      </div>

      <ButtonGradient />
    </>
  );
};

export default App;


