"use client";
import React, { useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import "./style.css";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";

const ANIMATIONDURATION = 550; //0.5s

const Menu: React.FC = () => {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState([
    { text: "HABITS TODAY", opened: false, route: "/" },
    { text: "EDIT HABIT", opened: false, route: "/edit" },
    { text: "TRACK HABIT", opened: false, route: "/track" },
    { text: "HABIT DASHBOARD", opened: false, route: "/dash" },
    { text: "GYM SET TRACKER", opened: false, route: "/setgym" },
    { text: "SIGN OUT", opened: false, route: "signout" },
  ]);

  const { signOut } = useAuth();

  const openCloseMenu = (index: number = 0, close: boolean) => {
    if (close && index < 0) return;
    if (!close && index >= menuItems.length) return;
    setMenuItems((prevState) =>
      prevState.map((value, idx) => {
        if (index === idx) return { ...value, opened: !value.opened };
        return value;
      })
    );
    return setTimeout(() => {
      openCloseMenu(close ? index - 1 : index + 1, close);
    }, ANIMATIONDURATION / menuItems.length);
  };

  const handleCLick = async (index: number) => {
    if (
      !menuItems[index].opened ||
      menuItems[index].route === window.location.pathname
    )
      return;
    if (menuItems[index].route === "signout") {
      await signOut();
      router.push("/signin");
      return;
    }
    router.push(menuItems[index].route);
  };

  return (
    <div
      className="fixed p-3 top-2 right-2 flex flex-col items-end gap-1 cursor-pointer opacityBG rounded-md"
      onClick={(_) =>
        openCloseMenu(
          menuItems[0].opened ? menuItems.length - 1 : 0,
          menuItems[0].opened
        )
      }
    >
      {menuItems.map((item, idx) => (
        <h3
          className={`text-slate-200 border-solid border-2 overflow-hidden rounded-lg w-60 px-6 py-2 text-center bg-slate-700 cursor-pointer whitespace-nowrap animate ${
            item.opened ? "opened" : "closed"
          } ${idx > 2 && !item.opened ? "over" : ""}`}
          onClick={() => handleCLick(idx)}
          key={item.text}
        >
          {item.text}
        </h3>
      ))}
      {menuItems[menuItems.length - 1].opened && (
        <div className="p-2 self-center">
          <IoMdCloseCircleOutline size={"1.7rem"} color={"#e2e8f0"} />
        </div>
      )}
    </div>
  );
};

export default Menu;
