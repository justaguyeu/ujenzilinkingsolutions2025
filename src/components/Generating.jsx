/* eslint-disable react/prop-types */
import { loading } from "../assets";

const Generating = ({ className }) => {
  return (
    <div
      className={`flex items-center h-[3.5rem] px-6 bg-n-8/80 rounded-[1.7rem] border-n-14 ${
        className || ""
      } text-base`}
    >
      <img className="w-5 h-5 mr-4" src={loading} alt="Loading" />
      #Sales & Marketing Tips
    </div>
  );
};

export default Generating;
