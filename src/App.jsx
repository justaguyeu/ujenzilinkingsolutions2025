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
import { lazy, Suspense } from "react";

import ButtonGradient from "./assets/svg/ButtonGradient";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Benefits from "./components/Benefits";
import Future from "./components/Future";

// Lazy load non-critical components
const AboutUs = lazy(() => import("./components/AboutUs"));
const Serviceses = lazy(() => import("./components/Serviceses"));
const Collaboration = lazy(() => import("./components/Collaboration"));
const Services = lazy(() => import("./components/Services"));
const Servicess = lazy(() => import("./components/Servicess"));
const BenefitDetail = lazy(() => import("./components/BenefitDetail"));
const Pricing = lazy(() => import("./components/Pricing"));

function Home() {
  return (
    <>

      <Header />

      <Hero />
      <Benefits />
      <Suspense fallback={<div className="container py-10 text-center">Loading...</div>}>
        <Collaboration />
        <Services />
        <Pricing />
        <Servicess />
      </Suspense>
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
          <Route path="/benefits/:id" element={
            <Suspense fallback={<div className="container py-10 text-center">Loading...</div>}>
              <BenefitDetail />
            </Suspense>
          } />
          <Route path="/aboutus" element={
            <Suspense fallback={<div className="container py-10 text-center">Loading...</div>}>
              <AboutUs />
            </Suspense>
          } />
          <Route path="/serviceses" element={
            <Suspense fallback={<div className="container py-10 text-center">Loading...</div>}>
              <Serviceses />
            </Suspense>
          } />
          <Route path="/future" element={
            <Suspense fallback={<div className="container py-10 text-center">Loading...</div>}>
              <Future />
            </Suspense>
          } />
        </Routes>

      </div>

      <ButtonGradient />
    </>
  );
};

export default App;


