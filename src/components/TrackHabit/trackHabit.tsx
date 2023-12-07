"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useHabitContext } from "@/context/habitContext";
import { useEffect } from "react";

const Months = {
  0: "Jan",
  1: "Feb",
  2: "Mar",
  3: "Apr",
  4: "May",
  5: "Jun",
  6: "Jul",
  7: "Aug",
  8: "Sep",
  9: "Oct",
  10: "Nov",
  11: "Dec",
};

export default function TrackHabit() {
  const { habit, fetched, fetchFromStore, checkDate } = useHabitContext();
  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  useEffect(() => {
    if (!fetched) {
      fetchFromStore();
      return;
    }
    checkDate();
  }, []);

  return (
    <div className="flex justify-center items-center gap-3 min-w-full bg-slate-700 py-5 absolute flex-col">
      {habit?.habitList?.habits &&
        habit?.habitList?.habits.map((item, idx) => (
          <Card className="w-11/12 max-w-4xl" key={item.habit}>
            <CardContent className="p-4 flex justify-between">
              <div className="text-xl">{item.habit}</div>
              <div className="text-xl">
                {habit.habitList.habits[idx].completion[`${year}`]
                  ? Object.keys(
                      habit.habitList.habits[idx].completion[`${year}`]
                    ).reduce(
                      (acc, current) =>
                        acc +
                        habit.habitList.habits[idx].completion[`${year}`][
                          current
                        ],
                      0
                    )
                  : 0}
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
