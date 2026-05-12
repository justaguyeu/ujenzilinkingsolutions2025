import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { benefits } from "../constants";
import Header2 from "./Header2";
import Footer from "./Footer";
import Section from "./Section";
import { Phone } from "lucide-react";
import { curve } from "../assets";

const BenefitDetail = () => {
  const { id } = useParams();
  const benefit = benefits.find((b) => b.id === id);

  const [zoomedImage, setZoomedImage] = useState(null); // State to track zoomed image

  if (!benefit) {
    return (
      <>
        <Header2 />
        <div className="p-10 text-red-500">Benefit not found</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header2 />
      <Section>
        <div className="container relative z-2  text-center md:text-left">
          <div className="container mx-auto p-10">
            <h1 className="h1 mb-6">
              <span className="inline-block relative">
                UJENZI LINKING SOLUTIONS{" "}
                <img
                  src={curve}
                  className="absolute top-full left-0 w-full xl:-mt-2"
                  width={624}
                  height={28}
                  alt="Curve"
                />
              </span>
            </h1>

            <div className="flex flex-col md:flex-row items-center md:items-center gap-6 bg-n-8 p-6 rounded-lg shadow">
              
              <img
                src={benefit.imageUrl}
                className="border-2 border-n-9 rounded-full"
                alt=""
                width={200}
                height={28}
              />
              <h1 className="text-3xl font-bold">{benefit.title}</h1>
              {/* <p className="text-lg">{benefit.text}</p> */}
            </div>

            {benefit.companies && benefit.companies.length > 0 ? (
              <div className="space-y-6 mt-6">
                {benefit.companies.map((company, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col md:flex-row items-center md:items-center gap-6 bg-n-8 p-6 rounded-lg shadow"
                  >
                    <div className="flex-1">
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="w-200 h-20 object-contain rounded mb-4"
                      />
                      <h2 className="text-xl font-semibold">{company.name}</h2>
                      <p className="text-gray-700 mb-2">{company.description}</p>

                      <div className="flex flex-col md:flex-row items-center md:items-center gap-6 mt-6">
                        {/* Zoomable Images */}
                        {[company.logo2, company.logo3].map((logo, i) => (
                          <motion.img
                            key={i}
                            src={logo}
                            className="border-2 border-n-9 cursor-pointer"
                            alt={`Logo ${i + 2}`}
                            width={300}
                            height={28}
                            onClick={() => setZoomedImage(logo)}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          />
                        ))}

                        <a
                          href={`tel:${company.phone}`}
                          className="flex items-center gap-2 px-3 py-1 bg-n-6 text-white rounded-lg hover:bg-n-1 transition"
                        >
                          <Phone size={18} />
                          Call
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 text-lg mt-8">
                No companies registered
              </p>
            )}
          </div>
        </div>
      </Section>

      {/* Zoom Modal */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedImage(null)}
          >
            <motion.img
              src={zoomedImage}
              className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg shadow-lg"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
};

export default BenefitDetail;
