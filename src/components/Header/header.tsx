import React from "react";
import { FaShieldDog } from "react-icons/fa6";

const Header: React.FC = () => {
  return (
    <div className="flex flex-col bg-slate-700 items-center text-slate-100 gap-2 p-5 text-4xl">
      <h1>
        <FaShieldDog fontSize={"6rem"}></FaShieldDog>
      </h1>
      <h1>Habit Puppy</h1>
      <h3 className="text-lg">
        Track your <b>HABITS</b>. Improve your <b>LIFE</b>!
      </h3>
    </div>
  );
};

export default Header;
