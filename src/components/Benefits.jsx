import { benefits } from "../constants";
import Heading from "./Heading";
import Section from "./Section";
import Arrow from "../assets/svg/Arrow";
import { GradientLight } from "./design/Benefits";
import ClipPath from "../assets/svg/ClipPath";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Plus } from "lucide-react";
import RegistrationModal from "./RegistrationModal";

const Benefits = () => {
  const [regModalOpen, setRegModalOpen] = useState(false);

  return (
    <Section id="features">
      <div className="container relative z-2">
        <Heading
          className="md:max-w-md lg:max-w-2xl text-color-1"
          title="Connecting from Global to Local Building & Construction Stakeholders"
        />

        {/* ── Register CTA Banner ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4
                        bg-n-8 border border-n-6 rounded-2xl px-6 py-5 mb-10">
          <div>
            <h3 className="text-n-1 font-bold text-lg">Own a business?</h3>
            <p className="text-n-4 text-sm mt-0.5">
              Get listed in our directory and reach more customers instantly.
            </p>
          </div>
          <button
            onClick={() => setRegModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-color-1 text-n-8
                       font-bold rounded-xl hover:opacity-90 active:scale-95
                       transition-all duration-150 text-sm flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            Register Your Business
          </button>
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
                  <Link
                    to={`/benefits/${item.id}`}
                    className="ml-auto flex items-center font-code text-xs font-bold text-color-1 uppercase tracking-wider hover:text-n-1"
                  >
                    View All
                    <Arrow />
                  </Link>
                </div>
              </div>

              {item.light && <GradientLight />}

              <div
                className="absolute inset-0.5 group bg-n-8"
                style={{ clipPath: "url(#benefits)" }}
              >
                <div className="absolute inset-0 bg-black opacity-20 transition-opacity duration-300 group-hover:opacity-60">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      width={380}
                      height={362}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>
              </div>

              <ClipPath />
            </div>
          ))}
        </div>
      </div>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={regModalOpen}
        onClose={() => setRegModalOpen(false)}
      />
    </Section>
  );
};

export default Benefits;