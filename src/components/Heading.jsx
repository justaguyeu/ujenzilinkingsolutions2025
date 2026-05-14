/* eslint-disable react/prop-types */
import TagLine from "./Tagline";

const Heading = ({ className, title, text, tag }) => {
  return (
    <div
      className={`${className} max-w-[50rem] mx-auto mb-1 lg:mb-3 md:text-left`}
    >
      {tag && <TagLine className="mb-4 md:justify-left">{tag}</TagLine>}
      {title && <h2 className="h2 text-color-1">{title}</h2>}
      {text && <p className="body-2 mt-4 text-n-4">{text}</p>}
    </div>
  );
};

export default Heading;
