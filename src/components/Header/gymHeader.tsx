import React from "react";
import { GiGymBag } from "react-icons/gi";

const Header: React.FC = () => {
  return (
    <div className="flex flex-col bg-slate-700 items-center text-slate-100 gap-2 p-5 text-4xl">
      <h1>
        <GiGymBag fontSize={"6rem"}></GiGymBag>
      </h1>
      <h1>GYM Set Tracker</h1>
      <h3 className="text-lg">
        Track your <b>SETS</b>. Improve your <b>GAINS</b>!
      </h3>
    </div>
  );
};

export default Header;
