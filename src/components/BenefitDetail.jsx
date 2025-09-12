import { useParams } from "react-router-dom";
import { benefits } from "../constants";
import Header2 from "./Header2";
import Footer from "./Footer";
import Section from "./Section";
import { Phone } from "lucide-react";
import { curve } from "../assets";

const BenefitDetail = () => {
  const { id } = useParams();
  const benefit = benefits.find((b) => b.id === id);

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
      <Section id="features">
      <div className="container relative z-2">

      <div className="container mx-auto p-10">
        <h1 className="h1 mb-6">
                    <span className="inline-block relative">
                      UJENZI LINKING SOLUTIONS{" "}
                      <img
                        src={curve}
                        className="absolute top-full left-0 w-full xl:-mt-2 "
                        width={624}
                        height={28}
                        alt="Curve"
                      />
                    </span>
                  </h1>
        <h1 className="text-3xl font-bold mb-4 mt-10">{benefit.title}</h1>
        
        <p className="mb-8 text-lg">{benefit.text}</p>

        {benefit.companies && benefit.companies.length > 0 ? (
          <div className="space-y-6">
            {benefit.companies.map((company, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-n-8 p-6 rounded-lg shadow"
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-20 h-20 object-contain rounded"
                />

                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{company.name}</h2>
                  <p className="text-gray-700 mb-2">{company.description}</p>
                  <p className="flex items-center gap-2 text-gray-700"></p>
                 <p className="flex items-center gap-2 text-gray-700">
  {/* Phone button */}
  <a
    href={`tel:${company.phone}`}
    className="flex items-center gap-2 px-3 py-1 bg-n-6 text-white rounded-lg hover:bg-n-1 transition"
  >
    <Phone size={18} />
    Call
  </a>
</p>




                  {/* <p className="text-gray-700">Phone: {company.phone}</p> */}
                  <p className="text-gray-700">
                    Location:{" "}
                    <a
                      href={company.location}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View on Google Maps
                    </a>
                  </p>
                  <p className="text-gray-700">
                    Website:{" "}
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {company.website}
                    </a>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg mt-8">
            No companies registered
          </p>
        )}

        {/* {benefit.imageUrl && (
          <img
            src={benefit.imageUrl}
            alt={benefit.title}
            className="rounded-lg shadow-lg mt-8 max-w-xl mx-auto"
          />
        )} */}
      </div></div></Section>

      <Footer />
    </>
  );
};

export default BenefitDetail;
