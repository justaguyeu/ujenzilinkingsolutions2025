/* eslint-disable no-unused-vars */
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import ButtonGradient from "./assets/svg/ButtonGradient";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Benefits from "./components/Benefits";
import Future from "./components/Future";
import Chomoza from "./components/Chomoza";
import ScrollToTop from "./components/ScrollToTop";
import JoinTeam from "./components/JoinTeam";
import LearnWithUs from "./components/LearnWithUs";

// Lazy load non-critical components
const AboutUs = lazy(() => import("./components/AboutUs"));
const Serviceses = lazy(() => import("./components/Serviceses"));
const Collaboration = lazy(() => import("./components/Collaboration"));
const Services = lazy(() => import("./components/Services"));
const Servicess = lazy(() => import("./components/Servicess"));
const BenefitDetail = lazy(() => import("./components/BenefitDetail"));
const Pricing = lazy(() => import("./components/Pricing"));
const AdminExport = lazy(() => import("./components/AdminExport"));

const Fallback = () => (
  <div className="container py-10 text-center text-n-4">Loading...</div>
);

function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Benefits />
      <Suspense fallback={<Fallback />}>
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
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/benefits/:id"
            element={
              <Suspense fallback={<Fallback />}>
                <BenefitDetail />
              </Suspense>
            }
          />

          <Route
            path="/aboutus"
            element={
              <Suspense fallback={<Fallback />}>
                <AboutUs />
              </Suspense>
            }
          />

          <Route
            path="/serviceses"
            element={
              <Suspense fallback={<Fallback />}>
                <Serviceses />
              </Suspense>
            }
          />

          <Route
            path="/future"
            element={
              <Suspense fallback={<Fallback />}>
                <Future />
              </Suspense>
            }
          />

          <Route
            path="/chomoza"
            element={
              <Suspense fallback={<Fallback />}>
                <Chomoza />
              </Suspense>
            }
          />

          <Route
            path="/join"
            element={
              <Suspense fallback={<Fallback />}>
                <JoinTeam />
              </Suspense>
            }
          />

          <Route
            path="/learn"
            element={
              <Suspense fallback={<Fallback />}>
                <LearnWithUs />
              </Suspense>
            }
          />

          {/* Admin — password-protected registrations dashboard */}
          <Route
            path="/admin/registrations"
            element={
              <Suspense fallback={<Fallback />}>
                <AdminExport />
              </Suspense>
            }
          />
        </Routes>
      </div>

      <ButtonGradient />
    </>
  );
};

export default App;