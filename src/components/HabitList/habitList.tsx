"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useHabitContext } from "@/context/habitContext";
import { useEffect } from "react";
import { TiCancel, TiTick } from "react-icons/ti";

import "./style.css";

export default function HabitList() {
  const { habit, fetchFromStore, fetched, checkDate, updateToday } =
    useHabitContext();

  useEffect(() => {
    if (!fetched) {
      fetchFromStore();
      return;
    }
    checkDate();
  }, []);

  const checkHabit = (
    completed: boolean,
    habit: string,
    e: React.MouseEvent<SVGElement, MouseEvent>
  ) => {
    const card = e.currentTarget.parentElement?.parentElement?.parentElement;
    if (card) {
      card.classList.add(`remove`, `${completed ? "completed" : "incomplete"}`);
    }
    updateToday(completed, habit);
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full bg-slate-700 py-5 absolute overflow-hidden">
      {habit?.today?.habits.map((value) => (
        <Card className="w-11/12 max-w-4xl" key={value}>
          <CardContent className="p-4 flex justify-between items-center">
            <div className="text-xl">{value}</div>
            <div className="flex gap-2">
              <TiTick
                size={"1.7rem"}
                className="cursor-pointer hover:text-green-600"
                onClick={(e: React.MouseEvent<SVGElement, MouseEvent>) =>
                  checkHabit(true, value, e)
                }
              />
              <TiCancel
                size={"1.7rem"}
                className="cursor-pointer hover:text-red-600"
                onClick={(e: React.MouseEvent<SVGElement, MouseEvent>) =>
                  checkHabit(false, value, e)
                }
              />
            </div>
          </CardContent>
        </Card>
      ))}
      {habit?.today?.completed?.length > 0 && (
        <h1 className="text-lg text-white">
          Tasks Completed ({habit?.today?.completed?.length})
        </h1>
      )}
      {habit?.today?.completed?.map((value) => (
        <Card className="w-11/12 max-w-4xl bg-green-200" key={value}>
          <CardContent className="p-4 flex justify-between items-center">
            <div className="text-xl">{value}</div>
          </CardContent>
        </Card>
      ))}
      {habit?.today?.notCompleted?.length > 0 && (
        <h1 className="text-lg text-white">
          Tasks Not Completed ({habit?.today?.notCompleted?.length})
        </h1>
      )}
      {habit?.today?.notCompleted?.map((value) => (
        <Card className="w-11/12 max-w-4xl bg-red-200" key={value}>
          <CardContent className="p-4 flex justify-between items-center">
            <div className="text-xl">{value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
