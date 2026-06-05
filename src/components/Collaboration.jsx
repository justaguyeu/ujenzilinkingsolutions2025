import { brainwaveSymbol, check } from "../assets";
// eslint-disable-next-line no-unused-vars
import { collabApps, collabContent, collabText,brainwaveServices, brainwaveServicesIcons, } from "../constants";
// import Button from "./Button";
import Section from "./Section";
// import { LeftCurve, RightCurve } from "./design/Collaboration";

const Collaboration = () => {
  return (
    <Section crosses>
      <div className="container lg:flex">
        <div className="max-w-[25rem]">
          <h2 className="h2 mb-4 md:mb-8">
            What We Do Best
          </h2>

          <ul className="max-w-[22rem] mb-10 md:mb-14">
            {collabContent.map((item) => (
              <li className="mb-3 py-3" key={item.id}>
                <div className="flex items-center">
                  <img src={check} width={24} height={24} alt="" role="presentation" />
                  <h6 className="body-2 ml-5 text-n-14 font-bold">{item.title}</h6>
                </div>
                {item.text && (
                  <p className="body-2 mt-3 text-n-4 ">{item.text}</p>
                )}
              </li>
            ))}
          </ul>

          {/* <Button>Download Now</Button> */}
        </div>

        <div className="lg:ml-auto xl:w-[38rem] mt-4">
          <p className="body-2 mb-8 text-n-4 md:mb-16 lg:mb-32 lg:w-[22rem] lg:mx-auto">
            {/* {collabText} */}
          </p>

          <div className="relative w-full overflow-hidden">
  {/* Moving container */}
  <ul className="flex animate-scroll">
    {collabApps.concat(collabApps).map((app, index) => (
      <li 
        key={index} 
        className="flex-shrink-0 w-[10rem] h-[20rem] flex items-center justify-center mx-6"
      >
        <img
          className="max-w-full max-h-full"
          width={app.width}
          height={app.height}
          alt={app.title}
          src={app.icon}
        />
      </li>
    ))}
  </ul>
</div>


          {/* <ul className="flex items-center justify-between mt-12">
                  {brainwaveServicesIcons.map((item, index) => (
                    <li
                      key={index}
                      className={`rounded-2xl flex items-center justify-center ${
                        index * 45
                          ? "w-[3rem] h-[3rem] p-0.25 bg-conic-gradient md:w-[4.5rem] md:h-[4.5rem]"
                          : "flex w-10 h-10  md:w-15 md:h-15"
                      }`}
                    >
                      <div
                        className={
                          index * 45
                            ? "flex items-center justify-center w-full h-full  rounded-[1rem]"
                            : ""
                        }
                      >
                        <img src={item} width={24} height={24} alt="" role="presentation" />
                      </div>
                    </li>
                  ))}
                </ul> */}
        </div>
      </div>
    </Section>
  );
};

export default Collaboration;