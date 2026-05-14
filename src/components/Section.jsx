/* eslint-disable react/prop-types */
import SectionSvg from "../assets/svg/SectionSvg";

const Section = ({
  className,
  id,
  crosses,
  crossesOffset,
  customPaddings,
  children,
}) => {
  return (
    <div
      id={id}
      className={`
        relative
        ${
          customPaddings ||
          `
            py-8
            sm:py-12
            md:py-16
            lg:py-20
            xl:py-24
            ${crosses ? "lg:py-28 xl:py-32" : ""}
          `
        }
        ${className || ""}
      `}
    >
      {children}

      {crosses && (
        <>
          <div
            className={`
              hidden lg:block
              absolute top-0
              left-5 right-5
              lg:left-7.5 lg:right-7.5
              xl:left-10 xl:right-10
              h-px
              bg-stroke-1
              pointer-events-none
              ${crossesOffset || ""}
            `}
          />
          <SectionSvg crossesOffset={crossesOffset} />
        </>
      )}
    </div>
  );
};

export default Section;