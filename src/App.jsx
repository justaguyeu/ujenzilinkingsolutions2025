/* eslint-disable no-unused-vars */
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import CookieConsent from "react-cookie-consent";

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
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));
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
      {/* ✅ Cookie Consent Banner */}
      <CookieConsent
        location="bottom"
        buttonText="Accept All"
        declineButtonText="Reject"
        enableDeclineButton
        cookieName="ujenzi-cookie-consent"
        style={{
          background: "#ffffff",
          color: "#000000",
          border: "1px solid #DB9029",
          fontSize: "14px",
          alignItems: "center",
          padding: "16px 24px",
        }}
        buttonStyle={{
          background: "#DB9029",
          color: "#ffffff",
          fontSize: "13px",
          fontWeight: "bold",
          borderRadius: "6px",
          padding: "8px 20px",
        }}
        declineButtonStyle={{
          background: "transparent",
          border: "1px solid #DB9029",
          color: "#000000ff",
          fontSize: "13px",
          borderRadius: "6px",
          padding: "8px 20px",
        }}
        expires={150}
        onAccept={() => {
        }}
        onDecline={() => {
        }}
      >
        We use cookies to improve your experience on our site. By accepting,
        you agree to our{" "}
        <a
          href="/privacy-policy"
          style={{ color: "#DB9029", textDecoration: "underline" }}
        >
          Privacy Policy
        </a>
        .
      </CookieConsent>

      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <ScrollToTop />
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Benefits detail */}
          <Route
            path="/benefits/:id"
            element={
              <Suspense fallback={<Fallback />}>
                <BenefitDetail />
              </Suspense>
            }
          />

          {/* About Us */}
          <Route
            path="/aboutus"
            element={
              <Suspense fallback={<Fallback />}>
                <AboutUs />
              </Suspense>
            }
          />

          {/* Services */}
          <Route
            path="/serviceses"
            element={
              <Suspense fallback={<Fallback />}>
                <Serviceses />
              </Suspense>
            }
          />

          {/* Future */}
          <Route
            path="/future"
            element={
              <Suspense fallback={<Fallback />}>
                <Future />
              </Suspense>
            }
          />

          {/* Chomoza */}
          <Route
            path="/chomoza"
            element={
              <Suspense fallback={<Fallback />}>
                <Chomoza />
              </Suspense>
            }
          />

          {/* Join Team */}
          <Route
            path="/join"
            element={
              <Suspense fallback={<Fallback />}>
                <JoinTeam />
              </Suspense>
            }
          />

          {/* Learn With Us */}
          <Route
            path="/learn"
            element={
              <Suspense fallback={<Fallback />}>
                <LearnWithUs />
              </Suspense>
            }
          />

          {/* Privacy Policy */}
          <Route
            path="/privacy-policy"
            element={
              <Suspense fallback={<Fallback />}>
                <PrivacyPolicy />
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